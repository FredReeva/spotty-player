import Song from "./SongObj";

class Timeline {
  constructor(p5_ctx) {
    this.p5_ctx = p5_ctx;
    this.songs = [];
    this.n_songs = 30;
    this.current_song = "";
    this.main_size = 100;
    this.start_pos = this.p5_ctx.createVector(
      -this.p5_ctx.windowWidth / 2 + this.main_size / 2,
      -this.p5_ctx.windowheight / 2 + this.main_size / 2
    );
    this.initTimeline();
  }

  initTimeline() {
    let n = 0;

    while (n < this.n_songs) {
      let song_pos = this.start_pos.copy();
      song_pos.set(n * 100 - 500, 0);

      let song = new Song(false, this.p5_ctx, song_pos, this.main_size);

      this.songs.push(song);
      n++;
    }
  }

  drawTimeline(playing, past_songs, colors) {
    this.p5_ctx.background(colors[0]);
    if (this.p5_ctx.frameCount % 20 === 0 && playing && colors && past_songs) {
      this.songs.forEach((song_circle, index) => {
        song_circle.mouseOver(colors[2]);
      });
      if (this.current_song !== playing.id) {
        // here song has changed

        for (let i = 0; i < past_songs.length; i++) {
          this.songs[i].getSong(past_songs[i]);

          this.songs[i].loadImage();
        }

        this.songs[past_songs.length].getSong(playing);

        this.songs[past_songs.length].loadImage();

        this.current_song = playing.id;
      }
    }

    this.songs.forEach((song_circle, index) => {
      song_circle.displayTooltip();
      song_circle.drawSong();
    });

    this.p5_ctx.noStroke();
  }

  //   getMouseClicked() {
  //     for (let i = 1; i < this.n_songs; i++) {
  //       if (this.songs[i].songClicked() && this.songs[i].song_infos) {
  //         return this.songs[i].song_infos.id;
  //       }
  //     }
  //   }
}

export default Timeline;
