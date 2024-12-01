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
  { name: "No Man's Sky Galaxy", filePath: "/shaders/nomanssky.glsl" },
];

export default function ShaderToyCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [currentShader, setCurrentShader] = useState<Shader>(shaders[0]);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.Camera | null>(null);
  //const [material, setMaterial] = useState<THREE.ShaderMaterial | null>(null);

  const loadShader = async (shader: Shader) => {
    try {
      const response = await fetch(shader.filePath);
      if (!response.ok) {
        throw new Error(`Shader file not found: ${shader.name}`);
      }
      return await response.text();
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  const cleanUpRenderer = () => {
    if (renderer) {
      renderer.dispose();
    }

    if (canvasRef.current) {
      while (canvasRef.current.firstChild) {
        canvasRef.current.removeChild(canvasRef.current.firstChild); // Remove all children
      }
    }
  };

  useEffect(() => {
    const initThree = async () => {
      if (!canvasRef.current) return;

      cleanUpRenderer();
      const width = window.innerWidth;
      const height = window.innerHeight;

      const rendererInstance = new THREE.WebGLRenderer({ antialias: true });
      rendererInstance.setSize(width, height);
      rendererInstance.setPixelRatio(window.devicePixelRatio);
      canvasRef.current.appendChild(rendererInstance.domElement);
      setRenderer(rendererInstance);

      const sceneInstance = new THREE.Scene();
      setScene(sceneInstance);

      const cameraInstance = new THREE.OrthographicCamera(
        -1,
        1,
        1,
        -1,
        0.1,
        10
      );
      cameraInstance.position.z = 1;
      setCamera(cameraInstance);

      const shaderCode = await loadShader(currentShader);

      const gl = rendererInstance.getContext();
      const fragmentShader = shaderCode;
      
      // Create shader object
      const shader = gl.createShader(gl.FRAGMENT_SHADER);
      if (!shader) throw new Error("Failed to create shader object");
      
      gl.shaderSource(shader, fragmentShader);
      gl.compileShader(shader);
      
      // Check if shader compiled successfully
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        console.error("Shader compile error:", info);
        console.error("Shader code:", fragmentShader);
        throw new Error("Shader compile failed");
      }

      const materialInstance = new THREE.ShaderMaterial({
        fragmentShader: shaderCode,
        uniforms: {
          iResolution: { value: new THREE.Vector3(width, height, 1) },
          iTime: { value: 0 },
        },
      });
      //setMaterial(materialInstance);

      const plane = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(plane, materialInstance);
      sceneInstance.add(mesh);

      const handleResize = () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        rendererInstance.setSize(newWidth, newHeight);
        materialInstance.uniforms.iResolution.value.set(newWidth, newHeight, 1);
      };

      window.addEventListener("resize", handleResize);

      const clock = new THREE.Clock();
      const animate = () => {
        if (materialInstance.uniforms.iTime) {
          materialInstance.uniforms.iTime.value = clock.getElapsedTime();
        }
        rendererInstance.render(sceneInstance, cameraInstance);
        requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener("resize", handleResize);
        rendererInstance.dispose();
      };
    };

    initThree();
  }, [currentShader]);

  const handleShaderChange = async (shader: Shader) => {
    if (!scene || !renderer || !camera) return;

    const shaderCode = await loadShader(shader);

    const newMaterial = new THREE.ShaderMaterial({
      fragmentShader: shaderCode,
      uniforms: {
        iResolution: {
          value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1),
        },
        iTime: { value: 0 },
      },
    });

    // Replace material
    scene.children.forEach((child) => {
      if ((child as THREE.Mesh).material) {
        // (child as THREE.Mesh).material.dispose();
        (child as THREE.Mesh).material = newMaterial;
      }
    });

    //setMaterial(newMaterial);
  };

  return (
    <>
      <div className="absolute top-4 left-4 z-50">
        <Select
          onValueChange={(e) => {
            console.log(e);
            const selectedShader = shaders.find((shader) => shader.name === e)!;
            setCurrentShader(selectedShader);
            handleShaderChange(selectedShader);
          }}
          value={currentShader.name}
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
      <div ref={canvasRef} className="w-full h-full"></div>
    </>
  );
}
