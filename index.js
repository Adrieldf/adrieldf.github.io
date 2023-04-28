import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
); // fov / aspect ratio / view frustum (near, far)

let renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

let geometry = new THREE.TorusGeometry(10, 3, 16, 100);
let material = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
let torus = new THREE.Mesh(geometry, material);
scene.add(torus);

let ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.position.set(20, 20, 20);
scene.add(ambientLight);

//let gridHelper = new THREE.GridHelper(200, 50);
//scene.add(gridHelper);

//let controls = new THREE.OrbitControls(camera, renderer.domElement);

function addStar() {
  let geometry = new THREE.SphereGeometry(0.25, 24, 24);
  let material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  let star = new THREE.Mesh(geometry, material);

  let [x, y, z] = Array(3)
    .fill(0)
    .map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill(0).forEach(addStar);

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.y += 0.01;

  //controls.update();
  renderer.render(scene, camera);
}
animate();


// Add smooth scrolling to all links
$("a").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
        window.location.hash = hash;
      });
    }
  });
  