import React, { useState, useEffect, createRef } from "react";
import useAuth from "./useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import ColorThief from "colorthief";
import Visual from "./components/Visual";
import History from "./components/History";
import styled from "styled-components";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import SpotifyPlayer from "react-spotify-web-playback";
import { Button, Container } from "react-bootstrap";
import {
  IoPlay,
  IoPlayForward,
  IoPlayBack,
  IoAdd,
  IoCheckmark,
  IoColorPalette,
  IoAnalytics,
  IoPause,
  IoDisc,
} from "react-icons/io5";

const spotifyApi = new SpotifyWebApi({
  clientId: "baa388cedf644fc6a42c78cdeb54542d",
});

var requestTime = 1000;

export default function Dashboard({ code }) {
  const handle = useFullScreenHandle();
  const [imgUrl, setImgUrl] = useState(null);
  const [requestTime, setrequestTime] = useState(1000);
  const [view, setView] = useState("world");
  const [valEn, setValEn] = useState([0, 0, 0]);
  const [currentSong, setCurrentSong] = useState(null);
  const [viewHistory, setViewHistory] = useState(false);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [selctedSong, setSelectedSong] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [songIsSaved, setSongIsSaved] = useState(false);
  const [history, setHistory] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [palette, setPalette] = useState([
    [255, 255, 255],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const [showImage, setShowImage] = useState(false);
  const accessToken = useAuth(code);
  const imgRef = createRef();

  const getPalette = (img) => {
    const colorThief = new ColorThief();
    // const img = imgRef.current;
    setPalette(colorThief.getPalette(img, 6));
  };

  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.setAccessToken(accessToken);
    console.log("got a token! have fun");

    setInterval(() => {
      spotifyApi
        .getMyCurrentPlaybackState()
        .then((res) => {
          // if (Object.keys(res)[0] === "error" && res.error.status === 429) {
          //   for (var pair of res.headers.entries()) {
          //     console.log("wait for...", pair[1]);
          //     setrequestTime(5000);
          //   }
          // } else {
          //   setrequestTime(1000);
          // }
          if (res) setPlaying(res.body.is_playing);
        })
        .catch((err) => {
          console.log("something went wrong when getting playback state", err);
        });

      spotifyApi
        .getMyCurrentPlayingTrack()
        .then((res) => {
          setCurrentSongId(res.body.item.id);
        })
        .catch((err) => {
          console.log("Spotify session not found. Please play some music!");
        });
    }, requestTime);
  }, [accessToken]);

  // Every few seconds check player state
  useEffect(() => {
    if (!accessToken) return;
    if (!currentSongId) return;

    spotifyApi
      .getRecommendations({
        seed_tracks: [currentSongId],
        limit: 70,
      })
      .then((res) => {
        console.log("getting recommendations...");
        setRecommendations(res.body.tracks);
      })
      .catch((err) => {
        console.log(
          "Something went wrong when getting recommended tracks",
          err
        );
      });

    spotifyApi
      .getMyCurrentPlayingTrack()
      .then((res) => {
        let song_infos = res.body.item;

        spotifyApi
          .getAudioFeaturesForTrack(currentSongId)
          .then((res) => {
            song_infos["valence"] = res.body.valence;
            song_infos["energy"] = res.body.energy;

            setCurrentSong(song_infos);
          })
          .catch((err) => {
            console.log(
              "something went wrong when getting track features",
              err
            );
          });
        setImgUrl(res.body.item.album.images[1].url);
      })
      .catch((err) => {
        console.log("something went wrong when getting album url", err);
      });

    spotifyApi
      .containsMySavedTracks([currentSongId])
      .then((res) => {
        // An array is returned, where the first element corresponds to the first track ID in the query
        var trackIsInYourMusic = res.body[0];

        if (trackIsInYourMusic) {
          setSongIsSaved(true);
        } else {
          setSongIsSaved(false);
        }
      })
      .catch((err) => {
        console.log("Something went wrong!", err);
      });

    if (currentSong) {
      setHistory([...history, currentSong]);
    }
  }, [accessToken, currentSongId]);

  useEffect(() => {
    if (!imgUrl) return;
    const image = new Image();

    image.onload = () => {
      getPalette(image);
    };
    image.src = imgUrl;
    image.crossOrigin = "Anonymous";
  }, [imgUrl]);

  useEffect(() => {
    if (!recommendations) return;

    let playback_queue = recommendations
      .filter((song) => song.id !== selctedSong)
      .map((song) => "spotify:track:" + song.id);

    playback_queue.splice(0, 0, "spotify:track:" + selctedSong);
    spotifyApi
      .play({
        uris: playback_queue,
      })
      .then(
        function () {
          console.log("Playback started");
        },
        function (err) {
          //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
          console.log("Something went wrong!", err);
        }
      );
  }, [selctedSong]);

  const togglePlayback = () => {
    if (!playing) {
      spotifyApi
        .play({})
        .then(() => setPlaying(true))
        .catch((err) => {
          //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
          console.log("Something went wrong when playing song", err);
        });
    } else {
      spotifyApi
        .pause()
        .then(() => setPlaying(false))
        .catch((err) => {
          console.log("Something went wrong when pausing song", err);
        });
    }
  };

  const previousSong = () => {
    spotifyApi.skipToPrevious().catch((err) => {
      console.log("Can't skip to previous song!", err);
    });
  };

  const nextSong = () => {
    spotifyApi.skipToNext().catch((err) => {
      console.log("Can't skip to next song!", err);
    });
  };

  const addToLibrary = () => {
    spotifyApi
      .addToMySavedTracks([currentSongId])
      .then(() => {
        console.log("Added to library");
        setSongIsSaved(true);
      })
      .catch((err) => {
        console.log("Can't add song to library", err);
      });
  };

  return (
    <div className="container">
      <div className="menu-bar">
        <button
          className="menu-button"
          onClick={(e) => {
            e.stopPropagation();
            setViewHistory(!viewHistory);
          }}
        >
          <IoDisc />
        </button>
        <button
          className="menu-button"
          onClick={(e) => {
            e.stopPropagation();
            setViewHistory(!viewHistory);
          }}
        >
          <IoAnalytics />
        </button>
        <button
          className="menu-button"
          onClick={(e) => {
            e.stopPropagation();
            setViewHistory(!viewHistory);
          }}
        >
          <IoColorPalette />
        </button>
      </div>
      <div className="playback-bar">
        <div className="infos">
          {currentSong
            ? "🎵 " + currentSong.name + " - " + currentSong.artists[0].name
            : "..."}
        </div>
        <button
          className="button"
          onClick={(e) => {
            e.stopPropagation();
            previousSong();
          }}
        >
          <IoPlayBack />
        </button>
        <button
          className="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePlayback();
          }}
        >
          {playing ? <IoPause /> : <IoPlay />}
        </button>
        <button
          className="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSong();
          }}
        >
          <IoPlayForward />
        </button>
        <button
          className="button"
          onClick={(e) => {
            e.stopPropagation();
            addToLibrary();
          }}
        >
          {songIsSaved ? <IoCheckmark /> : <IoAdd />}
        </button>
      </div>

      {viewHistory ? (
        <History
          className="visual"
          song={currentSong}
          history={history}
          colors={palette}
          valenceEnergy={valEn}
        ></History>
      ) : (
        <Visual
          className="visual"
          song={currentSong}
          recommendations={recommendations}
          colors={palette}
          playbackState={playing}
          setSelSong={setSelectedSong}
        ></Visual>
      )}
    </div>
  );
}
