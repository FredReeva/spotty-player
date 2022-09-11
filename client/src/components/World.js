import Song from "./SongObj";

class World {
  constructor(p5_ctx) {
    this.p5_ctx = p5_ctx;
    this.songs = [];
    this.current_song = "";
    this.n_songs = 3;

    this.songs[0] = new Song(this.p5_ctx, [0, 0], 300, true);
    for (let i = 1; i < this.n_songs; i++) {
      this.songs[i] = new Song(
        this.p5_ctx,
        [500 * Math.random() - 250, 500 * Math.random() - 250],
        200 * Math.random() + 50
      );
    }
  }

  drawWorld(song, colors) {
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
        //console.log(this.props.queue.queue.length);
        for (let i = 1; i < this.n_songs; i++) {
          this.songs[i].loadImage(song);
        }

        this.current_song = song.id;
      }
    }

    for (let i = 0; i < this.n_songs; i++) {
      this.songs[i].drawSong();
    }

    this.p5_ctx.noStroke();
  }

  getMouseClick() {
    for (let i = 1; i < this.n_songs; i++) {
      this.songs[i].songClick();
    }
  }
}

export default World;
