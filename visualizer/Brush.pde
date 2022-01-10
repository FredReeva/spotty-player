int trail_length = 300;
float brush_size = 20;

class Brush {
    
    color col;
    
    PVector[] history;
    PVector vel;
    PVector acc;

    Brush(color col, PVector init_position) {
        this.col = col;
        this.history = new PVector[trail_length];

        this.vel = new PVector(0,0);
        this.acc = new PVector(0,0);
        
        for(int i=0; i<trail_length; i++) {
            history[i] = new PVector(map(noise(init_position.x), 0, 1, 0, width), map(noise(init_position.y), 0, 1, 0, height));
        }
        
    }

    void show() {
        
        noStroke();
        for(int i=0; i<trail_length; i++) {
            fill(lerpColor(col, colors[0], 1-(i*1/float(trail_length))));
            circle(this.history[i].x, this.history[i].y, map(i, 0, trail_length-1, 10, brush_size));
        }
    }


    void wrapEdges() {
        
        if(this.history[trail_length-1].x<0) {
            this.history[trail_length-1].x = width;
        }
        if(this.history[trail_length-1].y<0) {
            this.history[trail_length-1].y = height;
        }
        if(this.history[trail_length-1].x>width) {
            this.history[trail_length-1].x = 0;
        }
        if(this.history[trail_length-1].y>height) {
            this.history[trail_length-1].y = 0;
        }
        
    }

    void changeColor(color col) {
        this.col = col;
    }
    

    void move() {

        this.acc.limit(max_acc);
        this.vel.add(this.acc);
        this.vel.limit(max_speed);
        this.history[trail_length-1].add(this.vel);
        this.acc.mult(0);
        

        for(int i=0; i<trail_length-1; i++) {
            this.history[i].x = this.history[i+1].x;
            this.history[i].y = this.history[i+1].y;
        }

    }

    void applyForce(PVector force) { 
        this.acc.add(force);
    }

    void followField(Gradient gradient_field) {

        int xGrid = constrain(floor(this.history[trail_length-1].x/scale), 0, floor(width/scale)-1);
        int yGrid = constrain(floor(this.history[trail_length-1].y/scale), 0, floor(height/scale)-1);

        this.applyForce(gradient_field.getVector(xGrid, yGrid));
    }

}