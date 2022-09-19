import Song3d from "./Song3d";

class Timeline {
  constructor(p5_ctx) {
    this.p5_ctx = p5_ctx;
    this.songs = [];
    this.n_songs = 30;
    this.current_song = "";
    this.main_size = 100;
    //this.initTimeline();
  }

  drawTimeline(playing, val_en, past_songs, colors) {
    this.p5_ctx.background(colors[0]);
    this.p5_ctx.ambientMaterial(250);
    this.p5_ctx.cylinder(10, this.p5_ctx.windowHeight);
    this.p5_ctx.rotate(Math.PI / 2);
    this.p5_ctx.cylinder(10, this.p5_ctx.windowHeight);
    if (this.p5_ctx.frameCount % 20 === 0 && playing && colors && past_songs) {
      // this.songs.forEach((song_circle, index) => {
      //   song_circle.mouseOver(colors[2]);
      // });

      if (this.current_song !== playing.id) {
        let valence = this.p5_ctx.map(
          val_en[0],
          0,
          1,
          -this.p5_ctx.windowWidth / 2,
          this.p5_ctx.windowWidth / 2
        );
        let energy = this.p5_ctx.map(
          val_en[1],
          0,
          1,
          this.p5_ctx.windowHeight / 2,
          -this.p5_ctx.windowHeight / 2
        );

        let dance = this.p5_ctx.map(
          val_en[2],
          0,
          1,
          -this.p5_ctx.windowWidth / 2,
          this.p5_ctx.windowWidth / 2
        );

        let song_pos = this.p5_ctx.createVector(valence, energy, dance);
        let song = new Song3d(false, this.p5_ctx, song_pos, this.main_size);

        song.getSong(playing);
        song.loadImage();

        this.songs.push(song);
        this.current_song = playing.id;
      }
    }

    for (let i = 0; i < this.songs.length; i++) {
      //song_circle.displayTooltip();
      this.songs[i].drawSong();
    }

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
