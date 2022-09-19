import Song from "./SongObj";

class Song3d extends Song {
  constructor(curr_playing, draw_context, position, size) {
    super(curr_playing, draw_context, position, size);
  }

  drawSong() {

    
    this.draw_context.translate(this.pos);
    this.setShadow();

    if (this.img) {
      //this.draw_context.textureMode(this.draw_context.NORMAL);
    }
    this.draw_context.ambientLight(60, 60, 60);
    this.draw_context.pointLight(255, 255, 255, 0, 0, 0);

    this.draw_context.fill(
      this.shadow_color[0],
      this.shadow_color[1],
      this.shadow_color[2],
      this.border_alpha
    );

    //this.draw_context.ambientMaterial(255);
    this.draw_context.texture(this.img);
    this.draw_context.sphere(this.size);

    // this.draw_context.circle(this.pos.x, this.pos.y, this.size - 10);
  }
}

export default Song3d;
