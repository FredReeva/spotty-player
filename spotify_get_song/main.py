import requests
import time
import urllib.request
from PIL import Image, ImageDraw
import socket
from urllib.request import urlopen
import io
from colorthief import ColorThief

ACCESS_TOKEN = "BQAzHIjTFfhQ_Zuglm_DQmot0Jp0Fq1Y3eJ55LhusX1I6HBFdOV3Z6O4TQrZy0LYWvSr-V67Qa8ExZKV4z9O97fSal-fcA54-W5r0G-twHRAeDNS7IPBsEwuwN3PurtuQDi2Lw-eJe6Iz6U97wzCcogoA5MD4s6BDTBg6_z-82jWU5zeThDPAiS1ogeHspJIBdVsQ4dsvzHXdgy5mKI"
SPOTIFY_GET_CURRENT_TRACK_URL = "https://api.spotify.com/v1/me/player/currently-playing"

HOST = "127.0.0.1"
PORT = 12000


def get_current_track(access_token):
    response = requests.get(
        SPOTIFY_GET_CURRENT_TRACK_URL,
        headers={"Authorization": f"Bearer {access_token}"},
    )
    json_resp = response.json()

    track_id = json_resp["item"]["id"]
    track_name = json_resp["item"]["name"]
    artists = [artist for artist in json_resp["item"]["artists"]]

    link = json_resp["item"]["external_urls"]["spotify"]

    image = json_resp["item"]["album"]["images"][0]["url"]

    artist_names = ", ".join([artist["name"] for artist in artists])

    current_track_info = {
        "id": track_id,
        "track_name": track_name,
        "artists": artist_names,
        "link": link,
        "image": image,
    }

    return current_track_info


def get_image(track):
    urllib.request.urlretrieve(track["image"], "album_art.png")
    img = Image.open("album_art.png")
    return img


def get_palette(image_url):

    fd = urlopen(image_url)
    image = io.BytesIO(fd.read())
    color_thief = ColorThief(image)

    palette = color_thief.get_palette(color_count=6)

    return palette


def show_palette(palette):
    palette_image = Image.new(mode="RGB", size=(len(palette) * 100, 100))
    draw = ImageDraw.Draw(palette_image)

    for i in range(len(palette)):
        draw.rectangle(
            [100 * i, 0, 100 * i + 100, 100],
            fill=(palette[i]),
        )
    palette_image.show()


def send_data(sock, image_url, palette):
    data = (str(palette) + "\n" + str(image_url)).encode()
    sock.send(data)


def main():

    current_track_id = None
    current_album_image = None

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.connect((HOST, PORT))  # connect to processing server

        while True:
            current_track_info = get_current_track(ACCESS_TOKEN)

            if current_track_info["id"] != current_track_id:
                print(current_track_info["track_name"])
                current_track_id = current_track_info["id"]

                if current_track_info["image"] != current_album_image:

                    current_album_image = current_track_info["image"]
                    palette = get_palette(current_album_image)

                    # album_image = get_image(current_track_info)
                    # show_palette(palette)

                    send_data(sock, current_album_image, palette)

            time.sleep(2)


if __name__ == "__main__":
    main()
