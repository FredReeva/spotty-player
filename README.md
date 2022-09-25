# Spotty Player 🫧

Spotify player and visualizer.

## Contribute:

- Clone the repository
- Install dependencies (repeat for server and client): `npm install`
- Create a Spotify app from the developer dashboard, set up the _redirect_uri_, and retrieve the _client_id_ and the _client_secret_.
- Add file `.env` in the root, containing:
  ```
  REDIRECT_URI=_redirect_uri_
  CLIENT_ID=_client_id_code_
  CLIENT_SECRET=_client_secret_code_
  PORT=_server_port_
  ```
- Modify the file `client/src/credentials.json` with your _client_id_ code and the _redirect_uri_
- Start the server: `npm start`
- Start the client: `cd client`, then `npm start`
