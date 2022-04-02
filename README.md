# CPaC_album-artify

Create a visual starting from the currently playing track on Spotify and its album cover

1. Generate a token from https://developer.spotify.com/console/get-users-currently-playing-track/
2. Start spotify and play songs
3. Start Processing visualizer
4. Run Python script

# Server Flask:

1.  create an environment in your project folder: py -m venv name-of-the-environment
2.  install requirements: pip install -r requirements.txt
3.  go to server folder: cd server
4.  create an environment file in the server folder (name it ".env")
5.  add this two lines in the file:
    CLIENT_ID="insert here the client id"
    CLIENT_KEY="insert here the client key"
6.  execute: flask run

PS: remember that I need to add your email to the spotify app!
