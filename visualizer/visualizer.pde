import processing.net.*;
Server s;
int PORT = 12000;

color[] cols= {color(255, 255, 255),   color(0, 0, 0), color(0, 0, 0), color(0, 0, 0), color(0, 0, 0)};

int r,g,b;
PImage album_img;

int album_width = 400, album_height = 400;

Brush[] brushes;
int n_brushes;
boolean album_has_changed = true;
String old_input = null;

void setup() {
  s = new Server(this, PORT);

  size(800, 800);
  noStroke();  
  background(cols[0]);
  imageMode(CENTER);

  n_brushes = cols.length-1;

  brushes = new Brush[n_brushes];
  for(int i=0; i<n_brushes; i++) {
    brushes[i] = new Brush(cols[i+1]);
  }


}

void draw() {

  getAlbumColors();

  for(int i=0; i<n_brushes; i++) {
    brushes[i].move();
    if(brushes[i].isOutOfCanvas()) brushes[i].wrap();
    brushes[i].draw();
    
  }

  if(album_img!=null) image(album_img, width/2, height/2, album_width, album_height);
  if(album_has_changed) {
    background(cols[0]);
    for(int i=0; i<n_brushes; i++) {
      brushes[i].changeColor(cols[i+1]);
      album_has_changed = false;
    }
  }
}

void getAlbumColors() {
  Client cl = s.available();

  if (cl != null) {
    
    String input = cl.readString();

    if(old_input != input) {
      album_has_changed = true;

      String[] input_splitted = split(input, "\n");
      String color_list = input_splitted[0].replaceAll("[^0-9,]", "");
      String image_url = input_splitted[1];
    
      album_img = loadImage(image_url, "png");
      int[] color_values = int(split(color_list, ','));
    
      assignColors(color_values);

      old_input = input;
    }
    
  }
}

void assignColors(int[] color_values) {
  for(int i=0; i<5; i++){
        r = color_values[3*i];
        g = color_values[3*i+1];
        b = color_values[3*i+2];
      cols[i] = color(r, g, b);
    }
}
