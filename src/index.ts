import express from "express";
import { Server } from "socket.io";
import spotifyConnect from "spotify-connect-ws";

const port = process.env.PORT || 3000;
const app = express();
const server = app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
const io = new Server(server);

io.of("connect").on("connection", spotifyConnect);
