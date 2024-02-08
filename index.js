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

const numTriangles = 100;
const maxSpeed = 0.01;
let maxX, maxY, maxZ, minX, minY, minZ;

function setMinMaxPositions() {
  maxX = (camera.aspect * camera.position.z) / 2;
  maxY = camera.position.z / 2;
  maxZ = 10;
  minX = -maxX;
  minY = -maxY;
  minZ = -10;
}
setMinMaxPositions();

// Create triangles
var triangles = [];

for (var i = 0; i < numTriangles; i++) {
  var geometry = new THREE.BufferGeometry();
  var vertices = new Float32Array([
    0,
    0,
    0,
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5,
  ]);
  geometry.addAttribute("position", new THREE.BufferAttribute(vertices, 3));
  var material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true,
  });
  var triangle = new THREE.Mesh(geometry, material);
  triangle.position.set(
    Math.random() * 20 - 10,
    Math.random() * 20 - 10,
    Math.random() * 20 - 10
  );
  triangle.velocity = new THREE.Vector3(
    Math.random() * maxSpeed - maxSpeed / 2,
    Math.random() * maxSpeed - maxSpeed / 2,
    Math.random() * maxSpeed - maxSpeed / 2
  );

  scene.add(triangle);
  triangles.push(triangle);
}

// Set camera position
camera.position.z = 5;

function getRandomRainbowColor() {
  // Generate a random hue value (between 0 and 360 degrees)
  var hue = Math.floor(Math.random() * 360);

  // Set saturation and lightness to create vibrant colors
  var saturation = 100;
  var lightness = 50;

  // Convert HSL to RGB
  var rgbColor = hslToRgb(hue / 360, saturation / 100, lightness / 100);

  // Convert RGB to hexadecimal
  var hexColor = rgbToHex(rgbColor[0], rgbColor[1], rgbColor[2]);

  return hexColor;
}

// Convert HSL to RGB
function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Convert RGB to hexadecimal
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

window.addEventListener("wheel", onMouseScroll);
function onMouseScroll(event) {
  // Increase or decrease the camera's distance from the center of the scene based on the scroll direction
  // const scrollSpeed = 0.001;
  // const delta = event.deltaY * scrollSpeed;
  // // Calculate the new camera position
  // const radius = camera.position.length();
  // const theta = Math.atan2(camera.position.y, camera.position.x);
  // const phi = Math.acos(camera.position.z / radius);
  // const newRadius = radius - delta;
  // const newTheta = theta;
  // const newPhi = Math.max(Math.min(phi + delta, Math.PI - 1), 1);
  // // Convert spherical coordinates back to Cartesian coordinates
  // camera.position.x = newRadius * Math.sin(newPhi) * Math.cos(newTheta);
  // camera.position.y = newRadius * Math.sin(newPhi) * Math.sin(newTheta);
  // camera.position.z = newRadius * Math.cos(newPhi);
  // // Update the camera's lookAt target to the center of the scene
  // camera.lookAt(scene.position);
  // Render the scene
  // renderer.render(scene, camera);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersects = [];
let isMouseOnTop = false;
// Add event listeners for mouse move and click events
window.addEventListener("mousemove", onMouseMove);

function onMouseMove(event) {
  //Calculate normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  renderer.render(scene, camera);
}
let frameCount = 0;
function animate() {
  requestAnimationFrame(animate);


  raycaster.setFromCamera(mouse, camera);
  if (frameCount % 10 === 0) {
    triangles.forEach((dot) => dot.material.color.set(0xffffff));
    intersects = raycaster.intersectObjects([...triangles]);

    intersects.forEach((intersect) => {
      const object = intersect.object;
      object.material.color.set(getRandomRainbowColor());
    });
  }
  // Rotate triangles
  triangles.forEach(function (triangle) {
    triangle.position.add(triangle.velocity);
    if (triangle.position.x < minX || triangle.position.x > maxX) {
      triangle.velocity.x *= -1;
    }
    if (triangle.position.y < minY || triangle.position.y > maxY) {
      triangle.velocity.y *= -1;
    }
    if (triangle.position.z < minZ || triangle.position.z > maxZ) {
      triangle.velocity.z *= -1;
    }

    triangle.rotation.x += 0.005;
    triangle.rotation.y += 0.005;
  });

  renderer.render(scene, camera);

  frameCount++;
  if (frameCount > 10000) {
    frameCount = 1;
  }
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
