void Brush() {
  float s = 2+30/dist(px, py, brush.x, brush.y);
  s=min(20, s);//limit strokeWeight
  float r0=min(40, (5/dist(px, py, brush.x, brush.y)));//stay the longer the flower will get bigger 
  strokeWeight(s);
  stroke(cols[1], s*100);
  line(px, py, brush.x, brush.y);
  stroke(cols[2], s*100);
  line(width-px, height-py, width-brush.x, height-brush.y);//symmetric 1
  stroke(cols[3], s*100);
  line(width-px, py, width-brush.x, brush.y);//symmetric 2
  stroke(cols[4], s*100);
  line(px, height-py, brush.x, height-brush.y); //symmetric 3
}

void ink(float bx, float by, color  c) {
  noStroke();
  fill(c);
  float r = 0.65*random(0.5, 10);
  ellipse(bx+random(-30, 30), by+random(-30, 30), r, r);
  ellipse(bx+random(-30, 30), by+random(-30, 30), r, r);
}


void autosplatter() { //the growing square above background 
  strokeWeight(1);
  stroke(cols[(int)random(cols.length)], 50);
  if (frameCount<2000) 
   for (int i=0; i<3000; i++)    
     jump();
}

void jump() {
  float nx=sin(-12.4*y0)-cos(12.5*x0);
  float ny=sin(-1*x0)-cos(1.9+y0);   
  point(200*x0+width/2, 200*y0+height/2);
  x0=nx;
  y0=ny;
}
