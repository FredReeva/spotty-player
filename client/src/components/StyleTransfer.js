import React, { useState, useRef, useEffect } from "react";
import Model from "./Model";
import * as tf from "@tensorflow/tfjs";
import {
  IoVideocam,
  IoVideocamOff,
  // IoImage,
  // IoRemoveCircle,
  IoSparkles,
} from "react-icons/io5";
import ReactTooltip from "react-tooltip";

export default function StyleTransfer(props) {
  const videoRef = useRef(null);
  const inputRef = useRef(null);
  const [webcam, setWebcam] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [stream, setStream] = useState(null);
  const [image, setImage] = useState(null);
  const [albumCover, setAlbumCover] = useState(null);
  const [resultImg, setResultImg] = useState(null);
  const [model, setModel] = useState(null);
  const [contentSrc, setContentSrc] = useState(null);
  const videoSettings = {
    width: 400,
    height: 400,
    facingMode: "user",
  };

  const getVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.stop();
      });
    }
    navigator.mediaDevices
      .getUserMedia({
        video: { width: videoSettings.width, height: videoSettings.height },
      })
      .then((stream) => {
        setStream(stream);
        let video = videoRef.current;

        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.log("can't get video", err);
      });
  };

  const toggleWebcam = () => {
    if (!webcam) {
      getVideo();
      setWebcam(true);
      setContentSrc("photo");
      setImage(null);
    } else if (stream !== null) {
      stream.getVideoTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
      setWebcam(false);
      setContentSrc(null);
    }
  };

  const changeImage = (event) => {
    if (!image) {
      if (stream) {
        stream.getVideoTracks().forEach((track) => {
          track.stop();
        });
        setStream(null);
        setWebcam(false);
      }

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
        setContentSrc("image-content");
      }
    } else {
      setImage(null);
      setContentSrc(null);
    }
  };

  useEffect(() => {
    let transform_model = new Model(
      "./models/saved_model_transformer_js/model.json"
    );
    let style_model = new Model("./models/saved_model_style_js/model.json");
    setModel([style_model, transform_model]);
  }, []);

  async function styleButtonPressed() {
    await takePicture();
  }

  useEffect(() => {
    setAlbumCover(props.imageUrl);
  }, [props.imageUrl]);

  useEffect(() => {
    async function computeStyleTransfer() {
      props.setErrorMsg("Computing Style Transfer...");

      const img_style = document.getElementById("image-style");

      const img_content = document.getElementById(contentSrc);

      let processed_content_image = model[0].preprocessImage(img_content);
      let processed_style_image = model[0].preprocessImage(img_style);

      await tf.nextFrame();
      const style_image = await tf.tidy(() => {
        return model[0].predict(processed_style_image);
      });

      await tf.nextFrame();
      const content_image = await tf.tidy(() => {
        return model[0].predict(processed_content_image);
      });

      await tf.nextFrame();
      const combine = await tf.tidy(() => {
        const style_image_scaled = style_image.mul(tf.scalar(0.9));
        const content_image_scaled = content_image.mul(tf.scalar(1.0 - 0.9));
        return style_image_scaled.add(content_image_scaled);
      });

      await tf.nextFrame();
      const stylized = await tf.tidy(() => {
        return model[1].predict([processed_content_image, combine]).squeeze();
      });

      await tf.nextFrame();
      const result = await tf.browser.toPixels(stylized);
      await tf.nextFrame();

      const imgData = new ImageData(result, 200, 200);

      var canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      var ctx = canvas.getContext("2d");
      ctx.putImageData(imgData, 0, 0);

      //ctx.fillRect(0, 0, 100, 100);

      //document.body.appendChild(img_res);

      setResultImg(canvas.toDataURL("image/png"));

      style_image.dispose();
      content_image.dispose();
      stylized.dispose();
      props.setErrorMsg("");
    }

    computeStyleTransfer();
  }, [photo]);

  // useEffect(() => {
  //   computeStyleTransfer();
  // }, [albumCover]);

  async function takePicture() {
    console.log("taking a picture");

    var canvas = document.createElement("canvas");
    const video = document.getElementById("webcam");

    canvas.width = videoSettings.width;
    canvas.height = videoSettings.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    setPhoto(canvas.toDataURL("image/png"));
  }

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

      {resultImg ? (
        <img id="result" alt="" className="result-image" src={resultImg} />
      ) : null}

      {image ? (
        <img
          id="image-content"
          alt=""
          className="upload-image"
          src={URL.createObjectURL(image)}
        />
      ) : null}

      {props.imageUrl ? (
        <img
          id="image-style"
          alt=""
          className="style-image"
          crossOrigin="anonymous"
          src={albumCover}
        />
      ) : null}

      {webcam ? (
        <img id="photo" alt="" className="video-player" src={photo} />
      ) : null}
      {webcam ? (
        <video
          id="webcam"
          ref={videoRef}
          className="video-player"
          onClick={() => {
            takePicture();
          }}
        />
      ) : null}

      <ReactTooltip />

      <div className="styletrans-bar">
        {/* <button
          className="button"
          data-tip="Image"
          data-place="top"
          style={{
            borderRadius: "10em",
            padding: "0.8em",
            cursor: "pointer",
          }}
          onClick={() => {
            changeImage();
          }}
        >
          {!image ? <IoImage /> : <IoRemoveCircle />}
        </button> */}
        <button
          className="button"
          data-tip="Webcam"
          data-place="top"
          style={{
            borderRadius: "10em",
            padding: "0.8em",
            cursor: "pointer",
          }}
          onClick={() => {
            toggleWebcam();
          }}
        >
          {!webcam ? <IoVideocam /> : <IoVideocamOff />}
        </button>

        {webcam || image ? (
          <button
            className="button"
            data-tip="Style Transfer"
            data-place="top"
            style={{
              borderRadius: "10em",
              padding: "0.8em",
              cursor: "pointer",
            }}
            onClick={() => {
              styleButtonPressed();
            }}
          >
            <IoSparkles />
          </button>
        ) : null}
      </div>
    </div>
  );
}
