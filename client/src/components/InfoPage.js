import React from "react";

export default function InfoPage(props) {
  return (
    <div className="info-page" onClick={props.onClick}>
      <h1>Spotty-Player 🫧</h1>
      <div className="bottom-infos">version 1.0 - September 2022</div>
    </div>
  );
}
