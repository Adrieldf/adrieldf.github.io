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

export default function ShaderToyCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [shaders, setShaders] = useState<Shader[]>([]);
  const [currentShader, setCurrentShader] = useState<Shader | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);

  // Load available shaders
  useEffect(() => {
    const fetchShaders = async () => {
      try {
        const response = await fetch('/api/shaders');
        if (!response.ok) throw new Error('Failed to fetch shaders');
        const files = await response.json();
        
        const shaderList = files.map((file: string) => ({
          name: file.replace('.glsl', ''),
          filePath: `/shaders/${file}`
        }));
        
        setShaders(shaderList);
        if (shaderList.length > 0) {
          setCurrentShader(shaderList[0]);
        }
      } catch (error) {
        console.error('Error loading shaders:', error);
      }
    };

    fetchShaders();
  }, []);

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
        canvasRef.current.removeChild(canvasRef.current.firstChild);
      }
    }
  };

  useEffect(() => {
    if (!currentShader) return;

    const initThree = async () => {
      if (!canvasRef.current) return;

      cleanUpRenderer();
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Add scene and camera
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;

      const rendererInstance = new THREE.WebGLRenderer({ antialias: true });
      rendererInstance.setSize(width, height);
      rendererInstance.setPixelRatio(window.devicePixelRatio);
      canvasRef.current.appendChild(rendererInstance.domElement);
      setRenderer(rendererInstance);

      const shaderCode = await loadShader(currentShader);

      const material = new THREE.ShaderMaterial({
        vertexShader: `
          void main() {
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: shaderCode,
        uniforms: {
          iResolution: { value: new THREE.Vector3(width, height, 1) },
          iTime: { value: 0 },
        },
      });

      const plane = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(plane, material);
      scene.add(mesh);

      const handleResize = () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        rendererInstance.setSize(newWidth, newHeight);
        material.uniforms.iResolution.value.set(newWidth, newHeight, 1);
      };

      window.addEventListener("resize", handleResize);

      const clock = new THREE.Clock();
      const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        material.uniforms.iTime.value = elapsedTime;
        rendererInstance.render(scene, camera);
        requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener("resize", handleResize);
        rendererInstance.dispose();
      };
    };

    initThree();
  }, [currentShader, cleanUpRenderer]);

  return (
    <>
      <div className="absolute top-4 left-4 z-50">
        <Select
          onValueChange={(shaderName) => {
            const selectedShader = shaders.find((s) => s.name === shaderName);
            if (selectedShader) {
              setCurrentShader(selectedShader);
            }
          }}
          value={currentShader?.name}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Shader" />
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
