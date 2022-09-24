import React, { useState, useRef, useEffect } from "react";
import Webcam from "./Webcam";
import Model from "./Model";
import * as tf from "@tensorflow/tfjs";
import {
  IoVideocam,
  IoVideocamOff,
  IoImage,
  IoRemoveCircle,
  IoGitNetworkSharp,
  IoSparkles,
} from "react-icons/io5";
import ReactTooltip from "react-tooltip";
import { loadGraphModel } from "@tensorflow/tfjs";

export default function StyleTransfer(props) {
  const videoRef = useRef(null);
  const inputRef = useRef(null);
  const [webcam, setWebcam] = useState(false);
  const [stream, setStream] = useState(null);
  const [image, setImage] = useState(null);
  const [resultImg, setResultImg] = useState(null);
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
    let transform_model = new Model(
      "./models/saved_model_transformer_js/model.json"
    );
    let style_model = new Model("./models/saved_model_style_js/model.json");
    setModel([style_model, transform_model]);
  }, []);

  // useEffect(() => {
  //   computeStyleTransfer();
  // }, [props.imageUrl]);

  async function computeStyleTransfer() {
    console.log("computing style transfer...");

    // let still_frame = new ImageCapture(stream.getVideoTracks()[0]);

    // const photo = document.getElementById("webcam-content");
    // console.log(photo);
    // photo.setAttribute("src", data);
    const img_style = document.getElementById("image-style");
    const img_content = document.getElementById("image-content");

    let processed_content_image = model[0].preprocessImage(img_content);
    let processed_style_image = model[0].preprocessImage(img_style);

    await tf.nextFrame();
    const style_image = await tf.tidy(() => {
      return model[0].predict(processed_style_image);
    });

    console.log("done style");

    await tf.nextFrame();
    const content_image = await tf.tidy(() => {
      return model[0].predict(processed_content_image);
    });

    console.log("done content");

    await tf.nextFrame();
    const combine = await tf.tidy(() => {
      //const styleBottleneckScaled = styleBottleneck.mul(tf.scalar(this.styleRatio));
      //const identityBottleneckScaled = identityBottleneck.mul(tf.scalar(1.0-this.styleRatio));
      return style_image.add(content_image);
    });

    console.log("done combination");

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

    console.log("done");
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

      <img id="result" className="result-image" src={resultImg} />

      {image ? (
        <img
          id="image-content"
          className="upload-image"
          src={URL.createObjectURL(image)}
        />
      ) : null}

      {props.imageUrl ? (
        <img
          id="image-style"
          className="style-image"
          crossOrigin="anonymous"
          src={props.imageUrl}
        />
      ) : null}

      {webcam ? (
        <Webcam
          id="webcam-content"
          audio={false}
          height={720}
          screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
          videoRef={videoRef}
        ></Webcam>
      ) : null}

      <ReactTooltip />

      <div className="styletrans-bar">
        <button
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
        </button>
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
            computeStyleTransfer();
          }}
        >
          <IoSparkles />
        </button>
      </div>
    </div>
  );
}
