from flask import Flask, request, url_for, session, redirect
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import time
import os
from dotenv import load_dotenv
import json

app = Flask(__name__)

load_dotenv()
client_key = os.getenv("CLIENT_KEY")
client_id = os.getenv("CLIENT_ID")
app.secret_key = "frgbij346yjsd9ejr9"
app.config["SESSION_COOKIE_NAME"] = "artify-cookie"
TOKEN_INFO = "token_info"
song = "_"


@app.route("/")
def login():
    sp_oauth = create_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)


@app.route("/redirect")
def redirectPage():
    sp_oauth = create_spotify_oauth()
    session.clear()
    code = request.args.get("code")
    token_info = sp_oauth.get_access_token(code)
    session[TOKEN_INFO] = token_info

    return redirect(url_for("player", _external=True))


@app.route("/player")
def player():

    token_info = get_token()

    if not token_info:
        print("user not logged in, redirecting to login")
        return redirect(url_for("login", _external=False))

    sp = spotipy.Spotify(auth=token_info["access_token"])

    song = sp.currently_playing()

    if not song:
        return "No spotify session found. Please play a song"

    features = sp.audio_features(song["item"]["id"])

    return features[0]


def get_token():
    token_info = session.get(TOKEN_INFO, None)
    sp_oauth = create_spotify_oauth()

    now = int(time.time())
    is_expired = token_info["expires_at"] - now < 60

    if is_expired:
        sp_oauth = create_spotify_oauth()
        token_info = sp_oauth.refresh_access_token(token_info["refresh_token"])

    return token_info


def create_spotify_oauth():
    return SpotifyOAuth(
        client_id=client_id,
        client_secret=client_key,
        redirect_uri=url_for("redirectPage", _external=True),
        scope="user-read-currently-playing",
    )
