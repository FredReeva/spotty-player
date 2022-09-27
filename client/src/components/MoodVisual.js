import React from "react";
import p5 from "p5";
import MoodPlane from "./MoodPlane";

class MoodVisual extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.selected_song = "";
    this.margin = 100;
  }

  Sketch = (p) => {
    var mood_plane;
    var img_emoji;
    var font;

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      if (mood_plane) {
        mood_plane.updateDimensions();
      }
    };

    p.preload = () => {
      let happy = p.loadImage("assets/happy.png");
      let sad = p.loadImage("assets/sad.png");
      let energy = p.loadImage("assets/energy.png");
      let calm = p.loadImage("assets/zzz.png");
      font = p.loadFont("assets/SourceSansPro-Black.ttf");

      img_emoji = [happy, energy, sad, calm];
    };

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
      p.windowResized();
      p.imageMode(p.CENTER);
      p.textFont(font);
      p.textSize(12);
      mood_plane = new MoodPlane(p, this.margin);
      if (this.props.history) {
        mood_plane.initMoodPlane(this.props.history);
      }
    };

    p.draw = () => {
      p.frameRate(60);

      mood_plane.drawMoodPlane(this.props.song, this.props.colors, img_emoji);
    };

    p.mouseClicked = () => {
      let valence_plane = p.constrain(
        p.mouseX,
        this.margin,
        p.windowWidth - this.margin
      );
      let energy_plane = p.constrain(
        p.mouseY,
        this.margin,
        p.windowHeight - this.margin
      );
      let valence = p.map(
        valence_plane,
        this.margin,
        p.windowWidth - this.margin,
        0,
        1
      );
      let energy = p.map(
        energy_plane,
        this.margin,
        p.windowHeight - this.margin,
        1,
        0
      );
      this.props.setSelHistSong([valence, energy]);
    };

    // p.mouseMoved = () => {
    //   timeline.increaseAlpha();
    // };
  };

  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current);
  }

  componentWillUnmount() {
    this.myP5.remove();
  }

  render() {
    return <div ref={this.myRef}></div>;
  }
}

export default MoodVisual;
