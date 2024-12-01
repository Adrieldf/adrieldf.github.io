"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadShader = async (filePath: string) => {
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Shader file not found: ${filePath}`);
        }
        return await response.text();
      } catch (error) {
        console.error(error);
        return "";
      }
    };

    const initShader = async () => {
      const shaderCode = await loadShader("/shaders/nomanssky.glsl");
      if (!shaderCode || !mountRef.current) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      const width = window.innerWidth;
      const height = window.innerHeight;

      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      mountRef.current.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;

      const material = new THREE.ShaderMaterial({
        fragmentShader: shaderCode,
        uniforms: {
          iResolution: { value: new THREE.Vector3(width, height, 1) },
          iTime: { value: 0 },
        },
      });

      const plane = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(plane, material);
      scene.add(mesh);

      // Handle resizing
      const handleResize = () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        renderer.setSize(newWidth, newHeight);
        material.uniforms.iResolution.value.set(newWidth, newHeight, 1);
      };

      window.addEventListener("resize", handleResize);

      // Animation loop
      const clock = new THREE.Clock();
      const animate = () => {
        material.uniforms.iTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      animate();

      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
      };
    };
    initShader();
  }, []);

  return <div ref={mountRef} className="absolute w-full h-full top-0 left-0" />;
};

export default ThreeBackground;
