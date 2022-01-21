import processing.net.*;
Server s;
int PORT = 12000;

color[] colors= {color(0, 0, 0),   color(255, 255, 255), color(255, 0, 0), color(0, 255, 0), color(0, 0, 255)};

int r,g,b;
PImage album_img, edgeImg, style_album_img;
PImage texture_img;

int album_width = 400, album_height = 400;

int n_colors = colors.length-1; // no bg color



boolean album_has_changed = true;
String old_input = null;
System sys;


float[][] kernel = {{ -1, -1, -1}, 
                    { -1,  8, -1}, 
                    { -1, -1, -1}};

void setup() {
  s = new Server(this, PORT);

  size(800, 800);
  noStroke();  
  background(colors[0]);
  imageMode(CENTER);
  
  texture_img = loadImage("texture.png", "png");

  sys = new System(1);

  

}

void draw() {

  getAlbumColors();

  if(album_has_changed) {
    background(colors[0]);
    sys.updateColors();
    album_has_changed = false;
  }


  // if(album_img!=null) image(edgeImg, width/2, height/2, width, height);
  sys.drawSystem();
  if(frameCount%100==0){
    save("../images/generated/canvas.png");
  }
  
  
  if(style_album_img!=null) {
    image(style_album_img, width/2, height/2, width, height);
    
  }

  if(album_img!=null) image(album_img, width/2, height/2, album_width, album_height);
  
  


}

void getAlbumColors() {
  Client cl = s.available();

  if (cl != null) {
    
    String input = cl.readString();

    if(old_input != input) {
      album_has_changed = true;
      JSONObject json_input = parseJSONObject(input);

      if (json_input != null) {
        String image_url = json_input.getString("image");
        String input_color_list = json_input.getString("colors"); // convert to array?
        String color_list = input_color_list.replaceAll("[^0-9,]", "");
    
        album_img = loadImage("../images/album.png", "png");
        style_album_img = loadImage("../images/styled_album.png", "png");
        int[] color_values = int(split(color_list, ','));
        assignColors(color_values);
        edgeImg = getEdgesImage(album_img);
      }

      old_input = input;
    }
    
  }
}

void assignColors(int[] color_values) {
  for(int i=0; i<5; i++){
        r = color_values[3*i];
        g = color_values[3*i+1];
        b = color_values[3*i+2];
      colors[i] = color(r, g, b);
    }
}


// edge detection
PImage getEdgesImage(PImage img) {
  PImage edgeImg = createImage(img.width, img.height, RGB);
  // Loop through every pixel in the image.
  for (int y = 1; y < img.height-1; y++) { // Skip top and bottom edges
    for (int x = 1; x < img.width-1; x++) { // Skip left and right edges
      float sum = 0; // Kernel sum for this pixel
      for (int ky = -1; ky <= 1; ky++) {
        for (int kx = -1; kx <= 1; kx++) {
          // Calculate the adjacent pixel for this kernel point
          int pos = (y + ky)*img.width + (x + kx);
          // Image is grayscale, red/green/blue are identical
          float val = red(img.pixels[pos]);
          // Multiply adjacent pixels based on the kernel values
          sum += kernel[ky+1][kx+1] * val;
        }
      }
      // For this pixel in the new image, set the gray value
      // based on the sum from the kernel
      edgeImg.pixels[y*img.width + x] = color(sum, sum, sum);
    }
  }
  // State that there are changes to edgeImg.pixels[]
  edgeImg.updatePixels();
  return edgeImg;
  
}