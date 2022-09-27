import React, { useState, useEffect } from "react";
import useAuth from "./useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import ColorThief from "colorthief";
import GlobesVisual from "./components/GlobesVisual";
import MoodVisual from "./components/MoodVisual";
import StyleTransfer from "./components/StyleTransfer";
// import { FullScreen, useFullScreenHandle } from "react-full-screen";
// import SpotifyPlayer from "react-spotify-web-playback";
import ReactTooltip from "react-tooltip";
import credentials from "./credentials.json";
import {
  IoPlay,
  IoPlayForward,
  IoPlayBack,
  IoColorPalette,
  IoAnalytics,
  IoPause,
  IoDisc,
  IoInformationCircle,
  IoImages,
  IoHeartOutline,
  IoHeart,
} from "react-icons/io5";
import InfoPage from "./components/InfoPage";
import Gallery from "./components/Gallery";

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
  const [gallery, setGallery] = useState([]);
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
            if (res) {
              if (res.body && res.body.item.id) {
                setPlaying(res.body.is_playing);
                setCurrentSongId(res.body.item.id);
                setErrorMsg("");
              }
            }
          })
          .catch((err) => {
            console.log("error", err);
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

    if (isSubscribed) {
      setErrorMsg("Getting recommendations...");

      // get recommendations based on currently playing
      spotifyApi
        .getRecommendations({
          seed_tracks: [currentSongId],
          limit: 80,
        })
        .then((res) => {
          if (res) {
            setRecommendations(res.body.tracks);

            setErrorMsg("");
          }
        })
        .catch((err) => {
          setErrorMsg("Can't get recommendations!");
        });

      // get song infos + album image url + valence-arousal
      spotifyApi
        .getMyCurrentPlayingTrack()
        .then((res) => {
          if (res && res.body.item) {
            let song_infos = res.body.item;

            spotifyApi
              .getAudioFeaturesForTrack(currentSongId)
              .then((res) => {
                if (res) {
                  song_infos["valence"] = res.body.valence;
                  song_infos["energy"] = res.body.energy;

                  setCurrentSong(song_infos);
                  setGallery([...gallery]);
                }
              })
              .catch((err) => {
                console.log("something went wrong when getting track features");
              });

            setImgUrl(res.body.item.album.images[1].url);
          }
        })
        .catch((err) => {
          console.log("something went wrong when getting album url");
        });

      // check if song is saved in your library
      spotifyApi
        .containsMySavedTracks([currentSongId])
        .then((res) => {
          if (res) {
            var trackIsInYourMusic = res.body[0];
            if (isSubscribed) {
              setSongIsSaved(trackIsInYourMusic);
            }
          }
        })
        .catch((err) => {
          console.log("can't tell if the song is already in your library");
        });

      // update history with current song
      if (currentSong) {
        setHistory([...history, currentSong]);
      }
    }

    return () => (isSubscribed = false);
  }, [currentSongId]);

  // get palette when album image changes
  useEffect(() => {
    if (!imgUrl) return;
    const image = new Image();

    image.onload = () => {
      getPalette(image);
    };
    image.src = imgUrl;
    image.crossOrigin = "Anonymous";
  }, [imgUrl]);

  // start playing recommendations
  useEffect(() => {
    let isSubscribed = true;
    if (!selectedSong) return;

    console.log("selected song");
    if (isSubscribed) {
      // get recommendations based on selected song
      setErrorMsg("Getting recommendations...");
      spotifyApi
        .getRecommendations({
          seed_tracks: [selectedSong],
          limit: 50,
        })
        .then((res) => {
          if (res) {
            setRecommendations(res.body.tracks);
            setErrorMsg("");

            const selected_recommendations = res.body.tracks;

            const playback_queue = selected_recommendations
              .filter((song) => song.id !== selectedSong)
              .map((song) => {
                return "spotify:track:" + song.id;
              });

            playback_queue.splice(0, 0, "spotify:track:" + selectedSong);

            spotifyApi
              .play({
                uris: playback_queue,
              })
              .then(() => {
                setErrorMsg("");
              })
              .catch((err) => {
                setErrorMsg("Can't change song. Are you a premium user?");
              });
          }
        })
        .catch((err) => {
          setErrorMsg("Can't get recommendations!");
        });
    }

    return () => (isSubscribed = false);
  }, [selectedSong]);

  // get infos about currently playing track when computing style transfer
  async function setCorrectGallery(src) {
    spotifyApi
      .getMyCurrentPlayingTrack()
      .then((res) => {
        if (res && res.body.item) {
          let title = res.body.item.name;
          let artist = res.body.item.artists[0].name;

          setGallery([
            ...gallery,
            {
              title: title,
              artist: artist,
              src: src,
            },
          ]);
        }
      })
      .catch((err) => {
        console.log("Error cetting gallery infos.");
      });
  }

  // get suggestions based on clicked point in mood selector plane
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
        if (res) {
          setSelectedSong(res.body.tracks[0].id);
          setErrorMsg("");
        }
      })
      .catch((err) => {
        setErrorMsg("Can't get recommendations!");
      });
  };

  // play/pause button
  const togglePlayback = () => {
    if (!playing) {
      spotifyApi
        .play({})
        .then((res) => {
          if (res) {
            setPlaying(true);
            setErrorMsg("");
          }
        })
        .catch((err) => {
          setErrorMsg("Can't start playback. Are you a premium user?");
        });
    } else {
      spotifyApi
        .pause()
        .then((res) => {
          if (res) {
            setPlaying(false);
          }
        })
        .catch((err) => {
          console.log("Something went wrong when pausing song");
        });
    }
  };

  // skip to next song in queue
  const previousSong = () => {
    spotifyApi
      .skipToPrevious()
      .then((res) => {
        if (res) {
          setErrorMsg("");
        }
      })
      .catch((err) => {
        setErrorMsg("Can't change song");
      });
  };

  // skip to previous song
  const nextSong = () => {
    spotifyApi
      .skipToNext()
      .then((res) => {
        if (res) {
          setErrorMsg("");
        }
      })
      .catch((err) => {
        setErrorMsg("Can't change song. Are you a premium user?");
      });
  };

  // add song to your library
  const addToLibrary = () => {
    spotifyApi
      .addToMySavedTracks([currentSongId])
      .then((res) => {
        if (res) {
          console.log("Added to library");
          setSongIsSaved(true);
        }
      })
      .catch((err) => {
        console.log("Can't add song to library");
      });
  };

  // page structure
  return (
    <div
      className="container"
      style={{
        backgroundColor: `rgb(${palette[0]})`,
      }}
    >
      {menuSelection === "mood" ? (
        <MoodVisual
          className="visual"
          song={currentSong}
          history={history}
          colors={palette}
          setSelHistSong={suggestSongsPlane}
        ></MoodVisual>
      ) : null}

      {menuSelection === "main" ? (
        <GlobesVisual
          className="visual"
          song={currentSong}
          queue={queue}
          history={history}
          recommendations={recommendations}
          colors={palette}
          playbackState={playing}
          setSelSong={(e) => {
            setSelectedSong(e);
          }}
        ></GlobesVisual>
      ) : null}

      {menuSelection === "style" ? (
        <StyleTransfer
          className="visual"
          song={currentSongId}
          colors={palette}
          imageUrl={imgUrl}
          setErrorMsg={setErrorMsg}
          setGallery={(src) => setCorrectGallery(src)}
        ></StyleTransfer>
      ) : null}
      {menuSelection === "gallery" ? (
        <Gallery
          className="visual"
          colors={palette}
          gallery={gallery}
        ></Gallery>
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
          data-tip="Globes"
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
          data-tip="Mood Selector"
          data-place="right"
          onClick={(e) => {
            e.stopPropagation();
            setMenuSelection("mood");
          }}
        >
          <IoAnalytics />
        </button>
        <button
          className="button"
          data-tip="Style Transfer"
          data-place="right"
          onClick={(e) => {
            e.stopPropagation();
            setMenuSelection("style");
          }}
        >
          <IoColorPalette />
        </button>
        {gallery.length > 0 ? (
          <button
            className="button"
            data-tip="Gallery"
            data-place="right"
            onClick={(e) => {
              e.stopPropagation();
              setMenuSelection("gallery");
            }}
          >
            <IoImages />
          </button>
        ) : (
          <button
            className="button inactive"
            data-tip="Gallery"
            data-place="right"
          >
            <IoImages />
          </button>
        )}
      </div>
      <div className="playback-bar">
        <div className="song-infos">
          {currentSong
            ? "🎵 " + currentSong.name + " - " + currentSong.artists[0].name
            : "..."}
        </div>
        <div className="playback-controls">
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
            {songIsSaved ? <IoHeart /> : <IoHeartOutline />}
          </button>
        </div>
      </div>
    </div>
  );
}
