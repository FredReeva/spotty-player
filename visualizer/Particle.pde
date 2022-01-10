

class Particle {

    PVector pos = new PVector();
    PVector vel = new PVector();
    PVector acc = new PVector();
    color col;

    Particle(color col, PVector initial_pos) {
        this.pos = initial_pos;
        this.col = col;
    }

    void show() {
        stroke(this.col,2);
        strokeWeight(3);
        point(this.pos.x, this.pos.y);
        
    }

    void wrapEdges() {
        if(this.pos.x<0) {
            this.pos.x = width;
        }
        if(this.pos.y<0) {
            this.pos.y = height;
        }
        if(this.pos.x>width) {
            this.pos.x = 0;
        }
        if(this.pos.y>height) {
            this.pos.y = 0;
        }
    }

    void move() {

        this.acc.limit(max_acc);
        this.vel.add(this.acc);
        this.vel.limit(max_speed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    void applyForce(PVector force) { 
        this.acc.add(force);
        
    }

    void followField(Gradient gradient_field) {

        
        int xGrid = constrain(floor(this.pos.x/scale), 0, floor(width/scale)-1);
        int yGrid = constrain(floor(this.pos.y/scale), 0, floor(height/scale)-1);

        this.applyForce(gradient_field.getVector(xGrid, yGrid));
    }

    void changeColor(color col) {
        this.col = col;
    }
}