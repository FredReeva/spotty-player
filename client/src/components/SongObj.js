class Song {
  constructor(id, draw_context, position, size) {
    this.id = id;
    this.draw_context = draw_context;
    this.collision_detected = false;
    this.show_tooltip = false;
    this.text = this.draw_context.createGraphics(
      this.draw_context.windowWidth / 2,
      this.draw_context.windowHeight / 2
    );
    this.pos = position;
    this.dragging = false;
    this.vel = draw_context.createVector(
      this.draw_context.random(-2, 2),
      this.draw_context.random(-2, 2)
    );
    this.acc = draw_context.createVector(
      this.draw_context.random(-2, 2),
      this.draw_context.random(-2, 2)
    );
    this.force = draw_context.createVector(0, 0);

    this.size = size;
    this.n_x = 100 * Math.random() - 50;
    this.n_y = 100 * Math.random() - 50;
  }

  loadImage() {
    if (this.song_infos) {
      this.image = this.song_infos.album.images[0].url;

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
    this.applyForce(this.force);

    //this.vel.setMag(0);
    if (this.acc.mag() < 0.1) this.acc.setMag(0);

    this.vel.add(this.acc);
    if (this.vel.mag() < 0.1) this.vel.setMag(0);
    this.vel.limit(0.8);
    this.pos.add(this.vel);

    this.acc.mult(0);
    this.force.mult(0);
  }

  drawSong() {
    this.draw_context.circle(this.pos.x, this.pos.y, this.size);

    if (this.img) {
      this.draw_context.texture(this.img);
    }
  }

  computeCollision(other) {
    if (this.checkIntersection(other.pos, other.size)) {
      this.collision_detected = true;
      let obj_pos = this.pos.copy();
      let other_pos = other.pos.copy();
      let distance_vec = obj_pos.sub(other_pos);

      if (this.id !== 0) this.computeCorrectPosition(other);
      this.vel.reflect(distance_vec);

      this.applyCollisionFriction();
    }
  }

  gravitationalForce(attractor_mass) {
    let center_gravity = attractor_mass.pos.copy();
    let obj_pos = this.pos.copy();
    let grav_vector = center_gravity.sub(obj_pos);
    let dist = grav_vector.mag();
    grav_vector.normalize();
    let mag = (this.size * attractor_mass.size) / (dist + 1e-9);
    let grav_force = grav_vector.setMag(mag);
    this.force.add(grav_force);
  }

  applyFriction() {
    let friction = this.vel.copy();
    friction.normalize();
    friction.mult(-1);
    friction.setMag(this.vel.mag());
    this.force.add(friction);
  }

  computeCorrectPosition(other) {
    //let min_dist = this.size/2 + other.size/2
    let other_pos = other.pos.copy();
    let obj_pos = this.pos.copy();

    let collision_weight = other.size / (other.size + this.size);
    let collision_point = this.draw_context.constructor.Vector.lerp(
      other_pos,
      obj_pos,
      collision_weight
    );

    let distance_vec_direction = this.draw_context.constructor.Vector.sub(
      other_pos,
      obj_pos
    ).normalize();
    let this_coll = distance_vec_direction.copy().setMag(-this.size / 2);

    let this_vec = this.draw_context.constructor.Vector.add(
      collision_point,
      this_coll
    );

    this.pos.set(this_vec.x, this_vec.y);
  }

  applyCollisionFriction() {
    let friction = this.vel.copy();
    friction.normalize();
    friction.mult(-1);
    friction.setMag(this.vel.mag() * this.size * 0.1);
    this.force.add(friction);
  }

  checkIntersection(vector, diameter) {
    let dist = this.pos.dist(vector);

    return dist <= this.size / 2 + diameter / 2;
  }

  getSong(song_infos) {
    this.song_infos = song_infos;
  }

  applyForce() {
    this.force.div(this.size);
    this.acc.add(this.force);
  }

  displayTooltip() {
    // if (this.show_tooltip) {
    //   this.text.textFont("Source Code Pro");
    //   this.text.textSize(10);
    //   this.text.fill(0, 0, 0);
    //   this.text.noStroke();
    //   this.text.text(
    //     "test",
    //     this.draw_context.windowWidth,
    //     this.draw_context.windowHeight
    //   );
    // }
  }

  mouseMoveSong() {
    var mouse_pos_orig = this.draw_context.createVector(
      this.draw_context.mouseX - this.draw_context.windowWidth / 2,
      this.draw_context.mouseY - this.draw_context.windowHeight / 2
    );
    if (this.dragging) {
      this.pos = mouse_pos_orig;
    }
  }

  songClicked() {
    let mouse_pos_orig = this.draw_context.createVector(
      this.draw_context.mouseX - this.draw_context.windowWidth / 2,
      this.draw_context.mouseY - this.draw_context.windowHeight / 2
    );

    if (this.checkIntersection(mouse_pos_orig, 0)) {
      //this.size = 300;
    }
  }
  songPressed() {
    let mouse_pos_orig = this.draw_context.createVector(
      this.draw_context.mouseX - this.draw_context.windowWidth / 2,
      this.draw_context.mouseY - this.draw_context.windowHeight / 2
    );

    if (this.checkIntersection(mouse_pos_orig, 0)) {
      this.dragging = true;
    }
  }

  songReleased() {
    let mouse_pos_orig = this.draw_context.createVector(
      this.draw_context.mouseX - this.draw_context.windowWidth / 2,
      this.draw_context.mouseY - this.draw_context.windowHeight / 2
    );

    if (this.checkIntersection(mouse_pos_orig, 0)) {
      this.dragging = false;
    }
  }

  mouseOver() {
    let mouse_pos_orig = this.draw_context.createVector(
      this.draw_context.mouseX - this.draw_context.windowWidth / 2,
      this.draw_context.mouseY - this.draw_context.windowHeight / 2
    );

    if (this.checkIntersection(mouse_pos_orig, 0)) {
      this.show_tooltip = true;
    } else {
      this.show_tooltip = false;
    }
  }
}

export default Song;
