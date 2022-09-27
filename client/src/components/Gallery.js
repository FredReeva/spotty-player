import React, { useState, useRef, useEffect } from "react";

export default function Gallery(props) {
  
    return (
      <div
        className="visual"
        style={{
          backgroundColor: `rgb(${props.colors[0]})`,
        }}
      >
        <div className="history-container">
          {props.gallery.length > 0 ? (
            props.gallery.map((photo, i) => {
              return (
                <div className="gallery-photo-container" key={i}>
                  <img
                    className="gallery-photo"
                    src={photo.src}
                    key={i + "photo"}
                    alt=""
                    style={{
                      borderColor: `rgb(${props.colors[1]})`,
                    }}
                  ></img>
                  <div
                    className="gallery-text"
                    key={i + "name"}
                    style={{
                      color: `rgb(${props.colors[1]})`,
                    }}
                  >
                    🎶{photo.title}
                  </div>
                  <div
                    className="gallery-text"
                    key={i + "artist"}
                    style={{
                      color: `rgb(${props.colors[1]})`,
                    }}
                  >
                    👤{photo.artist}
                  </div>
                </div>
              );
            })
          ) : (
            <p
              className="info-page-text"
              style={{
                fontSize: "1.5em",
                color: `rgb(${props.colors[1]})`,
              }}
            >
              Oops, there are no images here... Generate some in the Style
              Transfer menu! 🎨
            </p>
          )}
        </div>
      </div>
    );

}
