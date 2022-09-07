require("dotenv").config();
const express = require("express");
const spotifyWebApi = require("spotify-web-api-node");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "./client/build")));

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  console.log(refreshToken);
  const spotifyApi = new spotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log("server error when refreshing:", err);
      res.sendStatus(400);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new spotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log("server error when logging:", err);
      res.sendStatus(400);
    });
});

app.get("*", (req, res) => {
  console.log("generic request received");
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(port, () => {
  console.log("Server running on port: ", port);
});
