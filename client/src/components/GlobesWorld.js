import Song from "./SongObj";

class World {
  constructor(p5_ctx) {
    this.is_current_view = false;
    this.p5_ctx = p5_ctx;
    this.songs = [];
    this.n_songs = 80;
    this.history_songs = 10;
    this.current_song = "";
    this.main_size = (1.5 * this.p5_ctx.windowHeight) / 3;
    this.sizes = [this.main_size / 3, this.main_size / 2.5];
    this.center_pos = this.p5_ctx.createVector(0, 0);
    this.hovering_song = [];
    this.songs.push(
      new Song(true, this.p5_ctx, this.center_pos, this.main_size)
    );
    this.spawnWorld();
  }

  updateDimensions() {
    this.main_size = (1.5 * this.p5_ctx.windowHeight) / 3;
    this.sizes = [this.main_size / 3, this.main_size / 2.5];
    if (this.songs) {
      this.songs.forEach((song_circle, index) => {
        if (index === 0) {
          song_circle.updateSize(this.main_size);
        } else if (index <= this.history_songs) {
          song_circle.updateSize(this.sizes[0]);
        } else {
          song_circle.updateSize(this.sizes[1]);
        }
      });
    }
  }

  spawnWorld() {
    let n = 1;

    let size = this.sizes[1];
    while (n < this.n_songs) {
      let song_pos = this.p5_ctx.createVector(0, 0);

      if (n <= this.history_songs) {
        size = this.sizes[0];
      } else {
        size = this.sizes[1];
      }

      let song = new Song(false, this.p5_ctx, song_pos, size);

      this.songs.push(song);
      n++;
    }
  }

  drawWorld(playing, history, recommendations, colors) {
    this.p5_ctx.background(colors[0]);
    if (
      this.p5_ctx.frameCount % 20 === 0 &&
      playing &&
      colors &&
      recommendations
    ) {
      // detect hovering
      this.songs.forEach((song_circle, index) => {
        if (index !== 0) {
          song_circle.mouseOver();
        }
      });

      if (this.current_song !== playing.id) {
        // here song has changed
        this.songs.forEach((song_circle, index) => {
          song_circle.pos.setMag(0);
          if (index === 0) {
            song_circle.getSong(playing);
          } else if (
            history &&
            index <= this.history_songs &&
            history.length > 0 &&
            index <= history.length
          ) {
            song_circle.getSong(history[history.length - index]);
            song_circle.is_history = true;
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
        //song_circle.applyFriction();
        song_circle.applyForce();

        if (playing) {
          song_circle.applyDriftingVelocity(playing.energy);
        }

        song_circle.moveSong();
      }
      for (let i = this.songs.length - 1; i >= 0; i--) {
        if (i !== song_circle.id) song_circle.computeInteraction(this.songs[i]);
      }

      song_circle.drawSong();
    });

    this.p5_ctx.noStroke();
  }

  // getMouseDragged() {
  //   for (let i = 1; i < this.n_songs; i++) {
  //     this.songs[i].songDragged();
  //   }
  // }

  getMouseClicked() {
    for (let i = 1; i < this.n_songs; i++) {
      if (this.songs[i].songClicked() && this.songs[i].song_infos) {
        return this.songs[i].song_infos.id;
      }
    }
  }
}

export default World;
