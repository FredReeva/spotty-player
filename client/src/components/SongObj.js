class Song {
  constructor(curr_playing, draw_context, position, size) {
    this.is_currently_playing = curr_playing;
    this.draw_context = draw_context;
    this.shadow_color = [0, 0, 0];
    this.show_tooltip = false;
    this.mouse_hovering = false;
    this.text = this.draw_context.createGraphics(
      this.draw_context.windowWidth / 2,
      this.draw_context.windowHeight / 2
    );
    this.border_alpha = 10;
    this.pos = position;
    this.dragging = false;
    this.vel = this.draw_context.createVector(
      this.draw_context.random(-4, 4),
      this.draw_context.random(-4, 4)
    );
    this.acc = this.draw_context.createVector(
      this.draw_context.random(-2, 2),
      this.draw_context.random(-2, 2)
    );
    this.force = this.draw_context.createVector(0, 0);

    this.size = size;
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
          console.log("error while loading image", err);
          this.loaded_img = "";
        }
      );
    } else {
      console.log("image not loaded yet...");
    }
  }

  moveSong() {
    this.applyForce(this.force);

    //if (this.acc.mag() < 0.01) this.acc.setMag(0);
    this.acc.limit(0.5);
    this.vel.add(this.acc);
    //if (this.vel.mag() < 0.001) this.vel.setMag(0);
    this.vel.limit(0.3);
    this.pos.add(this.vel);

    this.acc.mult(0);
    this.force.mult(0);
  }

  drawSong() {
    this.setShadow();

    this.draw_context.fill(
      this.shadow_color[0],
      this.shadow_color[1],
      this.shadow_color[2],
      this.border_alpha
    );
    this.draw_context.noStroke();
    this.draw_context.circle(this.pos.x, this.pos.y, this.size);

    if (this.img) {
      this.draw_context.texture(this.img);
    }

    this.draw_context.circle(this.pos.x, this.pos.y, this.size - 10);
  }

  limitBorders() {
    let border_top = -this.draw_context.windowHeight / 2;
    let border_bottom = this.draw_context.windowHeight / 2;
    if (this.pos.y < border_top) {
      this.pos.y = border_top;
    }
    if (this.pos.y > border_bottom) {
      this.pos.y = border_bottom;
    }
  }

  computeInteraction(other) {
    //this.repulsionForce(other);

    if (this.checkIntersection(other.pos, other.size)) {
      let obj_pos = this.pos.copy();
      let distance_vec = obj_pos.sub(other.pos);

      if (!this.is_currently_playing) this.computeCorrectPosition(other);
      this.vel.reflect(distance_vec);
      other.vel.reflect(distance_vec);

      //this.applyCollisionFriction();
    }
    this.limitBorders();
  }

  // repulsionForce(other) {
  //   let other_pos = other.pos.copy();
  //   let obj_pos = this.pos.copy();
  //   let repulsion_vector = other_pos.sub(obj_pos);
  //   let dist = repulsion_vector.mag();
  //   dist = dist - (other.size / 2 + this.size / 2);
  //   repulsion_vector.normalize();
  //   let mag = -1 / (Math.pow(dist, 2) + 1e-9);
  //   let repulsion_force = repulsion_vector.setMag(mag);
  //   this.force.add(repulsion_force);
  // }

  gravitationalForce(attractor_mass) {
    let center_gravity = attractor_mass.pos.copy();
    let grav_vector = center_gravity.sub(this.pos);
    let dist = grav_vector.mag() - (attractor_mass.size / 2 + this.size / 2);
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
    let collision_weight = other.size / (other.size + this.size);

    let collision_point = this.draw_context.constructor.Vector.lerp(
      other.pos,
      this.pos,
      collision_weight
    );

    let vec_direction = this.draw_context.constructor.Vector.sub(
      other.pos,
      this.pos
    )
      .setMag(-this.size / 2)
      .add(collision_point);

    this.pos.set(vec_direction.x, vec_direction.y);
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

  // mouseMoveSong() {
  //   var mouse_pos_orig = this.draw_context.createVector(
  //     this.draw_context.mouseX - this.draw_context.windowWidth / 2,
  //     this.draw_context.mouseY - this.draw_context.windowHeight / 2
  //   );

  //   if (this.dragging) {
  //     console.log("dragging");
  //     // var offset = this.draw_context.constructor.Vector.sub(
  //     //   this.pos,
  //     //   mouse_pos_orig
  //     // );

  //   }
  // }

  songClicked() {
    if (this.dragging == false) {
      let mouse_pos_orig = this.draw_context.createVector(
        this.draw_context.mouseX - this.draw_context.windowWidth / 2,
        this.draw_context.mouseY - this.draw_context.windowHeight / 2
      );

      return this.checkIntersection(mouse_pos_orig, 0);
    }
  }
  songDragged() {
    let mouse_pos_orig = this.draw_context.createVector(
      this.draw_context.mouseX - this.draw_context.windowWidth / 2,
      this.draw_context.mouseY - this.draw_context.windowHeight / 2
    );

    if (this.checkIntersection(mouse_pos_orig, 0)) {
      this.dragging = true;
      this.pos = mouse_pos_orig;
    }
  }

  // songReleased() {
  //   let mouse_pos_orig = this.draw_context.createVector(
  //     this.draw_context.mouseX - this.draw_context.windowWidth / 2,
  //     this.draw_context.mouseY - this.draw_context.windowHeight / 2
  //   );

  //   if (this.checkIntersection(mouse_pos_orig, 0)) {
  //     this.dragging = false;
  //   }
  // }

  mouseOver(color) {
    this.shadow_color = color;
    let mouse_pos_orig = this.draw_context.createVector(
      this.draw_context.mouseX - this.draw_context.windowWidth / 2,
      this.draw_context.mouseY - this.draw_context.windowHeight / 2
    );

    if (this.checkIntersection(mouse_pos_orig, 0)) {
      this.mouse_hovering = true;
      this.show_tooltip = true;
    } else {
      this.mouse_hovering = false;

      this.show_tooltip = false;
    }
  }

  setShadow() {
    if (this.mouse_hovering == true) {
      if (this.border_alpha < 200) {
        this.border_alpha += 10;
      } else {
        this.border_alpha = 200;
      }
    } else {
      if (this.border_alpha > 100) {
        this.border_alpha -= 10;
      } else {
        this.border_alpha = 100;
      }
    }
  }
}

export default Song;
