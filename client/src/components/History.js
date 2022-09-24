import React from "react";
import p5 from "p5";
import Timeline from "./Timeline";

class History extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.selected_song = "";
  }

  Sketch = (p) => {
    var timeline;
    var img_emoji;

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      // timeline.resizeCanvas(
      //   this.props.song,
      //   this.props.history,
      //   this.props.colors
      // );
    };

    p.preload = () => {
      let happy = p.loadImage("assets/happy.png");
      let sad = p.loadImage("assets/sad.png");
      let energy = p.loadImage("assets/energy.png");
      let calm = p.loadImage("assets/calm.png");

      img_emoji = [happy, energy, sad, calm];
    };

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
      p.imageMode(p.CENTER);
      timeline = new Timeline(p);
      if (this.props.history) {
        timeline.initTimeline(this.props.history);
      }
    };

    p.draw = () => {
      p.frameRate(60);

      timeline.drawTimeline(this.props.song, this.props.colors, img_emoji);
    };

    p.mouseClicked = () => {
      this.props.setSelHistSong([
        p.mouseX / p.windowWidth,
        (p.windowHeight - p.mouseY) / p.windowHeight,
      ]);
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
