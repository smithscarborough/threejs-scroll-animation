import './style.css'
import * as THREE from 'three';

// scene is the container
const scene = new THREE.Scene();

// three.js' 'perspective' camera to mimic what the human eye sees
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// the renderer actually renders the graphic to the scene
const renderer = new THREE.WebGLRenderer({
  // let the renderer know which DOM element to use
  canvas: document.querySelector('#bg'),
});

// use the instatiated renderer to set the pixel ratio to the window device ratio
renderer.setPixelRatio( window.devicePixelRatio );
// make the canvas fullscreen 
renderer.setSize( window.innerWidth, window.innerHeight );
// move the camera from middle of screen to along the z-axis
camera.position.setZ(30);

// render = draw
renderer.render( scene, camera );

// add object to screen:
// 1. Establish object's geometry, vectors to define its shape (note: three.js docs has other built-in shape options)
// torus = big 3D ring
const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
// 2. Establish object's material (i.e. wrapping paper) (note: three.js docs has other built-in material options)
// note: the MeshBasicMaterial requires no light source, whereas other ones do
const material = new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true} );
// 3. Establish the object's mesh (geometry + material), which is what will actually be rendered to the screen
const torus = new THREE.Mesh( geometry, material );
// render to screen
scene.add(torus)

// recursive function that gives an infinite loop, calling the render method automatically (to avoid having to call it manually each time)
const animate = () => {
  // game loop
  requestAnimationFrame( animate );
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  renderer.render( scene, camera ); 
}

animate();