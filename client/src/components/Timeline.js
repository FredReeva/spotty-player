import Song from "./SongObj";

class Timeline {
  constructor(p5_ctx) {
    this.p5_ctx = p5_ctx;
    this.songs = [];
    this.n_songs = 30;
    this.current_song = "";
    this.size = 100;
  }

  initTimeline(past_songs) {
    past_songs.forEach((old_song) => {
      let valence = this.p5_ctx.map(
        old_song.valence,
        0,
        1,
        -this.p5_ctx.windowWidth / 2,
        this.p5_ctx.windowWidth / 2
      );
      let energy = this.p5_ctx.map(
        old_song.energy,
        0,
        1,
        this.p5_ctx.windowHeight / 2,
        -this.p5_ctx.windowHeight / 2
      );

      let song_pos = this.p5_ctx.createVector(valence, energy);
      let song = new Song(false, this.p5_ctx, song_pos, this.size);
      song.getSong(old_song);
      song.loadImage();
      this.songs.push(song);
    });
  }

  // resizeCanvas(playing, past_songs, colors)
  // {
  //   this.initTimeline(past_songs)
  //   this.drawTimeline(playing, colors)
  // }

  drawTimeline(playing, colors) {
    this.p5_ctx.background(colors[0]);

    if (this.p5_ctx.frameCount % 20 === 0 && playing && colors) {
      // this.songs.forEach((song_circle, index) => {
      //   song_circle.mouseOver(colors[2]);
      // });

      if (this.current_song !== playing.id) {
        let valence = this.p5_ctx.map(
          playing.valence,
          0,
          1,
          -this.p5_ctx.windowWidth / 2,
          this.p5_ctx.windowWidth / 2
        );
        let energy = this.p5_ctx.map(
          playing.energy,
          0,
          1,
          this.p5_ctx.windowHeight / 2,
          -this.p5_ctx.windowHeight / 2
        );

        let song_pos = this.p5_ctx.createVector(valence, energy);
        let song = new Song(false, this.p5_ctx, song_pos, this.size);

        song.getSong(playing);
        song.loadImage();

        this.songs.push(song);
        this.current_song = playing.id;
      }
    }

    for (let i = 0; i < this.songs.length; i++) {
      //song_circle.displayTooltip()

      this.p5_ctx.stroke(colors[1], 100);
      this.p5_ctx.strokeWeight(5);
      this.p5_ctx.fill(colors[1], 100);

      if (i != this.songs.length - 1) {
        this.p5_ctx.line(
          this.songs[i].pos.x,
          this.songs[i].pos.y,
          -1,
          this.songs[i + 1].pos.x,
          this.songs[i + 1].pos.y,
          -1
        );
      }

      this.songs[i].drawSong();
    }
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
