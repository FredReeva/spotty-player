import React, { useState, useEffect, createRef } from "react";
import useAuth from "./useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import ColorThief from "colorthief";
import Visual from "./Visual";
import { IoImageOutline } from "react-icons/io5";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import SpotifyPlayer from "react-spotify-web-playback";

const spotifyApi = new SpotifyWebApi({
  clientId: "73854ecdce60489882e698ace37f458d",
});

var requestTime = 1000;

export default function Dashboard({ code }) {
  const handle = useFullScreenHandle();
  const [imgUrl, setImgUrl] = useState("");
  const [bpm, setBpm] = useState(120);
  const [currentSong, setCurrentSong] = useState("");
  const [palette, setPalette] = useState([
    [255, 255, 255],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const [playbackState, setPlaybackState] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const accessToken = useAuth(code);
  const imgRef = createRef();

  const getPalette = (img) => {
    const colorThief = new ColorThief();
    // const img = imgRef.current;
    setPalette(colorThief.getPalette(img, 6));
  };

  const getPlaybackState = async () => {
    const result = await fetch("https://api.spotify.com/v1/me/player", {
      methot: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    const response = await result.json();
    if (Object.keys(result)[0] === "error" && result.error.status === 429) {
      // Handle rate limiting
      for (var pair of result.headers.entries()) {
        console.log("wait for...", pair[1]);
        requestTime = 5000;
      }
    } else {
      requestTime = 1000;
    }

    return response;
  };

  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.setAccessToken(accessToken);
    console.log("got a token! have fun");

    setInterval(() => {
      spotifyApi
        .getMyCurrentPlaybackState()
        .then((res) => {
          if (res) setPlaybackState(res.body && res.body.is_playing);
        })
        .catch((err) => {
          console.log("something went wrong when getting playback state", err);
        });
      // getPlaybackState()
      //   .then((response) => {
      //     console.log(response);
      //   })
      //   .catch((error) => {
      //     console.error("No session found! Please press play");
      //   });

      spotifyApi
        .getMyCurrentPlayingTrack()
        .then((res) => {
          if (res) setCurrentSong(res.body.item.id);
        })
        .catch((err) => {
          console.log("Spotify session not found. Please play some music!");
        });
    }, requestTime);
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    if (!currentSong) return;
    spotifyApi
      .getMyCurrentPlayingTrack()
      .then((res) => {
        setImgUrl(res.body.item.album.images[1].url);
      })
      .catch((err) => {
        console.log("something went wrong when getting album url", err);
      });

    spotifyApi
      .getAudioFeaturesForTrack(currentSong)
      .then((res) => {
        setBpm(res.body.tempo);
      })
      .catch((err) => {
        console.log("something went wrong when getting track BPM", err);
      });
  }, [accessToken, currentSong]);

  useEffect(() => {
    if (!imgUrl) return;
    const image = new Image();

    image.onload = () => {
      getPalette(image);
    };
    image.src = imgUrl;
    image.crossOrigin = "Anonymous";
  }, [imgUrl]);

  return (
    
      <FullScreen className="background" handle={handle}>
        <IoImageOutline
          className="button"
          onClick={() => setShowImage(!showImage)}
        />
        {showImage ? (
          <img
            // crossOrigin={"anonymous"}
            ref={imgRef}
            src={imgUrl}
            className="album-image"
            // onLoad={() => getPalette()}
          />
        ) : null}
        <Visual
          className="visual"
          colors={palette}
          playbackState={playbackState}
          tempo={bpm}
          image={imgUrl}
        ></Visual>
      </FullScreen>


  );
}
