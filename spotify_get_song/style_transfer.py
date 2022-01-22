from __future__ import absolute_import, division, print_function, unicode_literals
import tensorflow as tf
import IPython.display as display
import matplotlib.pyplot as plt
import matplotlib as mpl
import tensorflow_hub as hub

mpl.rcParams["figure.figsize"] = (12, 12)
mpl.rcParams["axes.grid"] = False
import numpy as np
import PIL.Image


def load_model():
    """load the model"""
    hub_module = hub.load(
        "https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2"
    )
    return hub_module


def tensor_to_image(tensor):
    """transform a tensor into an PIL image"""
    tensor = tensor * 255
    tensor = np.array(tensor, dtype=np.uint8)
    if np.ndim(tensor) > 3:
        assert tensor.shape[0] == 1
        tensor = tensor[0]
    return PIL.Image.fromarray(tensor)


def load_img(path_to_img):
    """given the path, load an image to tensorflow"""
    max_dim = 512
    img = tf.io.read_file(path_to_img)
    img = tf.image.decode_image(img, channels=3)
    img = tf.image.convert_image_dtype(img, tf.float32)
    shape = tf.cast(tf.shape(img)[:-1], tf.float32)
    long_dim = max(shape)
    scale = max_dim / long_dim
    new_shape = tf.cast(shape * scale, tf.int32)
    img = tf.image.resize(img, new_shape)
    img = img[tf.newaxis, :]
    return img


def preprocess_image(image, target_dim):
    """resize the image to make it less computationally expensive"""
    shape = tf.cast(tf.shape(image)[1:-1], tf.float32)
    short_dim = min(shape)
    scale = target_dim / short_dim
    new_shape = tf.cast(shape * scale, tf.int32)
    image = tf.image.resize(image, new_shape)
    image = tf.image.resize_with_crop_or_pad(image, target_dim, target_dim)
    return image


def compute_styled_image(content_path, style_path, hub_module):
    # Load the input images.
    content_image = load_img(content_path)
    style_image = load_img(style_path)
    # Preprocess the input images.
    preprocessed_content_image = preprocess_image(content_image, 512)
    preprocessed_style_image = preprocess_image(style_image, 512)
    stylized_image = hub_module(
        tf.constant(preprocessed_content_image), tf.constant(preprocessed_style_image)
    )[0]
    transformed_image = tensor_to_image(stylized_image)
    return transformed_image
