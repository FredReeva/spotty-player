

class EdgePoint {
    color col;
    PVector pos;
    PVector currentPos;
    PVector vel = new PVector();
    PVector acc = new PVector();
    PVector force = new PVector();
    PVector desired = new PVector();  
    float th_pos = 50;
  
  
    float d = 4;
    EdgePoint(color col, int x, int y){
        this.col = col;
        this.pos = new PVector(x, y);
        this.currentPos = new PVector(x, y);
    }
    void show() {
        stroke(col);
        strokeWeight(d);
        point(currentPos.x, currentPos.y);
    }
    void assign(int x, int y) {
        this.pos.x = x;
        this.pos.y = y;
    }
 
    void spring() {
   
        this.desired = this.pos.sub(this.currentPos);
        this.force = this.desired.sub(this.vel);
   
        this.acc.add(force);
        this.acc.limit(0.5);
        this.vel.add(this.acc);
        this.vel.limit(10);
   
        this.currentPos.add(this.vel);
        this.acc.mult(0);
    }
 
    void changeColor(color col) {
        this.col = col;
    }

}