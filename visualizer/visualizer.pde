import processing.net.*;
Server s;
color[] cols= {color(255, 255, 255),   color(0, 0, 0), color(0, 0, 0), color(0, 0, 0), color(0, 0, 0)};
PVector brush = new PVector(0, 0);
float px;
float py;
float x0=0;
float y0=0;
float positionX, positionY;
int r,g,b;
PImage albumImg;
float speed = 10;
int imWidth = 400;
int imHeight = 400;

void setup() {
  s = new Server(this, 12000);
  size(1000, 1000);
  noStroke();  
  background(cols[0]);
  positionX = 500;
  positionY = 500;
  imageMode(CENTER);
  albumImg = loadImage("https://i.scdn.co/image/ab67616d0000b273483c2fc141fcb4efe4470fb7", "png");
}

void draw() {

  // check if a client sent something
  Client c = s.available();
  if (c != null) {
    String input = c.readString();
    String[] inputStrings = split(input, "\n");
    

    String colorList = inputStrings[0].replaceAll("[^0-9,]", "");
    String imageUrl = inputStrings[1];
    println(colorList);
    println(imageUrl);
    
    albumImg = loadImage(imageUrl, "png");
    int[] values = int(split(colorList, ','));
    
    
    for(int i=0; i<5; i++){
        r = values[3*i];
        g = values[3*i+1];
        b = values[3*i+2];
      cols[i] = color(r, g, b);
    }
    background(cols[0]);
    
  }
  
  brush.x+=(positionX-brush.x)/80;
  brush.y+=(positionY-brush.y)/80;//follow the mouse with delay effect
  if (frameCount>40) 
    Brush();
  px=brush.x;
  py=brush.y;//stored value:)
  autosplatter();
  image(albumImg, width/2, height/2, imWidth, imHeight);
  speed = random(10,40);
  positionX += random(-speed,speed);
  positionY += random(-speed,speed);
  if(positionX>width) {positionX += random(-speed,-1);}
  if(positionX<0) {positionX += random(1,speed);}
  if(positionY>height) {positionY += random(-speed,-1);}
  if(positionY<0) {positionY += random(1,speed);}
  if(positionX>width/2-imWidth/2 && positionX<width/2) {positionX += random(-speed,-1);}
  if(positionX<width/2+imWidth/2 && positionX>width/2) {positionX += random(1,speed);}
  if(positionY>height/2-imHeight/2 && positionY<height/2) {positionY += random(-speed,-1);}
  if(positionY<height/2+imHeight/2 && positionY>height/2) {positionY += random(1,speed);}

}


