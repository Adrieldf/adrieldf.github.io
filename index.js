import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
); // fov / aspect ratio / view frustum (near, far)

let renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// camera.position.setZ(30);
camera.position.set(0, 0, 5);
camera.lookAt(scene.position);

const numDots = 50;
const numLines = 20;
const dotSize = 0.1;
const maxSpeed = 0.01;
let maxX, maxY, maxZ, minX, minY, minZ;
const lineColor = 0xffffff;
const dotColor = 0xffffff;
const segments = 16;
const dots = [];
const lines = [];

function setMinMaxPositions() {
  maxX = camera.aspect * camera.position.z / 2;
  maxY = camera.position.z / 2;
  maxZ = 10;
  minX = -maxX;
  minY = -maxY;
  minZ = -10;
}
setMinMaxPositions();

for (let i = 0; i < numDots; i++) {
  const dotGeometry = new THREE.SphereGeometry(dotSize, 8, 8);
  const dotMaterial = new THREE.MeshBasicMaterial({ color: dotColor });
  const dot = new THREE.Mesh(dotGeometry, dotMaterial);

  // Set initial position and velocity
  const xPos = Math.random() * (maxX - minX) + minX;
  const yPos = Math.random() * (maxY - minY) + minY;
  const zPos = Math.random() * (maxZ - minZ) + minZ;
  dot.position.set(xPos, yPos, zPos);
  dot.velocity = new THREE.Vector3(Math.random() * maxSpeed - maxSpeed / 2, Math.random() * maxSpeed - maxSpeed / 2, Math.random() * maxSpeed - maxSpeed / 2);

  dots.push(dot);
  scene.add(dot);
}

// Create lines
for (let i = 0; i < numLines; i++) {
  const lineGeometry = new THREE.BufferGeometry();
  const lineMaterial = new THREE.LineBasicMaterial({ color: lineColor, linewidth: 1 });
  const linePositions = new Float32Array(numDots * 3);

  // Set initial line positions based on dot positions
  for (let j = 0; j < numLines; j++) {
    linePositions[j * 3] = dots[j].position.x;
    linePositions[j * 3 + 1] = dots[j].position.y;
    linePositions[j * 3 + 2] = dots[j].position.z;
  }

  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const line = new THREE.Line(lineGeometry, lineMaterial);

  lines.push(line);
  scene.add(line);
}

window.addEventListener('wheel', onMouseScroll);
function onMouseScroll(event) {
  // Increase or decrease the camera's distance from the center of the scene based on the scroll direction
  const scrollSpeed = 0.001;
  const delta = event.deltaY * scrollSpeed;

  // Calculate the new camera position
  const radius = camera.position.length();
  const theta = Math.atan2(camera.position.y, camera.position.x);
  const phi = Math.acos(camera.position.z / radius);

  const newRadius = radius - delta;
  const newTheta = theta;
  const newPhi = Math.max(Math.min(phi + delta, Math.PI - 0.1), 0.1);

  // Convert spherical coordinates back to Cartesian coordinates
  camera.position.x = newRadius * Math.sin(newPhi) * Math.cos(newTheta);
  camera.position.y = newRadius * Math.sin(newPhi) * Math.sin(newTheta);
  camera.position.z = newRadius * Math.cos(newPhi);

  // Update the camera's lookAt target to the center of the scene
  camera.lookAt(scene.position);

  // Render the scene
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);

  // torus.rotation.y += 0.01;
  dots.forEach((dot) => {
    dot.position.add(dot.velocity);

    // Check boundaries and apply bouncing effect
    if (dot.position.x < minX || dot.position.x > maxX) {
      dot.velocity.x *= -1;
    }
    if (dot.position.y < minY || dot.position.y > maxY) {
      dot.velocity.y *= -1;
    }
    if (dot.position.z < minZ || dot.position.z > maxZ) {
      dot.velocity.z *= -1;
    }
  });

  // Update line positions based on dot positions
  lines.forEach((line) => {
    const positions = line.geometry.attributes.position.array;
    for (let i = 0; i < numDots; i++) {
      positions[i * 3] = dots[i].position.x;
      positions[i * 3 + 1] = dots[i].position.y;
      positions[i * 3 + 2] = dots[i].position.z;
    }
    line.geometry.attributes.position.needsUpdate = true;
  });

  //controls.update();
  renderer.render(scene, camera);
}
animate();

// Add smooth scrolling to all links
$("a").on("click", function (event) {
  if (this.hash !== "") {
    event.preventDefault();
    var hash = this.hash;
    $("html, body").animate(
      {
        scrollTop: $(hash).offset().top,
      },
      800,
      function () {
        window.location.hash = hash;
      }
    );
  }
});
