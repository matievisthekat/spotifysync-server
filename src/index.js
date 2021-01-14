require("dotenv").config();

const express = require("express");
const { Server } = require("socket.io");
const { isTokenExpired, refreshToken, getPlayerState } = require("./spotify.js");

const port = process.env.PORT || 3000;
const intervalSeconds = 1.5;
const app = express();
app.set("json spaces", 2);

app.get("/", (req, res) => res.status(200).json({ success: true, message: "tunein-server is up and running!" }));

const server = app.listen(port, () => console.log(`Listening on localhost:${port}`));
const io = new Server(server);

let state = {
  progress_ms: null,
  currently_playing_type: null,
  is_playing: null,
  item: null,
  volume_percent: null,
};

async function tick() {
  const expired = isTokenExpired();
  if (expired) await refreshToken();
  console.log("Expired:", expired);

  const player = await getPlayerState();

  if (player.item?.id !== state.item?.id) updateItem(player.item);
  if (player.device?.volume_percent !== state.volume_percent) updateVolume(player.device?.volume_percent);
  if (player.is_playing !== state.is_playing) updatePlaying(player.is_playing);
  if (player.progress_ms !== state.progress_ms) updateProgress(player.progress_ms);
  if (player.currently_playing_type !== state.currently_playing_type) updateCurrentType(player.currently_playing_type);
}

function broadcast(e, ...args) {
  io.sockets.emit(e, ...args);
}

function updateItem(newItem) {
  broadcast("track_change", state.item, newItem);
  state.item = newItem;
}

function updateVolume(newVol) {
  broadcast("volume_change", state.volume_percent, newVol);
  state.volume_percent = newVol;
}

function updatePlaying(newPlaying) {
  broadcast("is_playing_change", state.is_playing, newPlaying);
  state.is_playing = newPlaying;
}

function updateProgress(newProgress) {
  broadcast("progress_change", state.progress_ms, newProgress);
  state.progress_ms = newProgress;
}

function updateCurrentType(newType) {
  broadcast("currently_playing_type_change", state.currently_playing_type, newType);
  state.currently_playing_type = newType;
}

tick()
  .catch((err) => console.log(err.response?.data || err))
  .finally(() => {
    setInterval(async () => {
      if (io.sockets.sockets.size > 0) await tick().catch((err) => console.log(err.response?.data || err));
    }, intervalSeconds * 1000);
  });

io.on("connection", (socket) => {
  socket.emit("initial_state", state);
});
