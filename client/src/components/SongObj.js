class Song {
  constructor(draw_context, position, size) {
    this.draw_context = draw_context;
    this.pos = position;
    this.vel = draw_context.createVector(
      this.draw_context.random(-2, 2),
      this.draw_context.random(-2, 2)
    );
    this.acc = draw_context.createVector(
      this.draw_context.random(-2, 2),
      this.draw_context.random(-2, 2)
    );

    this.size = size;
    this.n_x = 100 * Math.random() - 50;
    this.n_y = 100 * Math.random() - 50;
  }

  loadImage(response) {
    if (response) {
      this.image = response.album.images[0].url;

      this.img = this.draw_context.loadImage(
        this.image,
        (img) => {
          this.loaded_img = img;
        },
        (err) => {
          console.log("image not loaded", err);
          this.loaded_img = "";
        }
      );
    } else {
      console.log("image not loaded yet...");
    }
  }

  moveSong() {
    this.vel.add(this.acc);
    this.vel.limit(100);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  drawSong() {
    this.draw_context.circle(this.pos.x, this.pos.y, this.size);

    if (this.img) {
      this.draw_context.texture(this.img);
    }
  }

  computeForce(ground) {
    let direction = ground.pos.copy();

    let force = direction.sub(this.pos);
    force.mult(0.01);
    if (this.checkIntersection(ground.pos, ground.size)) {
      this.vel.mult(-1);
    }

    return force;
  }

  applyFriction(ground) {
    if (this.checkIntersection(ground.pos, ground.size)) {
      let friction = this.vel.copy();
      friction.normalize();
      friction.mult(-5);
      //friction.setMag(this.vel.magSq() * 0.1);
      this.applyForce(friction);
    }
  }

  checkIntersection(vector, diameter) {
    let dist = this.pos.dist(vector);

    return dist < this.size / 2 + diameter / 2;
  }

  applyForce(force) {
    force.div(this.size);
    this.acc.add(force);
  }

  songClick() {
    var mouse_pos_orig = this.draw_context.createVector(
      this.draw_context.mouseX - this.draw_context.windowWidth / 2,
      this.draw_context.mouseY - this.draw_context.windowHeight / 2
    );

    if (this.checkIntersection(mouse_pos_orig, 0)) {
      console.log("mouse clicked on object");
    }
  }
}

export default Song;
