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
    var cam;

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
      p.cursor("pointer");
      cam = p.createCamera();
      timeline = new Timeline(p);
    };

    p.draw = () => {
      p.orbitControl();
      p.frameRate(60);
      timeline.drawTimeline(
        this.props.song,
        this.props.valenceEnergy,
        this.props.history,
        this.props.colors,
        cam
      );
    };
  };

  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current);
  }

  //   componentWillUnmount() {
  //     this.myP5.remove();
  //   }

  render() {
    return <div ref={this.myRef}></div>;
  }
}

export default History;
