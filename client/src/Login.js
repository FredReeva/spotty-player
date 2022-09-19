import React from "react";
import styled from "styled-components";
import Visual from "./components/Visual";

export const authEndpoint = "https://accounts.spotify.com/authorize";

const redirectUri = "http://localhost:3000";
const clientId = "73854ecdce60489882e698ace37f458d";
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
      <a className="button" href={AUTH_URL}>
        LOG IN
      </a>
    </div>
  );
}
