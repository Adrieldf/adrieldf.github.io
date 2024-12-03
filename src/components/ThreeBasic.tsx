"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const ThreeBasic: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight - 50); // Adjusting for layout side menu
    renderer.setPixelRatio(window.devicePixelRatio);

    // Scene and Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 6);

    // Stats
    const stats = new Stats();
    
    document.body.appendChild(stats.dom);

    // GUI
    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    gui.domElement.style.top = "10px";
    gui.domElement.style.right = "10px";

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 5, 0);
    scene.add(spotLight);

    // Rotating Cube
    const cubeGeometry = new THREE.BoxGeometry();
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);

    // Shader Material for Sphere
    const sphereGeometry = new THREE.SphereGeometry(0.75, 32, 32);
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vec3 color = vec3(0.5 + 0.5 * sin(uTime + vUv.x), 0.5 + 0.5 * cos(uTime + vUv.y), 1.0);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
    const sphere = new THREE.Mesh(sphereGeometry, shaderMaterial);
    sphere.position.set(2, 0, 0);
    scene.add(sphere);

    // Orbit Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    // Resize Handler
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight - 50; // Adjusting for layout side menu
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      // stats.begin();
      stats.update();
      const elapsedTime = clock.getElapsedTime();
      shaderMaterial.uniforms.uTime.value = elapsedTime;

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      controls.update();
      renderer.render(scene, camera);

      // stats.end();
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      gui.destroy();
      stats.dom.remove();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      ></canvas>
    </div>
  );
};

export default ThreeBasic;
