import React from "react";
import p5 from "p5";
import World from "./World";

class Visual extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.selected_song = "";
  }

  Sketch = (p) => {
    var world;

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
      // p.cursor("pointer");

      world = new World(p);
    };

    p.draw = () => {
      p.frameRate(60);
      world.drawWorld(
        this.props.song,
        this.props.recommendations,
        this.props.colors
      );
    };

    p.mouseClicked = () => {
      let selection = world.getMouseClicked();
      console.log(selection);
      if (selection) {
        this.props.setSelSong(selection);
      }
    };

    p.mouseDragged = () => {
      world.getMouseDragged();
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

export default Visual;
