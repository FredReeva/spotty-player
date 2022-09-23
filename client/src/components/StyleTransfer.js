import React, { useState, useRef, useEffect } from "react";
import Webcam from "./Webcam";
import Model from "./Model";

export default function StyleTransfer(props) {
  const videoRef = useRef(null);
  const inputRef = useRef(null);
  const [webcam, setWebcam] = useState(false);
  const [stream, setStream] = useState(null);
  const [image, setImage] = useState(null);
  const [model, setModel] = useState(null);
  const [videoConstraints, setVideoConstraints] = useState({
    width: 1280,
    height: 720,
    facingMode: "user",
  });

  const photoRef = useRef(null);
  const stripRef = useRef(null);

  const getVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.stop();
      });
    }
    navigator.mediaDevices
      .getUserMedia({ video: { width: 400, height: 400 } })
      .then((stream) => {
        setStream(stream);
        let video = videoRef.current;

        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.log("can't get video");
      });
  };

  const toggleWebcam = () => {
    if (!webcam) {
      getVideo();
      setWebcam(true);
    } else if (stream !== null) {
      stream.getVideoTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
      setWebcam(false);
    }
  };

  const changeImage = (event) => {
    if (!image) {
      inputRef.current.click();
      if (event) {
        const file = event.target.files && event.target.files[0];
        if (!file) {
          return;
        }

        var allowedExtension = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/bmp",
        ];
        let type = event.target.files[0].type;

        if (!allowedExtension.includes(type)) {
          alert("Invalid Format!");
          return;
        }

        setImage(event.target.files[0]);
      }
    } else {
      setImage(null);
    }
  };

  useEffect(() => {
    let model = new Model();
    setModel(model);
  }, []);

  const computeStyleTransfer = () => {
    console.log("compute style transfer");
    const img = document.getElementById("image");

    img.addEventListener("loadeddata", (e) => {
      //Video should now be loaded but we can add a second check

      let prediction = model.predict(img);
      console.log(prediction);
    });
  };

  return (
    <div
      className="visual"
      style={{
        backgroundColor: `rgb(${props.colors[0]})`,
      }}
    >
      <input
        style={{ display: "none" }}
        ref={inputRef}
        type="file"
        onChange={changeImage}
      />
      {image ? (
        <img
          id="image"
          className="upload-image"
          src={URL.createObjectURL(image)}
        />
      ) : null}

      {webcam ? (
        <Webcam
          audio={false}
          height={720}
          screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
          videoRef={videoRef}
        ></Webcam>
      ) : null}

      <div className="styletrans-bar">
        <button
          className="button"
          style={{
            borderRadius: "10em",
            padding: "0.8em",
            cursor: "pointer",
          }}
          onClick={() => {
            changeImage();
          }}
        >
          {!image ? "Upload Image" : "Delete Image"}
        </button>
        <button
          className="button"
          style={{
            borderRadius: "10em",
            padding: "0.8em",
            cursor: "pointer",
          }}
          onClick={() => {
            toggleWebcam();
          }}
        >
          {!webcam ? "Start Webcam" : "Stop Webcam"}
        </button>

        <button
          className="button"
          style={{
            borderRadius: "10em",
            padding: "0.8em",
            cursor: "pointer",
          }}
          onClick={() => {
            computeStyleTransfer();
          }}
        >
          Style Transfer
        </button>
      </div>
    </div>
  );
}
