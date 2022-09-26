import React from "react";

export default function InfoPage(props) {
  return (
    <div className="info-page" onClick={props.onClick}>
      <div className="info-page-text">
        <h1>Spotty-Player 🫧</h1>
        <div className="main-infos">
          <p>
            is a Spotify player, visualizer and song recommender based on the
            album covers 🌄
          </p>
          <p>
            Play something on any of your devices connected to Spotify to start
            your journey ▶️
          </p>
          <ul>
            <li>
              💿 - Visual: the currently playing song is displayed at the center
              of the screen, while the suggestions move around the screen. Click
              them and let me guide you to unexplored territories 🚀
            </li>
            <li>
              📈 - Mood Selector: registers where you've been during the
              listening session. Click on the place where you want to go next 🗺️
            </li>
            <li>
              🎨 - Style Transfer: artify yourself with the currently playing
              album image 🥸
            </li>
            <li>
              🖼️ - Gallery: all the style-transfer generated images will be
              collected in this section 🎭
            </li>
          </ul>
        </div>
      </div>
      <div className="bottom-infos">version 1.0 - September 2022</div>
    </div>
  );
}
