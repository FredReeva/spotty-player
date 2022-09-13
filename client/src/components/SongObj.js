class Song {
  constructor(draw_context, position, size, is_current_song = false) {
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
    this.is_current_song = is_current_song;
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
    this.acc.limit(0.001);
    this.vel.add(this.acc);
    this.vel.limit(10);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  drawSong() {
    this.draw_context.circle(this.pos.x, this.pos.y, this.size);

    if (this.img) {
      this.draw_context.texture(this.img);
    }
  }

  applyForce(force) {
    let f = force.copy();
    f.div(this.size);
    this.acc.add(f);
  }

  songClick() {
    var mouse_pos_orig = [
      this.draw_context.mouseX - this.draw_context.windowWidth / 2,
      this.draw_context.mouseY - this.draw_context.windowHeight / 2,
    ];
    let dist = this.draw_context.dist(
      mouse_pos_orig[0],
      mouse_pos_orig[1],
      this.pos.x,
      this.pos.y
    );
    if (dist < this.size / 2) {
      console.log("obj clicked");
      //this.draw_context.translate(this.pos[0], this.pos[1], 0);
    }
  }
}

export default Song;
