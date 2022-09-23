import React from "react";
import Visual from "./components/Visual";
import credentials from "./credentials.json";

export const authEndpoint = "https://accounts.spotify.com/authorize";

const redirectUri = credentials.redirect_uri;
const clientId = credentials.client_id;
const responseType = "code";

const scopes = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "user-read-currently-playing",
  "user-library-modify",
  "user-read-playback-state",
  "app-remote-control",
  "streaming",
  "user-modify-playback-state",
  "user-read-recently-played",
  "user-read-playback-position",
  "user-top-read",
];

const AUTH_URL = `${authEndpoint}?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}`;

export default function Login() {
  return (
    <div className="container">
      <div className="blurred-panel">
        <Visual
          className="visual"
          song={""}
          recommendations={""}
          colors={[60, 250, 250]}
        ></Visual>
      </div>
      <a className="login-button" href={AUTH_URL}>
        LOG IN
      </a>
    </div>
  );
}
