import React from "react";
import p5 from "p5";
import World from "./components/World";

class Visual extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.selected_song = "";
  }

  Sketch = (p) => {
    var world;
    var cam;

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
      p.cursor("pointer");
      cam = p.createCamera();
      world = new World(p);
    };

    p.draw = () => {
      p.frameRate(60);
      world.drawWorld(
        this.props.song,
        this.props.recommendations,
        this.props.colors,
        cam
      );
    };

    p.mouseClicked = () => {
      let selection = world.getMouseClicked();
      if (selection) {
        this.selected_song = selection;
      }
    };

    p.mousePressed = () => {
      world.getMousePressed();
    };

    p.mouseReleased = () => {
      world.getMouseReleased();
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
