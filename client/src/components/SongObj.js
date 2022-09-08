class Song {
  constructor(draw_context, position, size) {
    this.draw_context = draw_context;
    this.pos = position;
    this.size = size;
    // draw_context.mouseClicked = mouseClicked();
  }

  getTitle() {
    return this.title;
  }

  getAlbum() {
    return this.album;
  }

  getArtist() {
    return this.artist;
  }

  loadImage(response) {
    // this.title = response.name;
    // this.album = response.album.name;
    // this.artist = response.artists[0].name;
    if (response) {
      this.image = response.album.images[0].url;
      this.img = this.draw_context.loadImage(this.image);
    } else {
      console.log("image not loaded yet...");
    }
  }

  drawSong() {
    // console.log("hey")
    this.draw_context.circle(this.pos[0], this.pos[1], this.size);
    if (this.img) {
      this.draw_context.texture(this.img);
    }
  }

  clicked() {
    let dist = this.draw_context.dist(
      this.draw_context.mouseX,
      this.draw_context.mouseY,
      this.pos[0] + this.draw_context.windowWidth / 2,
      this.pos[1] + this.draw_context.windowHeight / 2
    );
    if (dist < this.size / 2) {
      console.log("obj clicked");
    }
  }
}

export default Song;
