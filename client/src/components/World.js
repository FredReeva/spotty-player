import Song from "./SongObj";

class World {
  constructor(p5_ctx) {
    this.p5_ctx = p5_ctx;
    this.songs = [];
    this.n_songs = 30;
    this.current_song = "";
    this.main_size = 300;
    this.sizes = [200, 150];
    this.center_pos = this.p5_ctx.createVector(0, 0);
    this.songs.push(new Song(0, this.p5_ctx, this.center_pos, this.main_size));
    this.spawnWorld();
  }

  spawnWorld() {
    let n = 1;

    while (n < this.n_songs) {
      let song_pos = this.p5_ctx.createVector(0, 0);

      let song = new Song(
        n,
        this.p5_ctx,
        song_pos,
        this.sizes[Math.floor(Math.random() * this.sizes.length)]
      );

      this.songs.push(song);
      n++;
    }
  }

  drawWorld(playing, colors) {
    if (this.p5_ctx.frameCount % 30 === 0 && playing && colors) {
      this.p5_ctx.background(colors[0]);

      if (this.current_song !== playing.id) {
        // here song has changed

        this.songs.forEach((song_circle, index) => {
          song_circle.getSong(playing)
          song_circle.loadImage();
          song_circle.pos.setMag(0);
        });

        this.current_song = playing.id;
      }

      this.songs.forEach((song_circle, index) => {
        song_circle.mouseOver();
      });
    }

    this.p5_ctx.background(colors[0]);

    this.songs.forEach((song_circle, index) => {
      if (index !== 0) {
        song_circle.gravitationalForce(this.songs[0]);
        song_circle.applyFriction();
        song_circle.applyForce();
        song_circle.mouseMoveSong();
        song_circle.moveSong();
        
      }
      for (let i = this.songs.length - 1; i >= 0; i--) {
        if (i !== song_circle.id) song_circle.computeCollision(this.songs[i]);
      }
      song_circle.displayTooltip();
      song_circle.drawSong();
    });

    this.p5_ctx.noStroke();
  }

  getMousePressed() {
    for (let i = 1; i < this.n_songs; i++) {
      this.songs[i].songPressed();
    }
  }

  getMouseClicked() {
    for (let i = 1; i < this.n_songs; i++) {
      this.songs[i].songClicked();
    }
  }

  getMouseReleased() {
    for (let i = 1; i < this.n_songs; i++) {
      this.songs[i].songReleased();
    }
  }
}

export default World;
