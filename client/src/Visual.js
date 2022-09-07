// import React from "react";
// import Sketch from "react-p5";

// export default function Visual(props) {
//   let size = 20;

//   const setup = (p5, canvasParentRef) => {
//     p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
//   };

//   const draw = (p5) => {
//     p5.frameRate(props.tempo / 60);
//     p5.background(props.colors[0]);

//     if (props.playbackState) {
//       for (let i = 0; i < Math.ceil(p5.windowWidth / size); i++) {
//         for (let j = 0; j < Math.ceil(p5.windowHeight / size); j++) {
//           p5.fill(props.colors[Math.floor(Math.random() * 5)]);
//           p5.noStroke();
//           p5.square(size * i, size * j, size);
//         }
//       }
//     }
//   };

//   const windowResized = (p5) => {
//     p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
//   };

//   return (
//     <div>
//       <Sketch setup={setup} draw={draw} windowResized={windowResized} />
//     </div>
//   );
// }

import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function SpinningMesh(props) {
  const mesh = useRef(null);
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));
  return (
     <mesh position={props.position} ref={mesh}>
        <boxBufferGeometry attach='geometry' args={[1, 1, 1]} />
        <meshStandardMaterial attach='material' color={"white"} />
     </mesh>
  );
}

export default function Visual(props) {

  return (
    <Canvas colorManagement camera={{position: [10,0,0], fov:60}}>
      <ambientLight intensity={0.3}/>
         <SpinningMesh position={[0,0,0]}/>
         <SpinningMesh position={[-2,1,-5]}/>
         <SpinningMesh position={[5,1,-2]}/>
    </Canvas>

  )
}