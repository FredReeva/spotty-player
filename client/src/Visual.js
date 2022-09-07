import React from "react";
import p5 from "p5"

class Visual extends React.Component {
  // let size = 20;

  // const setup = (p5, canvasParentRef) => {
  //   p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL).parent(canvasParentRef);
  // };

  // const draw = (p5) => {
  //   p5.frameRate(props.tempo / 60);
  //   p5.background(props.colors[0]);

  //   // if (props.playbackState) {
  //   //   for (let i = 0; i < Math.ceil(p5.windowWidth / size); i++) {
  //   //     for (let j = 0; j < Math.ceil(p5.windowHeight / size); j++) {
  //   //       p5.fill(props.colors[Math.floor(Math.random() * 5)]);
  //   //       p5.noStroke();
  //   //       p5.square(size * i, size * j, size);
  //   //     }
  //   //   }
  //   // }

  //   //p5.noStroke();
    
  //   // if (props.image) {
  //   //   var image = 
      
      
  //   // }
  //   // const img  = p5.loadImage(props.image)
  //   // p5.texture(img);
  //   // p5.textureMode(p5.NORMAL);
  //   p5.circle(0, 0, 200)
    
  // };

  // const windowResized = (p5) => {
  //   p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  // };

  constructor(props) {
    super(props)
    this.myRef = React.createRef()
  }

  Sketch = (p) => {

      p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    }

    p.draw = () => {
      p.frameRate(60);
      
  
      // if (props.playbackState) {
      //   for (let i = 0; i < Math.ceil(p5.windowWidth / size); i++) {
      //     for (let j = 0; j < Math.ceil(p5.windowHeight / size); j++) {
      //       p5.fill(props.colors[Math.floor(Math.random() * 5)]);
      //       p5.noStroke();
      //       p5.square(size * i, size * j, size);
      //     }
      //   }
      // }
  
      p.noStroke();
      
      if (this.props.image && p.frameCount%100==0) {
        p.background(this.props.colors[0]);
        var img  = p.loadImage(this.props.image)

      }
      p.circle(0, 0, 200)
      if (this.props.image && p.frameCount%100==0) {
        p.texture(img)

      }
    }
 }


  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current)
  }

  render () {
    return (
      <div ref={this.myRef}>

      </div>
    )
  }
  ;
}

export default Visual