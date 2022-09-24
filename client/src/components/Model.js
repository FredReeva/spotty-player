import * as tf from "@tensorflow/tfjs";

class Model {
  constructor(model_path) {
    this.isWarmedUp = this.loadModel(model_path).then(() =>
      console.info("Backend running on:", tf.getBackend())
    );
  }

  loadModel(path) {
    console.time("Load model");
    return tf.loadGraphModel(path).then((model) => {
      this._model = model;
      console.timeEnd("Load model");
    });
  }

  preprocessImage(image) {
    return tf.browser
      .fromPixels(image)
      .toFloat()
      .div(tf.scalar(255))
      .expandDims();
  }

  predict(image) {
    if (!this._model) return console.warn("Model not loaded yet!");
    console.time("Stylization...");

    let prediction = this._model.predict(image);

    console.timeEnd("Prediction");
    return prediction;
  }

}

export default Model;
