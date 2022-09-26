import React from "react";
import p5 from "p5";
import Timeline from "./Timeline";

class History extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.selected_song = "";
    this.margin = 100;
  }

  Sketch = (p) => {
    var timeline;
    var img_emoji;

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.preload = () => {
      let happy = p.loadImage("assets/happy.png");
      let sad = p.loadImage("assets/sad.png");
      let energy = p.loadImage("assets/energy.png");
      let calm = p.loadImage("assets/zzz.png");

      img_emoji = [happy, energy, sad, calm];
    };

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
      p.imageMode(p.CENTER);
      timeline = new Timeline(p);
      if (this.props.history) {
        timeline.initTimeline(this.props.history, this.margin);
      }
    };

    p.draw = () => {
      p.frameRate(60);

      timeline.drawTimeline(this.props.song, this.props.colors, img_emoji);
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

export default History;
