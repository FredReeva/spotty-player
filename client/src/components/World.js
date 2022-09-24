import Song from "./SongObj";

class World {
  constructor(p5_ctx) {
    this.is_current_view = false;
    this.p5_ctx = p5_ctx;
    this.songs = [];
    this.n_songs = 60;
    this.queue_songs = 15;
    this.current_song = "";
    this.main_size = (2 * this.p5_ctx.windowHeight) / 3;
    this.sizes = [300, 150];
    this.center_pos = this.p5_ctx.createVector(0, 0);
    this.songs.push(
      new Song(true, this.p5_ctx, this.center_pos, this.main_size)
    );
    this.spawnWorld();
  }

  spawnWorld() {
    let n = 1;

    let size = this.sizes[1];
    while (n < this.n_songs) {
      let song_pos = this.p5_ctx.createVector(0, 0);

      if (n <= this.queue_songs) {
        size = this.sizes[0];
      } else {
        size = this.sizes[1];
      }

      let song = new Song(false, this.p5_ctx, song_pos, size);

      this.songs.push(song);
      n++;
    }
  }

  drawWorld(playing, queue, recommendations, colors) {
    this.p5_ctx.background(colors[0]);
    if (
      this.p5_ctx.frameCount % 20 === 0 &&
      playing &&
      colors &&
      recommendations &&
      queue
    ) {
      this.songs.forEach((song_circle, index) => {
        song_circle.mouseOver(colors[2]);
      });

      if (this.current_song !== playing.id) {
        // here song has changed
        this.songs.forEach((song_circle, index) => {
          song_circle.pos.setMag(0);
          if (index === 0) {
            song_circle.getSong(playing);
          } else if (index <= this.queue_songs) {
            song_circle.getSong(queue[index]);
          } else {
            song_circle.getSong(recommendations[index]);
          }
          this.songs[index].loadImage();
        });

        this.current_song = playing.id;
      }
    }

    this.songs.forEach((song_circle, index) => {
      if (index !== 0) {
        song_circle.gravitationalForce(this.songs[0]);
        song_circle.applyFriction();
        song_circle.applyForce();
        //song_circle.mouseMoveSong();
        song_circle.moveSong();
      }
      for (let i = this.songs.length - 1; i >= 0; i--) {
        if (i !== song_circle.id) song_circle.computeInteraction(this.songs[i]);
      }
      song_circle.displayTooltip();
      song_circle.drawSong();
    });

    this.p5_ctx.noStroke();
  }

  getMouseDragged() {
    for (let i = 1; i < this.n_songs; i++) {
      this.songs[i].songDragged();
    }
  }

  getMouseClicked() {
    for (let i = 1; i < this.n_songs; i++) {
      if (this.songs[i].songClicked() && this.songs[i].song_infos) {
        return this.songs[i].song_infos.id;
      }
    }
  }

  // getMouseReleased() {
  //   for (let i = 1; i < this.n_songs; i++) {
  //     this.songs[i].songReleased();
  //   }
  // }
}

export default World;
