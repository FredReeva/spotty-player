import Song from "./SongObj";

class World {
  constructor(p5_ctx) {
    this.p5_ctx = p5_ctx;
    this.songs = [];
    this.n_songs = 50;
    this.current_song = "";
    this.main_size = 200;
    this.sizes = [80, 50, 20];
    this.pos_playing = this.p5_ctx.createVector(0, 0);
    this.songs[0] = new Song(
      this.p5_ctx,
      this.pos_playing,
      this.main_size,
      true
    );

    for (let i = 1; i < this.n_songs; i++) {
      this.songs[i] = new Song(
        this.p5_ctx,
        this.p5_ctx.createVector(
          500 * Math.random() - 250,
          500 * Math.random() - 250
        ),
        this.sizes[Math.floor(Math.random() * this.sizes.length)]
      );
    }
  }

  drawWorld(playing, colors) {
    if (this.p5_ctx.frameCount % 30 === 0 && playing && colors) {
      this.p5_ctx.background(colors[0]);

      if (this.current_song !== playing.id) {
        // here song has changed
        this.songs[0].loadImage(playing);

        for (let i = 1; i < this.n_songs; i++) {
          this.songs[i].loadImage(playing);
        }

        this.current_song = playing.id;
      }
    }

    this.p5_ctx.background(colors[0]);
    this.songs[0].drawSong();

    for (let i = 1; i < this.n_songs; i++) {
      let force = this.computeGravityForce(this.songs[i]);
      this.songs[i].applyForce(force);
      this.songs[i].moveSong();
      this.songs[i].drawSong();
    }

    this.p5_ctx.noStroke();
  }

  getMouseClick() {
    for (let i = 1; i < this.n_songs; i++) {
      this.songs[i].songClick();
    }
  }

  computeGravityForce(song) {
    let attr_force = this.pos_playing.copy();
    attr_force.sub(song.pos);
    let dist = attr_force.mag();
    dist = this.p5_ctx.constrain(dist, 5, 20);

    attr_force.normalize();
    let mult = (song.size * this.main_size) / dist;
    attr_force.mult(mult);
    return attr_force;
  }
}

export default World;
