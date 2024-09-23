import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import { Sky } from "three/examples/jsm/Addons.js";
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

/**************************************************************
 * TEXTURES
 */
const textureLoader = new THREE.TextureLoader();

//******************Floor Texture
const floorAlphaTexture = textureLoader.load("/resources/floor/alpha.jpg");
const floorColorTexture = textureLoader.load(
  "/resources/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg"
);
//armtexture copre aoMap, roughnessMap e metlnessMap
const floorArmTexture = textureLoader.load(
  "/resources/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg"
);
const floorNormalTexture = textureLoader.load(
  "/resources/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg"
);
//DisplacementTexture muove i vertici quindi necessità più vertici (ma non troppi) sul geometry per poter applicare meglio
const floorDisplacementTexture = textureLoader.load(
  "/resources/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg"
);
//solo per color texture necessità SRGBCloroSpace
floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorColorTexture.repeat.set(8, 8);
floorArmTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;

floorArmTexture.wrapS = THREE.RepeatWrapping;
floorArmTexture.wrapT = THREE.RepeatWrapping;

floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;

floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

//******************Wall Texture
const wallColorTexture = textureLoader.load(
  "/resources/wall/castle_brick_broken_06_diff_1k.jpg"
);
//armtexture copre aoMap, roughnessMap e metlnessMap
const wallArmTexture = textureLoader.load(
  "/resources/wall/castle_brick_broken_06_arm_1k.jpg"
);
const wallNormalTexture = textureLoader.load(
  "/resources/wall/castle_brick_broken_06_nor_gl_1k.jpg"
);
//solo per color texture necessità SRGBCloroSpace
wallColorTexture.colorSpace = THREE.SRGBColorSpace;

//******************Roof Texture
const roofColorTexture = textureLoader.load(
  "/resources/roof/roof_slates_02_diff_1k.jpg"
);
//armtexture copre aoMap, roughnessMap e metlnessMap
const roofArmTexture = textureLoader.load(
  "/resources/roof/roof_slates_02_arm_1k.jpg"
);
const roofNormalTexture = textureLoader.load(
  "/resources/roof/roof_slates_02_nor_gl_1k.jpg"
);
//solo per color texture necessità SRGBCloroSpace
roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofColorTexture.repeat.set(3, 1);
roofArmTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofArmTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;

//******************Roof Texture
const bushColorTexture = textureLoader.load(
  "/resources/bush/leaves_forest_ground_diff_1k.jpg"
);
//armtexture copre aoMap, roughnessMap e metlnessMap
const bushArmTexture = textureLoader.load(
  "/resources/bush/leaves_forest_ground_arm_1k.jpg"
);
const bushNormalTexture = textureLoader.load(
  "/resources/bush/leaves_forest_ground_nor_gl_1k.jpg"
);
//solo per color texture necessità SRGBCloroSpace
bushColorTexture.colorSpace = THREE.SRGBColorSpace;

//******************Grave stones Texture
const graveColorTexture = textureLoader.load(
  "/resources/grave/plastered_stone_wall_diff_1k.jpg"
);
//armtexture copre aoMap, roughnessMap e metlnessMap
const graveArmTexture = textureLoader.load(
  "/resources/grave/plastered_stone_wall_arm_1k.jpg"
);
const graveNormalTexture = textureLoader.load(
  "/resources/grave/plastered_stone_wall_nor_gl_1k.jpg"
);
//solo per color texture necessità SRGBCloroSpace
graveColorTexture.colorSpace = THREE.SRGBColorSpace;

//******************Door stones Texture
const doorColorTexture = textureLoader.load("/resources/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/resources/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/resources/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/resources/door/height.jpg");
const doorNormalTexture = textureLoader.load("/resources/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load(
  "/resources/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "/resources/door/roughness.jpg"
);

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
//solo per color texture necessità SRGBCloroSpace
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
/*****************************************************************
 * All Geometries
 */
//*******FLOOR
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100), //aggiungere 100 vertici
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
    aoMap: floorArmTexture,
    roughnessMap: floorArmTexture,
    metalnessMap: floorArmTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.375, //abbassare la scala dei vertici del displacement
    displacementBias: -0.182, //offset dei vertici (alzzare o abbassare mesh sui suoi vertci)
  })
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

gui
  .add(floor.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.001)
  .name("floorDisplacementScale");
gui
  .add(floor.material, "displacementBias")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("floorDisplacementBias");

//*****HOUSE container
const houseGroup = new THREE.Group();
scene.add(houseGroup);

// WALLS
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallArmTexture,
    roughnessMap: wallArmTexture,
    metalnessMap: wallArmTexture,
    normalMap: wallNormalTexture,
  })
);
walls.position.y += 1.25;
houseGroup.add(walls);

//ROOF
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofArmTexture,
    roughnessMap: roofArmTexture,
    metalnessMap: roofArmTexture,
    normalMap: roofNormalTexture,
  })
);
roof.position.y = 2.5 + 0.75;
roof.rotation.y = Math.PI * 0.25;
houseGroup.add(roof);

//DOOR
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.position.set(0, 1.1, 2.01);
houseGroup.add(door);

//BUSHES
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#ccffcc",
  map: bushColorTexture,
  aoMap: bushArmTexture,
  roughnessMap: bushArmTexture,
  metalnessMap: bushArmTexture,
  normalMap: bushNormalTexture,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = -0.75; //texture sul sphere geo, nei poli ci sono dei problemi quindi qualche volta basta girare per nascondere i poli.

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
houseGroup.add(bush1, bush2, bush3, bush4);
bush4.rotation.x = -0.75;

//GRAVES
const graveGroup = new THREE.Group();
scene.add(graveGroup);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveArmTexture,
  roughnessMap: graveArmTexture,
  metalnessMap: graveArmTexture,
  normalMap: graveNormalTexture,
});

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
/******************************************************************
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

//Door Light
const doorLight = new THREE.PointLight(0xff7d46, 1);
doorLight.position.set(0, 2.2, 2.5);
scene.add(doorLight);

// const sphereSize = 0.5;
// const pointLightHelper = new THREE.PointLightHelper(doorLight, sphereSize);
// scene.add(pointLightHelper);

/****************************
 * Ghosts
 */
const ghost1 = new THREE.PointLight(0x8800ff, 6);
const ghost2 = new THREE.PointLight(0xff0088, 6);
const ghost3 = new THREE.PointLight(0xff0000, 6);
scene.add(ghost1, ghost2, ghost3);
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

/********************************************************************
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

/**************************************************************
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/***************************************************************
 * Shadows "attenzione: non attivare shadow dove non ha un impatto per il performance"
 */
//Renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

//Cast and recive
directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;

roof.castShadow = true;
floor.receiveShadow = true;

for (const grave of graveGroup.children) {
  grave.castShadow = true;
  grave.receiveShadow = true;
}

//Mapping
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.left = 500;

ghost1.shadow.mapSize.height = 256;
ghost1.shadow.mapSize.width = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.height = 256;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.height = 256;
ghost3.shadow.mapSize.width = 256;
ghost3.shadow.camera.far = 10;

/**
 * SKY
 */
//creare un sky, sky è un cubo, sky è un addons di three.js che viene importato
const sky = new Sky();
//scalare sky grande cosi i nostri geometri vanno dentro questo cubo
sky.scale.set(100, 100, 100);
scene.add(sky);

sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

/************************************************************
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  //Animate Ghosts
  const ghostAngle = elapsedTime * 0.5;
  ghostAnimation(ghostAngle, 6, 4, 5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

function ghostAnimation(angle, x, y, z) {
  ghost1.position.x = Math.cos(angle) * x;
  ghost1.position.z = Math.sin(angle) * x;
  ghost1.position.y =
    Math.sin(angle * 2.34) * Math.sin(angle * 3.45) * Math.sin(angle * 2.25);

  ghost2.position.x = -Math.cos(angle) * y;
  ghost2.position.z = Math.sin(angle) * y;
  ghost2.position.y =
    Math.sin(angle * 1.3) * Math.sin(angle * 2.4) * Math.sin(angle * 3.2);

  ghost3.position.x = Math.cos(angle) * z;
  ghost3.position.z = -Math.sin(angle) * z;
  ghost3.position.y =
    Math.sin(angle * 3.1) * Math.sin(angle * 1.4) * Math.sin(angle * 2.1);
}
