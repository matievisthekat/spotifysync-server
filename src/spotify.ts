import Axios from "axios";
import fs from "fs-extra";
import qs from "querystring";
import path from "path";
import { TokenResponse, PlayerState } from "../types";

const configPath = path.join(__dirname, "..", "config.json");
const basic = Buffer.from(`${require(configPath).client_id}:${require(configPath).client_secret}`).toString("base64");
const API = "https://api.spotify.com/v1";

export function getPlayerState() {
  return new Promise<PlayerState>((resolve, reject) => {
    Axios.get<PlayerState>(`${API}/me/player`, {
      headers: {
        Authorization: `Bearer ${require(configPath).access_token}`,
      },
    })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
}

export function isTokenExpired() {
  delete require.cache[require.resolve(configPath)];

  const expiresMs = require(configPath).expires_in * 1000;
  const fetched = require(configPath).fetched_timestamp;
  const now = Date.now();

  return fetched + expiresMs <= now;
}

export function refreshToken() {
  return new Promise<void>((resolve, reject) => {
    const data = {
      grant_type: "refresh_token",
      refresh_token: require(configPath).refresh_token,
    };

    Axios.post<TokenResponse>("https://accounts.spotify.com/api/token", qs.stringify(data), {
      headers: {
        Authorization: `Basic ${basic}`,
      },
    })
      .then(async (res) => {
        const { access_token, expires_in } = res.data;
        const fetched_timestamp = Date.now();

        await fs.writeFile(
          configPath,
          JSON.stringify({
            client_id: require(configPath).client_id,
            client_secret: require(configPath).client_secret,
            access_token,
            refresh_token: require(configPath).refresh_token,
            expires_in,
            fetched_timestamp,
          })
        );

        resolve();
      })
      .catch(reject);
  });
}
