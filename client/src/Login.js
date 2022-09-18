import React from "react";
import { Container } from "react-bootstrap";

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
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <a className="btn btn-success btn-lg" href={AUTH_URL}>
        Login
      </a>
    </Container>
  );
}
