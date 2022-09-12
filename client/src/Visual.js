import React from "react";
import p5 from "p5";
import World from "./components/World";

class Visual extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  Sketch = (p) => {
    var world;
    var font;

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
      
      world = new World(p);
    };

    p.draw = () => {
      p.frameRate(60);
      world.drawWorld(this.props.history, this.props.colors);
    };

    p.mouseClicked = () => {
      world.getMouseClick();
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
