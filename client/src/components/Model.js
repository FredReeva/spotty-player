import * as tf from "@tensorflow/tfjs";

class Model {
  constructor(model_path) {
    this.isWarmedUp = this.loadModel(model_path).then(() =>
      console.info("Backend running on:", tf.getBackend())
    );
  }

  async loadModel(path) {
    const model = await tf.loadGraphModel(path);
    this._model = model;
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

    let prediction = this._model.predict(image);

    return prediction;
  }
}

export default Model;
