import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import { DoubleSide } from 'three';

let StyledVisual = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`;

// COLOR PALETTE

let mainColor = new THREE.Color(Math.random(), Math.random(), Math.random());
mainColor = mainColor.getHSL(mainColor);
mainColor = mainColor.setHSL(mainColor.h, 0.7, 0.5);

let prevColor = mainColor.clone();
prevColor = prevColor.getHSL(prevColor);

// THREE COMPONENTS

let scene = new THREE.Scene();
{
    let color = '#000000';
    let density = 0.01;
    scene.fog = new THREE.FogExp2(color, density);
}
scene.background = new THREE.Color('#000000');



// functions to generate and update the starfield
function generateTrackObject() {
  
  var circle_geom = new THREE.CircleGeometry(30, 100);
  var circle_mat = new THREE.MeshBasicMaterial({color: 0xffffff, side: DoubleSide});
  var circle = new THREE.Mesh(circle_geom, circle_mat);
  return circle
}


const Visual = (props) => {
    let mount = useRef(null);

    // INITIALIZATION
    useEffect(() => {
        // THREE RENDERER

        let winWidth = mount.current.clientWidth;
        let winHeight = mount.current.clientHeight;

        let camera = new THREE.PerspectiveCamera();
        camera.position.set(0, 0, 0);
        let target = new THREE.Vector3(0, 0, 50);
        camera.lookAt(target);

        let renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(winWidth, winHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        let handleResize = () => {
            winWidth = mount.current.clientWidth;
            winHeight = mount.current.clientHeight;
            renderer.setSize(winWidth, winHeight);
            camera.aspect = winWidth / winHeight;
            camera.updateProjectionMatrix();
        };

        var trackObject = generateTrackObject();
        trackObject.position.set( 0, 0, 100 );
        let rotation = Math.PI
        trackObject.rotateX(rotation)
        scene.add(trackObject);


        // ANIMATE

        mount.current.appendChild(renderer.domElement);
        window.addEventListener('resize', handleResize);

        function animate() {
            camera.lookAt(target);
            rotation=0.01
            trackObject.rotateX(rotation)

            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    }, []); // never update, executed one time only

    return <StyledVisual className={props.className} ref={mount} />;
};

export default Visual;