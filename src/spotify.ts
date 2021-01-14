import Axios from "axios";
import fs from "fs-extra";
import qs from "querystring";
import path from "path";
import config from "../config.json";
import { TokenResponse, PlayerState } from "../types";

const basic = Buffer.from(`${config.client_id}:${config.client_secret}`).toString("base64");
const API = "https://api.spotify.com/v1";

export function getPlayerState() {
  return new Promise<PlayerState>((resolve, reject) => {
    Axios.get<PlayerState>(`${API}/me/player`, {
      headers: {
        Authorization: `Bearer ${require("../config").access_token}`,
      },
    })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
}

export function isTokenExpired() {
  const expiresMs = config.expires_in * 1000;
  const fetched = config.fetched_timestamp;
  const now = Date.now();

  return fetched + expiresMs <= now;
}

export function refreshToken() {
  return new Promise<void>((resolve, reject) => {
    const data = {
      grant_type: "refresh_token",
      refresh_token: config.refresh_token,
    };

    Axios.post<TokenResponse>("https://accounts.spotify.com/api/token", qs.stringify(data), {
      headers: {
        Authorization: `Basic ${basic}`,
      },
    })
      .then(async (res) => {
        const { access_token, expires_in } = res.data;
        const fetched_timestamp = Date.now();
        const configPath = path.resolve("config.json");

        await fs.writeJSON(configPath, {
          client_id: config.client_id,
          client_secret: config.client_secret,
          access_token,
          refresh_token: config.refresh_token,
          expires_in,
          fetched_timestamp,
        });

        delete require.cache[path.join(__dirname, "..", "config.json")];

        resolve();
      })
      .catch(reject);
  });
}
