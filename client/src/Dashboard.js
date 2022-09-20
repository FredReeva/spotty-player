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

const spotifyApi = new SpotifyWebApi({
  clientId: "baa388cedf644fc6a42c78cdeb54542d",
});

var requestTime = 1000;

export default function Dashboard({ code }) {
  const handle = useFullScreenHandle();
  const [imgUrl, setImgUrl] = useState(null);
  const [view, setView] = useState("world");
  const [valEn, setValEn] = useState([0, 0, 0]);
  const [currentSong, setCurrentSong] = useState(null);
  const [viewHistory, setViewHistory] = useState(false);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [selctedSong, setSelectedSong] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [queue, setQueue] = useState(null);
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
        requestTime = 1000;
      }
    } else {
      requestTime = 5000;
    }
    return response;
  };

  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.setAccessToken(accessToken);
    console.log("got a token! have fun");

    setInterval(() => {
      // spotifyApi
      //   .getMyCurrentPlaybackState()
      //   .then((res) => {
      //     if (res) setPlaybackState(res.body && res.body.is_playing);
      //   })
      //   .catch((err) => {
      //     console.log("something went wrong when getting playback state", err);
      //   });

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
        limit: 50,
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
            song_infos["danceability"] = res.body.danceability;
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

    // spotifyApi
    //   .getMyRecentlyPlayedTracks({
    //     limit: 20,
    //   })
    //   .then((res) => {
    //     setHistory(res.body.items);
    //     console.log("history update");
    //   })
    //   .catch((err) => {
    //     console.log(
    //       "something went wrong when getting the recently played",
    //       err
    //     );
    //   });

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
        />
        <button
          className="menu-button"
          onClick={(e) => {
            e.stopPropagation();
            setViewHistory(!viewHistory);
          }}
        />
        <button
          className="menu-button"
          onClick={(e) => {
            e.stopPropagation();
            setViewHistory(!viewHistory);
          }}
        />
      </div>
      <div className="playback-bar">
        <button
          className="button"
          onClick={(e) => {
            e.stopPropagation();
            previousSong();
          }}
        ></button>
        <div className="infos">
          {currentSong
            ? currentSong.name + " - " + currentSong.artists[0].name
            : "..."}
        </div>
        <button
          className="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSong();
          }}
        ></button>
        <button
          className="button"
          onClick={(e) => {
            e.stopPropagation();
            addToLibrary();
          }}
        ></button>
      </div>

      {/* <Button className="button" onClick={() => setView("world")} /> */}
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
          playbackState={playbackState}
          setSelSong={setSelectedSong}
        ></Visual>
      )}
    </div>
  );
}
