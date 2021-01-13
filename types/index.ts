import Spotify from "./spotify-api";

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface SocketState {
  progress_ms: number | null;
  is_playing: boolean | null;
  currently_playing_type: CurrentlyPlayingType | null;
  item: Spotify.TrackObjectFull | null;
  volume_percent: number | null;
}

export interface PlayerState {
  device: Device;
  repeat_state: "off" | "track" | "context";
  shuffle_state: boolean;
  context: Context | null;
  timestamp: number;
  progress_ms: number;
  is_playing: boolean;
  item: Spotify.TrackObjectFull | null;
  currently_playing_type: CurrentlyPlayingType;
  actions: any;
}

export interface Device {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: DeviceType;
  volume_percent: number;
}

export interface Context {
  external_urls: {
    spotify: string;
  };
  href: string;
  type: string;
  uri: string;
}

export type CurrentlyPlayingType = "track" | "ad" | "episode" | "unknown";

export type DeviceType =
  | "Computer"
  | "Tablet"
  | "Smartphone"
  | "Speaker"
  | "TV"
  | "AVR"
  | "STB"
  | "AudioDongle"
  | "GameConsole"
  | "CastVideo"
  | "CastAudio"
  | "Automobile"
  | "Unknown";
