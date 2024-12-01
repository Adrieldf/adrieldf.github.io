'use client';

import * as THREE from 'three';


import { useEffect, useRef } from 'react';

const WebGPUScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const init = async () => {
      // Check WebGPU support
      // if (!navigator.gpu) {
      //   console.error('WebGPU not supported. Please use a compatible browser.');
      //   return;
      // }

      // Create the renderer
      const renderer = new THREE.WebGLRenderer({ /*canvas: canvasRef.current*/ });
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Set up the scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      // Add a rotating cube
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      // Add light
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(5, 5, 5).normalize();
      scene.add(light);

      // Render loop
      const animate = () => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      animate();

      // Handle resize
      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
      };
    };

    init();
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full"></canvas>;
};

export default WebGPUScene;
