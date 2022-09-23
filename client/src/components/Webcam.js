import React, { useEffect, useState, useRef } from "react";

const Webcam = (props) => {
  

  //   const takePhoto = () => {
  //     let photo = photoRef.current;
  //     let strip = stripRef.current;

  //     const data = photo.toDataURL("image/jpeg");

  //     console.warn(data);
  //     const link = document.createElement("a");
  //     link.href = data;
  //     link.setAttribute("download", "myWebcam");
  //     link.innerHTML = `<img src='${data}' alt='thumbnail'/>`;
  //     strip.insertBefore(link, strip.firstChild);
  //   };

  return (
    <div>
      <div className="webcam-video">
        <video ref={props.videoRef} className="player" />
      </div>
    </div>
  );
};

export default Webcam;
