import Song from "./SongObj";

class World {
  constructor(p5_ctx) {
    this.p5_ctx = p5_ctx;
    this.songs = [];
    this.n_songs = 3;
    this.current_song = "";
    this.songs[0] = new Song(this.p5_ctx, [0, 0], 300, true);

    for (let i = 1; i < this.n_songs; i++) {
      this.songs[i] = new Song(
        this.p5_ctx,
        [500 * Math.random() - 250, 500 * Math.random() - 250],
        200 * Math.random() + 50
      );
    }
  }

  drawWorld(history, colors) {
    if (this.p5_ctx.frameCount % 300 === 0 && history && colors) {
      this.p5_ctx.background(colors[0]);
      console.log(history);

      if (this.current_song !== history[0].track.id) {
        // here song has changed
        this.songs[0].loadImage(history[0]);
        console.log(history[0]);

        for (let i = 1; i < this.n_songs; i++) {
          this.songs[i].loadImage(history[i]);
        }

        this.current_song = history[0].track.id;
      }
    }

    this.songs[0].drawSong();
    for (let i = 1; i < this.n_songs; i++) {
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
