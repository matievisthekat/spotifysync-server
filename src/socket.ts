import { Socket } from "socket.io";
import { SocketState } from "../types";
import Spotify from "../types/spotify-api";
import { isTokenExpired, refreshToken, getPlayerState } from "./spotify";

let state: SocketState = {
  progress_ms: null,
  currently_playing_type: null,
  is_playing: null,
  item: null,
  volume_percent: null,
};

export default function (socket: Socket) {
  const broadcast = (e: string, ...args: any) => socket.broadcast.emit(e, ...args);

  const updateItem = (newItem: Spotify.TrackObjectFull | null) => {
    broadcast("track_change", state.item, newItem);
    state.item = newItem;
  };

  const updateVolume = (newVol: number) => {
    broadcast("volume_change", state.volume_percent, newVol);
    state.volume_percent = newVol;
  };

  const updatePlaying = (newPlaying: boolean) => {
    broadcast("is_playing_change", state.is_playing, newPlaying);
    state.is_playing = newPlaying;
  };

  const updateProgress = (newProgress: number) => {
    broadcast("progress_change", state.progress_ms, newProgress);
    state.progress_ms = newProgress;
  };

  async function tick() {
    const player = await getPlayerState();

    if (player.item !== state.item) updateItem(player.item);
    if (player.device.volume_percent !== state.volume_percent) updateVolume(player.device.volume_percent);
    if (player.is_playing !== state.is_playing) updatePlaying(player.is_playing);
    if (player.progress_ms !== state.progress_ms) updateProgress(player.progress_ms);
  }

  
}
