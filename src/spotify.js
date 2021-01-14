const Axios = require("axios");
const fs = require("fs-extra");
const qs = require("querystring");
const path = require("path");

const configPath = path.join(__dirname, "..", "config.json");
const basic = Buffer.from(`${config().client_id}:${config().client_secret}`).toString("base64");
const API = "https://api.spotify.com/v1";

function getPlayerState() {
  return new Promise((resolve, reject) => {
    Axios.get(`${API}/me/player`, {
      headers: {
        Authorization: `Bearer ${config().access_token}`,
      },
    })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
}

function isTokenExpired() {
  delete require.cache[require.resolve(configPath)];

  const expiresMs = config().expires_in * 1000;
  const fetched = config().fetched_timestamp;
  const now = Date.now();

  return fetched + expiresMs <= now;
}

function refreshToken() {
  return new Promise((resolve, reject) => {
    const data = {
      grant_type: "refresh_token",
      refresh_token: config().refresh_token,
    };

    Axios.post("https://accounts.spotify.com/api/token", qs.stringify(data), {
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
            client_id: config().client_id,
            client_secret: config().client_secret,
            access_token,
            refresh_token: config().refresh_token,
            expires_in,
            fetched_timestamp,
          })
        );

        resolve();
      })
      .catch(reject);
  });
}

function config() {
  return fs.readJSONSync(configPath);
}

module.exports = { getPlayerState, refreshToken, isTokenExpired }
