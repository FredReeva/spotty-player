float min_speed = 50;
float max_speed = 200;

class Brush {
    PVector brush_pos;
    PVector prev_brush_pos = new PVector();
    float brush_size;
    color col;
    float speed;

    Brush() {
        this.brush_pos  = new PVector(random(0, width), random(0, height));
        this.prev_brush_pos = this.brush_pos.copy();
        this.brush_size = 2+10/this.brush_pos.dist(this.prev_brush_pos);
        this.col = color(100, 100, 100);
        this.speed = 0;
    }

    Brush(color col) {
        this.brush_pos  = new PVector(random(0, width), random(0, height));
        this.prev_brush_pos = this.brush_pos.copy();
        this.brush_size = 2+10/(this.brush_pos.dist(this.prev_brush_pos));
        this.col = col;
        this.speed = 0;
    }

    void draw() {
        brush_size = 5+30/(1+brush_pos.dist(prev_brush_pos));
        strokeWeight(brush_size);
        stroke(col);
        line(brush_pos.x, brush_pos.y, prev_brush_pos.x, prev_brush_pos.y);
    }

    void move() {
        speed = random(min_speed, max_speed);
        prev_brush_pos.x = brush_pos.x;
        prev_brush_pos.y = brush_pos.y;
        // brush_pos.x += random(-speed, speed);
        // brush_pos.y += random(-speed, speed);
        brush_pos.x += (brush_pos.x+random(-speed, speed)-brush_pos.x)/5;
        brush_pos.y += (brush_pos.y+random(-speed, speed)-brush_pos.y)/5;

    }

    boolean isOutOfCanvas() {
        return brush_pos.x<0 || brush_pos.y<0 || brush_pos.x>width || brush_pos.y>height;
    }

    void wrap() {
        
        if(brush_pos.x<0) brush_pos.x = 0;
        if(brush_pos.y<0) brush_pos.y = 0;
        if(brush_pos.x>width) brush_pos.x = width;
        if(brush_pos.y>height) brush_pos.y = height;
        
    }

    void changeColor(color col) {
        this.col = col;
    }
}