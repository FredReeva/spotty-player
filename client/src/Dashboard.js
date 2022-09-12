import React, { useState, useEffect, createRef } from "react";
import useAuth from "./useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import ColorThief from "colorthief";
import Visual from "./Visual";

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
  const [queue, setQueue] = useState({});
  const [history, setHistory] = useState([]);
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

  const getQueue = async () => {
    const result = await fetch("https://api.spotify.com/v1/me/player/queue", {
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
        requestTime = 10000;
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

      spotifyApi
        .getMyCurrentPlayingTrack()
        .then((res) => {
          if (res) setCurrentSong(res.body.item);
        })
        .catch((err) => {
          console.log("Spotify session not found. Please play some music!");
        });

      getQueue()
        .then((res) => {
          if (res) setQueue(res);
        })
        .catch((err) => {
          console.log("something went wrong when getting the queue", err);
        });

      spotifyApi
        .getMyRecentlyPlayedTracks({
          limit: 20,
        })
        .then((res) => {
          if (res) setHistory(res);
        })
        .catch((err) => {
          console.log(
            "something went wrong when getting the recently played",
            err
          );
        });
    }, requestTime);
  }, [accessToken]);

  // Every few seconds check player state
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
      .getAudioFeaturesForTrack(currentSong.id)
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
      {/* <IoImageOutline
          className="button"
          onClick={() => setShowImage(!showImage)}
        /> */}
      {/* {showImage ? (
          <img
            // crossOrigin={"anonymous"}
            ref={imgRef}
            src={imgUrl}
            className="album-image"
            // onLoad={() => getPalette()}
          />
        ) : null} */}
      <Visual
        className="visual"
        song={currentSong}
        history={history}
        colors={palette}
        playbackState={playbackState}
        tempo={bpm}
        image={imgUrl}
      ></Visual>
    </FullScreen>
  );
}
