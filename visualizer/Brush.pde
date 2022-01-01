int min_size = 20;
int max_size = 23;
float min_speed = 1;
float max_speed = 10;
int trail_length = 255;
float brush_size = 20;


class Brush {
    
    color col;
    float speed;
    PVector[] history;

    Brush(color col, PVector init_position) {
        this.col = col;
        this.history = new PVector[trail_length];

        for(int i=0; i<trail_length; i++) {
            history[i] = new PVector(init_position.x, init_position.y);
        }
    }

    void show() {

        if(this.isOutOfCanvas()) this.limit();

        for(int i=0; i<trail_length; i++) {
            fill(col, i);
            
            circle(this.history[i].x, this.history[i].y, map(i, 0, trail_length-1, 10, brush_size));
        }
    }

    boolean isOutOfCanvas() {
        return this.history[trail_length-1].x<0 || this.history[trail_length-1].y<0 || this.history[trail_length-1].x>width || this.history[trail_length-1].y>height;
    }

    void limit() {
        
        if(this.history[trail_length-1].x<0) this.history[trail_length-1].x = 0;
        if(this.history[trail_length-1].y<0) this.history[trail_length-1].y = 0;
        if(this.history[trail_length-1].x>width) this.history[trail_length-1].x = width;
        if(this.history[trail_length-1].y>height) this.history[trail_length-1].y = height;
        
    }

    void changeColor(color col) {
        this.col = col;
    }
    

    void move() {


        speed = random(min_speed, max_speed);

        this.history[trail_length-1].x += random(-speed, speed);
        this.history[trail_length-1].y += random(-speed, speed);

        

        for(int i=0; i<trail_length-1; i++) {
            this.history[i].x = this.history[i+1].x;
            this.history[i].y = this.history[i+1].y;
        }

    }

}