int trail_length = 300;
float brush_size = 20;

class Brush {
    
    color col;
    
    PVector[] history;
    PVector velocity;
    PVector acceleration;
    float xoff, yoff;

    Brush(color col, PVector init_position) {
        this.col = col;
        this.history = new PVector[trail_length];
        this.xoff = init_position.x;
        this.yoff = init_position.y;
        this.velocity = new PVector(0,0);
        this.acceleration = new PVector(0,0);
        
        for(int i=0; i<trail_length; i++) {
            history[i] = new PVector(map(noise(xoff), 0, 1, 0, width), map(noise(yoff), 0, 1, 0, height));
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

        // this.history[trail_length-1].x = map(noise(xoff), 0, 1, 0, width);
        // this.history[trail_length-1].y = map(noise(yoff), 0, 1, 0, height);

        // xoff += speed;
        // yoff += speed;

        this.velocity.add(this.acceleration);
        this.velocity.limit(max_speed);
        this.history[trail_length-1].add(this.velocity);
        this.acceleration.mult(0);
        

        for(int i=0; i<trail_length-1; i++) {
            this.history[i].x = this.history[i+1].x;
            this.history[i].y = this.history[i+1].y;
        }

    }

    void applyForce(PVector force) { 
        this.acceleration.add(force);
    }

    void followField(PVector[][] gradients) {

        
        int xGrid = constrain(floor(this.history[trail_length-1].x/scale), 0, floor(width/scale)-1);
        int yGrid = constrain(floor(this.history[trail_length-1].y/scale), 0, floor(height/scale)-1);

        this.applyForce(gradients[xGrid][yGrid]);
    }

}