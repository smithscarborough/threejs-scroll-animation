import './style.css'
import * as THREE from 'three';
// OrbitControls to allow movement around the scene using mouse
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
const material = new THREE.MeshStandardMaterial( {color: 0xFF6347, wireframe: false} );
// 3. Establish the object's mesh (geometry + material), which is what will actually be rendered to the screen
const torus = new THREE.Mesh( geometry, material );
// render to screen
scene.add(torus);


// note: three.js docs has other lighting options to choose from
const pointLight = new THREE.PointLight(0xfffffff);
// position the light away from the center, w/ the following x, y, z values:
pointLight.position.set(5, 5, 5);
// ambient light to add lighting across the entire scene (think: floodlight)
const ambientLight = new THREE.AmbientLight(0xffffff);
// Add light to scene:
scene.add(pointLight, ambientLight);

// lightHelper shows the position of a pointLight
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

const addStar = () => {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh( geometry, material );

  // randomly position stars on screen:
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100) );
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// load space image to scene:
const spaceTexture = new THREE.TextureLoader().load('./stars.jpeg');
scene.background = spaceTexture;

// Moon
const moonTexture = new THREE.TextureLoader().load('./moon.jpeg');
const normalTexture = new THREE.TextureLoader().load('./normal.jpeg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture, 
    normalMap: normalTexture
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

const moveCamera = () => {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  // can play around with these numbers to fine tune the animation to preference 
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera

// recursive function that gives an infinite loop, calling the render method automatically (to avoid having to call it manually each time)
const animate = () => {
  // game loop
  requestAnimationFrame( animate );
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update(); // to make sure changes made w/ OrbitControls are reflected in the UI

  renderer.render( scene, camera ); 
}

animate();