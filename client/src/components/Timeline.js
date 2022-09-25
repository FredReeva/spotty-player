import Song from "./SongObj";

class Timeline {
  constructor(p5_ctx) {
    this.p5_ctx = p5_ctx;
    this.songs = [];
    this.n_songs = 30;
    this.current_song = "";
    this.size = 80;
    this.alpha = 200;
    
  }

  initTimeline(past_songs, margin) {
    past_songs.forEach((old_song) => {
      let valence = this.p5_ctx.map(
        old_song.valence,
        0,
        1,
        -this.p5_ctx.windowWidth / 2 + margin,
        this.p5_ctx.windowWidth / 2 - margin
      );
      let energy = this.p5_ctx.map(
        old_song.energy,
        0,
        1,
        this.p5_ctx.windowHeight / 2 - margin,
        -this.p5_ctx.windowHeight / 2 + margin
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

  drawTimeline(playing, colors, img_emoji) {
    this.p5_ctx.background(colors[0]);

    this.drawArrows(colors, img_emoji);
    this.p5_ctx.translate(0, 0, 1);

    let line_color = this.p5_ctx.color(
      colors[1][0],
      colors[1][1],
      colors[1][2],
      180
    );

    //this.decreaseAlpha();

    if (this.p5_ctx.frameCount % 20 === 0 && playing && colors) {
      // this.songs.forEach((song_circle, index) => {
      //   song_circle.mouseOver(colors[2]);
      // });

      if (this.current_song !== playing.id) {
        let valence = this.p5_ctx.map(
          playing.valence,
          0,
          1,
          -this.p5_ctx.windowWidth / 2 + 50,
          this.p5_ctx.windowWidth / 2 - 50
        );
        let energy = this.p5_ctx.map(
          playing.energy,
          0,
          1,
          this.p5_ctx.windowHeight / 2 - 50,
          -this.p5_ctx.windowHeight / 2 + 100
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
      this.p5_ctx.stroke(line_color);
      this.p5_ctx.strokeWeight(5);
      this.p5_ctx.fill(line_color);

      // if (i != this.songs.length - 1) {
      //   this.songs[i].size = this.size;
      //   this.p5_ctx.line(
      //     this.songs[i].pos.x,
      //     this.songs[i].pos.y,
      //     -1,
      //     this.songs[i + 1].pos.x,
      //     this.songs[i + 1].pos.y,
      //     -1
      //   );
      // }

      if (i === this.songs.length - 1) {
        this.songs[i].size += 0.085 * Math.sin(this.p5_ctx.frameCount * 0.015);
      } else {
        this.songs[i].size = this.size;
      }

      this.songs[i].drawSong();
    }
  }

  drawArrows(colors, img_emoji) {
    let arrow_color = this.p5_ctx.color(
      colors[2][0],
      colors[2][1],
      colors[2][2],
      this.alpha
    );
    this.p5_ctx.stroke(arrow_color);
    this.p5_ctx.strokeWeight(4);
    this.p5_ctx.fill(arrow_color);

    // vertical arrow

    let size_inv_x = 2.5;
    let size_inv_y = 3.5;
    let y_offset = 30;
    let half_vert_size = this.p5_ctx.windowHeight / size_inv_y;
    let half_hor_size = this.p5_ctx.windowWidth / size_inv_x;
    this.p5_ctx.line(
      0,
      -half_vert_size + y_offset,
      -2,
      0,
      +half_vert_size + y_offset,
      -2
    );

    // horizontal arrow
    this.p5_ctx.line(-half_hor_size, y_offset, -2, half_hor_size, y_offset, -2);

    this.p5_ctx.noStroke();
    this.p5_ctx.triangle(
      -8,
      -half_vert_size + y_offset + 1,
      8,
      -half_vert_size + y_offset + 1,
      0,
      -half_vert_size + y_offset - 15
    );

    this.p5_ctx.triangle(
      half_hor_size - 2,
      -8 + y_offset,
      half_hor_size - 2,
      8 + y_offset,
      half_hor_size + 15,
      0 + y_offset
    );

    let size_img = 40;
    this.p5_ctx.tint(255, this.alpha);
    this.p5_ctx.image(
      img_emoji[0],
      half_hor_size + 60,
      0 + y_offset,
      size_img,
      size_img
    );
    this.p5_ctx.image(
      img_emoji[1],
      0,
      -half_vert_size - 60 + y_offset,
      size_img,
      size_img
    );
    this.p5_ctx.image(
      img_emoji[2],
      -half_hor_size - 50,
      0 + y_offset,
      size_img,
      size_img
    );
    this.p5_ctx.image(
      img_emoji[3],
      0,
      half_vert_size + 40 + y_offset,
      size_img,
      size_img
    );
    this.p5_ctx.tint(255, 255);
  }

  // increaseAlpha() {
  //   if (this.alpha < 200) {
  //     this.alpha += 50;
  //   } else {
  //     this.alpha = 200;
  //   }
  // }
  // decreaseAlpha() {
  //   if (this.alpha > 0) {
  //     this.alpha -= 0.5;
  //   } else {
  //     this.alpha = 0;
  //   }
  // }
}

export default Timeline;
