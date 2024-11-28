"use client";

import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Shader {
  name: string;
  filePath: string;
}

const shaders: Shader[] = [
  { name: "Simple", filePath: "/shaders/simple.glsl" },
  { name: "Mandelbrot", filePath: "/shaders/mandelbrot.glsl" },
  { name: "Seascape", filePath: "/shaders/seascape.glsl" },
  { name: "Starfield", filePath: "/shaders/starfield.glsl" },
  // Add more shaders as needed
];

export default function ShaderToyCanvas() {
  const [selectedShader, setSelectedShader] = useState<Shader>(shaders[1]);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadShader = async (filePath: string) => {
      const response = await fetch(filePath);
      const shaderCode = await response.text();
      return shaderCode;
    };

    const initShader = async () => {
      const shaderCode = await loadShader(selectedShader.filePath);
      createShaderScene(shaderCode);
    };

    const createShaderScene = (shaderCode: string) => {
      if (!canvasRef.current) return;

      // Setup Three.js scene, camera, and renderer
      const renderer = new THREE.WebGLRenderer();
      const width = canvasRef.current.offsetWidth;
      const height = canvasRef.current.offsetHeight;

      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      canvasRef.current.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;

      // Create a shader material using the selected shader code
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
        const newWidth = canvasRef.current?.offsetWidth || width;
        const newHeight = canvasRef.current?.offsetHeight || height;

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
  }, [selectedShader]);

  return (
    <div ref={canvasRef} className="w-full h-full">
      <div className="absolute top-4 left-4 z-10">
        <Select
          onValueChange={(e) => {
            console.log(e);
            setSelectedShader(shaders.find((shader) => shader.name === e)!);
          }}
          value={selectedShader.name}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {shaders.map((shader) => (
              <SelectItem key={shader.name} value={shader.name}>
                {shader.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
