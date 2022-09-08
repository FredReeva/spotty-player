import React from "react";
import p5 from "p5";
import Song from "./components/SongObj";

class Visual extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.song = this.props.song;
  }

  Sketch = (p) => {
    var current_song;
    var song = [];

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
      current_song = "";
      for (let i = 0; i < 10; i++) {
        song[i] = new Song(
          p,
          [500 * Math.random() - 250, 500 * Math.random() - 250],
          200 * Math.random()
        );
      }
    };

    p.draw = () => {
      p.frameRate(60);

      if (p.frameCount % 10 == 0) {
        p.background(this.props.colors[0]);
        if (current_song != this.props.song.id) {
          // here song has changed

          for (let i = 0; i < 10; i++) {
            song[i].loadImage(this.props.song);
          }

          current_song = this.props.song.id;
        }

        for (let i = 0; i < 10; i++) {
          song[i].drawSong();
        }
      }

      p.noStroke();

      if (p.frameCount % 100 == 0) {
      }

      if (p.frameCount % 480 == 0) {
        // execute every 120 frames (2 seconds)
      }
    };

    p.mouseClicked = () => {
      for (let i = 0; i < 10; i++) {
        song[i].clicked();
      }
    };
  };

  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current);
  }

  render() {
    return <div ref={this.myRef}></div>;
  }
}

export default Visual;
