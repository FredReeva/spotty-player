import * as tf from "@tensorflow/tfjs";

class Model {
  constructor(image) {
    // this.alphabet = "abcdefghijklmnopqrstuvwxyz";
    // this.characters = "0123456789" + this.alphabet.toUpperCase() + this.alphabet
    // this.inputCanvas = document.getElementById("input-canvas")
    this.isWarmedUp = this.loadModel().then(() =>
      console.info("Backend running on:", tf.getBackend())
    );
  }

  loadModel() {
    console.time("Load model");
    return tf
      .loadGraphModel(
        "./models/saved_model_transformer_separable_js/model.json"
      )
      .then((model) => {
        this._model = model;
        console.timeEnd("Load model");


      });
  }

  // /**
  //  * Takes an ImageData object and reshapes it to fit the model
  //  * @param {ImageData} pixelData
  //  */
  // preprocessImage(pixelData) {

  // 	const targetDim = 28,
  // 		edgeSize = 2,
  // 		resizeDim = targetDim-edgeSize*2,
  // 		padVertically = pixelData.width > pixelData.height,
  // 		padSize = Math.round((Math.max(pixelData.width, pixelData.height) - Math.min(pixelData.width, pixelData.height))/2),
  // 		padSquare = padVertically ? [[padSize,padSize], [0,0], [0,0]] : [[0,0], [padSize,padSize], [0,0]];

  // 	let	tempImg = null;

  // 	// remove the previous image to avoid memory leak
  // 	if(tempImg) tempImg.dispose();

  // 	return tf.tidy(() => {
  // 		// convert the pixel data into a tensor with 1 data channel per pixel
  // 		// i.e. from [h, w, 4] to [h, w, 1]
  // 		let tensor = tf.browser.fromPixels(pixelData, 1)
  // 			// pad it such that w = h = max(w, h)
  // 			.pad(padSquare, 255.0)

  // 		// scale it down
  // 		tensor = tf.image.resizeBilinear(tensor, [resizeDim, resizeDim])
  // 			// pad it with blank pixels along the edges (to better match the training data)
  // 			.pad([[edgeSize,edgeSize], [edgeSize,edgeSize], [0,0]], 255.0)

  // 		// invert and normalize to match training data
  // 		tensor = tf.scalar(1.0).sub(tensor.toFloat().div(tf.scalar(255.0)))

  // 		// display what the model will see (keeping the tensor outside the tf.tidy scope is necessary)
  // 		tempImg = tf.keep(tf.clone(tensor))
  // 		this.showInput(tempImg)

  // 		// Reshape again to fit training model [N, 28, 28, 1]
  // 		// where N = 1 in this case
  // 		return tensor.expandDims(0)
  // 	});
  // }

  // /**
  //  * Takes an ImageData objects and predict a character
  //  * @param {ImageData} pixelData
  //  * @returns {string} character
  //  */
  predict(image) {
    if (!this._model) return console.warn("Model not loaded yet!");
    console.time("Stylization...");
    let preprocessed_image = tf.browser
      .fromPixels(image)
      .toFloat()
      .div(tf.scalar(255))
      .expandDims();

    let prediction = this._model.predict(preprocessed_image);

    console.timeEnd("Prediction");
    return prediction;
  }

  // /**
  //  * Helper function to clean previously predicted images
  //  */
  // clearInput() {

  // 	[...this.inputCanvas.parentElement.getElementsByTagName("img")].map(el => el.remove())
  // 	this.inputCanvas.getContext('2d').clearRect(0, 0, this.inputCanvas.width, this.inputCanvas.height)
  // }

  // /**
  //  * Takes a tensor and displays it on a canvas and displays the
  //  * previous canvas rendering as an image
  //  * @param {tensor} tempImg
  //  */
  // showInput(tempImg) {

  // 	let legacyImg = new Image
  // 	legacyImg.src = this.inputCanvas.toDataURL("image/png")
  // 	this.inputCanvas.parentElement.insertBefore(legacyImg, this.inputCanvas)

  // 	tf.browser.toPixels(tempImg, this.inputCanvas)
  // }

  // /**
  //  * Helper function, to easier debug tensors
  //  * @param {string} name
  //  * @param {tf.tensor} tensor
  //  * @param {int} width
  //  * @param {int} height
  //  */
  // static log(name, tensor, width = 28, height = 28) {

  // 	tensor = tensor.dataSync()
  // 	console.log("Tensor name", name, tensor)
  // 	for(let i = 0; i<width*height; i+=width) {
  // 		console.log(tensor.slice(i,i+width).reduce((acc, cur) => acc + ((cur === 0 ? "0" : "1")+"").padStart(2)), "")
  // 	}
  // }
}

export default Model;
