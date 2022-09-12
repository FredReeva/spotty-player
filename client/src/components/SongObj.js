class Song {
  constructor(draw_context, position, size, is_current_song = false) {
    this.draw_context = draw_context;
    this.pos = position;
    this.size = size;
    this.is_current_song = is_current_song;
  }

  loadImage(response) {
    if (response) {
      this.image = response.track.album.images[0].url;

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

  drawSong() {
    this.draw_context.circle(this.pos[0], this.pos[1], this.size);
    
    if (this.img) {
      this.draw_context.texture(this.img);
    }
  }

  songClick() {
    var mouse_pos_orig = [
      this.draw_context.mouseX - this.draw_context.windowWidth / 2,
      this.draw_context.mouseY - this.draw_context.windowHeight / 2,
    ];
    let dist = this.draw_context.dist(
      mouse_pos_orig[0],
      mouse_pos_orig[1],
      this.pos[0],
      this.pos[1]
    );
    if (dist < this.size / 2) {
      console.log("obj clicked");
      //this.draw_context.translate(this.pos[0], this.pos[1], 0);
    }
  }
}

export default Song;
