import React from "react";
import p5 from "p5";
import World from "./GlobesWorld";

class GlobesVisual extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.selected_song = "";
  }

  // p5 sketch
  Sketch = (p) => {
    var world;
    var font;

    p.preload = () => {
      font = p.loadFont("assets/SourceSansPro-Black.ttf");
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
      p.textFont(font);
      p.textSize(12);

      world = new World(p);
    };

    p.draw = () => {
      p.frameRate(60);
      world.drawWorld(
        this.props.song,
        this.props.history,
        this.props.recommendations,
        this.props.colors
      );
    };

    p.mouseClicked = () => {
      let selection = world.getMouseClicked();
      if (selection) {
        this.props.setSelSong(selection);
      }
    };

    // dragging objects (disabled)
    // p.mouseDragged = () => {
    //   world.getMouseDragged();
    // };
  };

  // create sketch when coimponent mounts
  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current);
  }

  // delete sketch when component unmounts
  componentWillUnmount() {
    this.myP5.remove();
  }

  render() {
    return <div ref={this.myRef}></div>;
  }
}

export default GlobesVisual;
