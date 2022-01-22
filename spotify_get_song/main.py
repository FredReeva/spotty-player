from turtle import update
import requests
import time
import tensorflow as tf
import urllib.request
from PIL import Image, ImageDraw
import socket
import json
from urllib.request import urlopen
import io
from colorthief import ColorThief
import style_transfer as st

ACCESS_TOKEN = "BQDIkequpyO8lxpHFUa9X36hskl3QS7Y3NYY5W-Vsxp8KAKACrBekwikZv4CPew04izfjQhhruYDQfPipeoqq-aChp-68UqOfCyCVIzPDsUuTe7nmLSZjSyky8qXoLm_wBroh_5y2xVFenoVbMQgz5UnWKj5e5E_hhhO1WqSmxQJy6Nd91rL8K5ujd1Pi6oJAmADr2RCL1-hk4jm8nI"
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
    data = {"image": str(image_url), "colors": str(palette)}
    data = json.dumps(data).encode()
    sock.send(data)


# def recolor(art_path, palette):

#     art_image = Image.open(art_path).convert("L")
#     width, height = art_image.size
#     new_image = Image.new(mode="RGB", size=(width, height))
#     new_pixel_map = new_image.load()
#     art_pixel_map = art_image.load()
#     for x in range(width):
#         for y in range(height):
#             if art_pixel_map[x, y] < 50:
#                 new_pixel_map[x, y] = palette[0]
#             elif art_pixel_map[x, y] < 100:
#                 new_pixel_map[x, y] = palette[1]
#             elif art_pixel_map[x, y] < 150:
#                 new_pixel_map[x, y] = palette[2]
#             elif art_pixel_map[x, y] < 200:
#                 new_pixel_map[x, y] = palette[3]
#             elif art_pixel_map[x, y] < 255:
#                 new_pixel_map[x, y] = palette[4]

#     return new_image


def main():

    update_style_transfer = True
    time_passed = 0
    current_track_id = None
    current_album_image = None

    model = st.load_model()

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

                    album_image = get_image(current_track_info)
                    album_image.save("images/album.png")
                    update_style_transfer = True

                    # show_palette(palette)

            if update_style_transfer:
                # art_recolor = recolor("images/generated/canvas.png", palette)
                # art_recolor.show()
                # art_recolor.save("images/art/art_recolor.png")

                content_path = (
                    "images/generated/canvas.png"  # "images/art/art_recolor.png"
                )
                # style_path_url = (
                #     current_album_image
                # )
                # style_path = tf.keras.utils.get_file(origin=style_path_url)
                style_path_url = current_album_image
                style_path = tf.keras.utils.get_file(origin=style_path_url)

                if (style_path and content_path) != None:
                    styled_image = st.compute_styled_image(
                        content_path, style_path, model
                    )  # inverted content and style
                    styled_image.save("images/styled_album.png")

                send_data(sock, current_album_image, palette)

            time.sleep(2)

            # recalculate style transfer every 6 seconds
            time_passed = time_passed + 1
            if time_passed % 3 == 0:
                update_style_transfer = True
            else:
                update_style_transfer = False


if __name__ == "__main__":
    main()
