import React, { useState, useEffect } from "react";
import useAuth from "./useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import ColorThief from "colorthief";
import Visual from "./components/Visual";
import History from "./components/History";
import StyleTransfer from "./components/StyleTransfer";
// import { FullScreen, useFullScreenHandle } from "react-full-screen";
// import SpotifyPlayer from "react-spotify-web-playback";
import ReactTooltip from "react-tooltip";
import credentials from "./credentials.json";
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
  IoInformationCircle,
} from "react-icons/io5";
import InfoPage from "./components/InfoPage";

const spotifyApi = new SpotifyWebApi({
  clientId: credentials.client_id,
});

export default function Dashboard({ code }) {
  //const handle = useFullScreenHandle();
  const [imgUrl, setImgUrl] = useState(null);
  const [requestTime, setrequestTime] = useState(2000);
  const [menuSelection, setMenuSelection] = useState("main");
  const [currentSong, setCurrentSong] = useState(null);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [songIsSaved, setSongIsSaved] = useState(false);
  const [history, setHistory] = useState([]);
  const [queue, setQueue] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [playing, setPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [palette, setPalette] = useState([
    [255, 255, 255],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);

  const accessToken = useAuth(code);

  const getPalette = (img) => {
    const colorThief = new ColorThief();
    // const img = imgRef.current;
    setPalette(colorThief.getPalette(img, 6));
  };

  useEffect(() => {
    setTimeout(() => {
      setShowInfo(false);
    }, 7000);
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.setAccessToken(accessToken);
    console.log("got a token! have fun");

    // spotifyApi
    //   .getMyRecentlyPlayedTracks()
    //   .then((res) => {
    //     setInitHist(res.body.items);
    //   })
    //   .catch((err) => {
    //     console.log(
    //       "Error while getting recently played tracks. Could not initialize app. Start manually a session from spotify!",
    //       err
    //     );
    //   });
    let isSubscribed = true;

    if (isSubscribed) {
      setInterval(() => {
        spotifyApi
          .getMyCurrentPlaybackState()
          .then((res) => {
            setPlaying(res.body.is_playing);
            setCurrentSongId(res.body.item.id);
            setErrorMsg("");
          })
          .catch((err) => {
            if (err.status === 429) {
              console.log("Limiting requests to spotify api...");
              setrequestTime(10000);
            } else {
              setErrorMsg("Play something on a device to start");
              setrequestTime(1000);
            }
          });
      }, requestTime);
    }

    return () => (isSubscribed = false);
  }, [accessToken, requestTime]);

  // Every few seconds check player state
  useEffect(() => {
    let isSubscribed = true;
    if (!accessToken) return;
    if (!currentSongId) return;

    // TODO: bug when getting queue from spotify

    // const getQueue = async () => {
    //   const result = await fetch("https://api.spotify.com/v1/me/player/queue", {
    //     methot: "GET",
    //     headers: {
    //       Authorization: "Bearer " + accessToken,
    //     },
    //   });

    //   const response = await result.json();
    //   if (isSubscribed) {
    //     //console.log(response.queue);
    //   }
    // };

    // get recommendations based on currently playing
    if (isSubscribed) {
    setErrorMsg("Getting recommendations...");

    
      spotifyApi
        .getRecommendations({
          seed_tracks: [currentSongId],
          limit: 80,
        })
        .then((res) => {
          setRecommendations(res.body.tracks);

          setErrorMsg("");
        })
        .catch((err) => {
          setErrorMsg("Can't get recommendations!");
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
              console.log("something went wrong when getting track features");
            });

          setImgUrl(res.body.item.album.images[1].url);
        })
        .catch((err) => {
          console.log("something went wrong when getting album url");
        });

      spotifyApi
        .containsMySavedTracks([currentSongId])
        .then((res) => {
          // An array is returned, where the first element corresponds to the first track ID in the query
          var trackIsInYourMusic = res.body[0];

          if (isSubscribed) {
            if (trackIsInYourMusic) {
              setSongIsSaved(true);
            } else {
              setSongIsSaved(false);
            }
          }
        })
        .catch((err) => {
          console.log("can't tell if the song is already in your library");
        });

      // getQueue().catch((err) => {
      //   console.log("error getting queue");
      // });

      if (currentSong) {
        setHistory([...history, currentSong]);
      }
    }

    return () => (isSubscribed = false);
  }, [currentSongId]);

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
    let isSubscribed = true;
    if (!selectedSong) return;

    if (isSubscribed) {
      setErrorMsg("Getting recommendations...");
      spotifyApi
        .getRecommendations({
          seed_tracks: [selectedSong],
          limit: 20,
        })
        .then((res) => {
          setQueue(res.body.tracks);
          setErrorMsg("");
        })
        .catch((err) => {
          setErrorMsg("Can't get recommendations!");
        });

      let playback_queue = queue
        .filter((song) => song.id !== selectedSong)
        .map((song) => "spotify:track:" + song.id);

      playback_queue.splice(0, 0, "spotify:track:" + selectedSong);

      spotifyApi
        .play({
          uris: playback_queue,
        })
        .then(
          function () {
            setErrorMsg("");
          },
          function (err) {
            setErrorMsg("Can't change song. Are you premium user?");
          }
        );
    }

    return () => (isSubscribed = false);
  }, [selectedSong]);

  const suggestSongsPlane = (coordinates) => {
    if (!accessToken) return;
    if (!currentSongId) return;

    spotifyApi
      .getRecommendations({
        seed_tracks: [currentSongId],
        limit: 1,
        target_energy: coordinates[1],
        target_valence: coordinates[0],
      })
      .then((res) => {
        setSelectedSong(res.body.tracks[0].id);

        setErrorMsg("");
      })
      .catch((err) => {
        setErrorMsg("Can't get recommendations!");
      });
  };

  const togglePlayback = () => {
    if (!playing) {
      spotifyApi
        .play({})
        .then(() => {
          setPlaying(true);
          setErrorMsg("");
        })
        .catch((err) => {
          setErrorMsg("Can't start playback. Are you a premium user?");
        });
    } else {
      spotifyApi
        .pause()
        .then(() => setPlaying(false))
        .catch((err) => {
          console.log("Something went wrong when pausing song");
        });
    }
  };

  // useEffect(() => {
  //   getQueue().catch(() => {
  //     console.log("error while getting the queue");
  //   });
  // }, []);

  const previousSong = () => {
    spotifyApi
      .skipToPrevious(() => {
        setErrorMsg("");
      })
      .catch((err) => {
        setErrorMsg("Can't change song");
      });
  };

  const nextSong = () => {
    spotifyApi
      .skipToNext(() => {
        setErrorMsg("");
      })
      .catch((err) => {
        setErrorMsg("Can't change song. Are you a premium user?");
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
        console.log("Can't add song to library");
      });
  };

  return (
    <div
      className="container"
      style={{
        backgroundColor: `rgb(${palette[0]})`,
      }}
    >
      {menuSelection === "hist" ? (
        <History
          className="visual"
          song={currentSong}
          history={history}
          colors={palette}
          setSelHistSong={suggestSongsPlane}
        ></History>
      ) : menuSelection === "main" ? (
        <Visual
          className="visual"
          song={currentSong}
          queue={queue}
          recommendations={recommendations}
          colors={palette}
          playbackState={playing}
          setSelSong={setSelectedSong}
        ></Visual>
      ) : menuSelection === "style" ? (
        <StyleTransfer
          className="visual"
          song={currentSongId}
          colors={palette}
          imageUrl={imgUrl}
          setErrorMsg={setErrorMsg}
        ></StyleTransfer>
      ) : null}

      {showInfo ? (
        <InfoPage
          onClick={(e) => {
            e.stopPropagation();
            setShowInfo(!showInfo);
          }}
        ></InfoPage>
      ) : null}

      <ReactTooltip />
      <div className="footer-bar">
        {errorMsg}

        <button
          className="button"
          data-tip="Info"
          data-place="left"
          onClick={(e) => {
            e.stopPropagation();
            setShowInfo(!showInfo);
          }}
        >
          <IoInformationCircle />
        </button>
      </div>

      <div className="menu-bar">
        <button
          className="button"
          data-tip="Visual"
          data-place="right"
          onClick={(e) => {
            e.stopPropagation();
            setMenuSelection("main");
          }}
        >
          <IoDisc />
        </button>

        <button
          className="button"
          data-tip="History"
          data-place="right"
          onClick={(e) => {
            e.stopPropagation();
            setMenuSelection("hist");
          }}
        >
          <IoAnalytics />
        </button>
        <button
          className="button"
          data-tip="Style"
          data-place="right"
          onClick={(e) => {
            e.stopPropagation();
            setMenuSelection("style");
          }}
        >
          <IoColorPalette />
        </button>
      </div>
      <div className="playback-bar">
        <div className="song-infos">
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
    </div>
  );
}
