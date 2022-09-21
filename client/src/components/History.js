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

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      // timeline.resizeCanvas(
      //   this.props.song,
      //   this.props.history,
      //   this.props.colors
      // );
    };

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
      timeline = new Timeline(p);
      if (this.props.history) {
        timeline.initTimeline(this.props.history);
      }
    };

    p.draw = () => {
      p.frameRate(60);

      timeline.drawTimeline(this.props.song, this.props.colors);
    };
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
