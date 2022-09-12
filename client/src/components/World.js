import Song from "./SongObj";

class World {
  constructor(p5_ctx) {
    this.p5_ctx = p5_ctx;
    this.song = {};
    this.current_song = "";
    this.history = [];
    this.n_songs = 3;

    this.song = new Song(this.p5_ctx, [0, 0], 300, true);
    for (let i = 1; i < this.n_songs; i++) {
      this.history[i] = new Song(
        this.p5_ctx,
        [500 * Math.random() - 250, 500 * Math.random() - 250],
        200 * Math.random() + 50
      );
    }
  }

  drawWorld(song, history, colors) {
    if (this.p5_ctx.frameCount % 10 === 0) {
      //console.log(p.frameRate());
      //   let gradient = this.p5_ctx.createLinearGradient(
      //     -this.p5_ctx.windowWidth / 2,
      //     -this.p5_ctx.windowHeight / 2,
      //     this.p5_ctx.windowWidth / 2,
      //     this.p5_ctx.windowHeight / 2
      //   );
      //   gradient.addColorStop(0, colors[0]);
      //   gradient.addColorStop(1, colors[1]);

      //   this.p5_ctx.fillStyle = gradient;

      this.p5_ctx.background(colors[0]);
      if (this.current_song !== song.id) {
        // here song has changed
        this.song.loadImage(song);
        console.log(history);
        console.log(song);
        for (let i = 1; i < this.n_songs; i++) {
          this.history[i].loadImage(history.body.items[i].track);
        }

        this.current_song = song.id;
      }
    }

    this.song.drawSong();
    for (let i = 1; i < this.n_songs; i++) {
      this.history[i].drawSong();
    }

    this.p5_ctx.noStroke();
  }

  getMouseClick() {
    for (let i = 1; i < this.n_songs; i++) {
      this.history[i].songClick();
    }
  }
}

export default World;
