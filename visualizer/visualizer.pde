import processing.net.*;
Server s;
int PORT = 12000;

color[] colors= {color(0, 0, 0),   color(255, 255, 255), color(255, 0, 0), color(0, 255, 0), color(0, 0, 255)};

int r,g,b;
PImage album_img;
PImage texture_img;

float sp = 0.1;
float tsp = 0.005;
float ioff = 0;
float joff = 0;
float toff = 0;

int scale = 30;
int cols, rows;
float angle;
float max_speed = 1;
float max_acc = 0.01;

int album_width = 400, album_height = 400;

int n_colors = colors.length-1; // no bg color
int n_brushes = 40;
int n_particles = 2000;

Brush[] brushes;
Particle[] particles;
PVector[][] gradients;
float force_scale = 0.1;


boolean album_has_changed = true;
String old_input = null;
String showGraphics = "particles";

void setup() {
  s = new Server(this, PORT);

  size(800, 800);
  noStroke();  
  background(colors[0]);
  imageMode(CENTER);

  rows = floor(height/scale);
  cols = floor(width/scale);

  gradients = new PVector[rows][cols];
  particles = new Particle[n_particles];
  brushes = new Brush[n_brushes];
  texture_img = loadImage("texture.png", "png");

  for(int i=0; i<n_brushes; i++) {
    brushes[i] = new Brush(colors[i%n_colors+1], new PVector(random(width), random(height)));
  }

  for(int i=0; i<n_particles; i++) {
    particles[i] = new Particle(colors[i%n_colors+1], new PVector(random(width), random(height)));
  }

  for (int i = 0; i < rows; i++) {
    for(int j = 0; j < cols; j++) {
      gradients[i][j] = new PVector(0,0);
    }
  }


}

void draw() {

  getAlbumColors();
  background( colors[0]);
  strokeWeight(3);

  updateGradients(false);
  
  if(showGraphics=="brushes") {
        for(int i=0; i<n_brushes; i++) {
      brushes[i].wrapEdges();
      brushes[i].followField(gradients);
      brushes[i].move();
      brushes[i].show();
    }
  }


  if(showGraphics=="particles") {
        for(int i=0; i<n_particles; i++) {
      particles[i].wrapEdges();
      particles[i].followField(gradients);
      particles[i].move();
      particles[i].show();
    }
  }

  if(album_img!=null) image(album_img, width/2, height/2, album_width, album_height);
  
  if(album_has_changed) {
    background(colors[0]);
    for(int i=0; i<n_brushes; i++) {
      brushes[i].changeColor(colors[i%n_colors+1]);
      
    }

    for(int i=0; i<n_particles; i++) {
      particles[i].changeColor(colors[i%n_colors+1]);
      
    }
    album_has_changed = false;
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
      colors[i] = color(r, g, b);
    }
}

void updateGradients(boolean showGradients) {
  ioff = 0;
  for (int i = 0; i < rows; i++) {
    joff = 0;
    for(int j = 0; j < cols; j++) {
      
      angle = map(noise(joff,ioff,toff),0,1,-4*PI,4*PI);
      gradients[i][j] = PVector.fromAngle(angle);
      
      if(showGradients) {
        stroke(colors[int(map(angle,-4*PI,4*PI,1, n_colors))]);
        pushMatrix();
        translate(j*scale+scale, i*scale+scale);
        rotate(gradients[i][j].heading());
        line(0, 0, scale, 0);
        popMatrix();
      }
      
      joff += sp;
    }
    ioff += sp;
  }

  toff += tsp;
}