import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//AXES Helper
const axesHelper = new THREE.AxesHelper(5);
axesHelper.scale.set(2, 2, 2);
scene.add(axesHelper);
/**
 * House
 */
// FLOOR
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({})
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

//*****HOUSE container
const houseGroup = new THREE.Group();
scene.add(houseGroup);

// WALLS
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial()
);
walls.position.y += 1.25;
houseGroup.add(walls);

//ROOF
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial()
);
roof.position.y = 2.5 + 0.75;
roof.rotation.y = Math.PI * 0.25;
houseGroup.add(roof);

//DOOR
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2),
  new THREE.MeshStandardMaterial({ color: "red" })
);
door.position.set(0, 1.1, 2.01);
houseGroup.add(door);

//BUSHES
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "green" });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
houseGroup.add(bush1, bush2, bush3, bush4);

//GRAVES
const graveGroup = new THREE.Group();
scene.add(graveGroup);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "brown" });

//Array di graveStones
let gravesArr = [];

//Protezione contro infinte loop
let protection = 0;

while (gravesArr.length < 30) {
  //trovare angoli randomizzati
  const angle = Math.random() * Math.PI * 2;
  //trovare numeri random tra 3 e 7
  const radius = 3 + Math.random() * 4;
  //creare un oggetto per la posizione dei gravestones che poi andranno salvati dentro gravesArr
  let graveStonePos = {
    //trovare angoli random seno
    x: Math.sin(angle) * radius,
    //trovare angoli random coseno
    z: Math.cos(angle) * radius,
    //raggio di 0.7, usato nella condizione della distaza nel ciclo j
    r: 0.6,
  };

  //Assumiamo che i graveStone non si collidono
  let overlapping = false;
  //Posizione corrente del graveStone
  const v1 = new THREE.Vector3(graveStonePos.x, 0, graveStonePos.z);
  //Ciclo di controllo per evitare collisioni
  for (let j = 0; j < gravesArr.length; j++) {
    //altri gravestones
    let other = gravesArr[j];
    //posizione degli altri gravestons
    const v2 = new THREE.Vector3(other.x, 0, other.z);
    //la distanza tra il graveStone corrente con gli altri
    const distance = v1.distanceTo(v2);
    //Condizione controllo distanza tra due graveStone
    if (distance < graveStonePos.r + other.r) {
      overlapping = true;
      break;
    }
  }
  //Se non overlapping push
  if (!overlapping) {
    gravesArr.push(graveStonePos);
  }
  protection += 1;
  
  if (protection == 100) {
    console.log("Siamo arrivati al limite");
    break;
  }
} 

for (let i = 0; i < gravesArr.length; i++) {
  const graveMesh = new THREE.Mesh(graveGeometry, graveMaterial);
  graveMesh.position.set(gravesArr[i].x, Math.random() * 0.4, gravesArr[i].z);
  //rotazione leggero random
  graveMesh.rotation.set(
    (Math.random() - 0.5) * 0.4,
    (Math.random() - 0.5) * 0.4,
    (Math.random() - 0.5) * 0.4
  );
  graveGroup.add(graveMesh);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#ffffff", 1.5);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
