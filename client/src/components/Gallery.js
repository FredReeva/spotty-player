import React, { useState, useRef, useEffect } from "react";

export default function Gallery(props) {
  return (
    <div
      className="visual"
      style={{
        backgroundColor: `rgb(${props.colors[0]})`,
      }}
    ></div>
  );
}
