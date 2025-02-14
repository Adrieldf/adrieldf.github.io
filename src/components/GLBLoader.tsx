"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls as OrbitControlsImpl, useGLTF, Html, Center, Environment } from "@react-three/drei";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InfoIcon } from "lucide-react";
import * as THREE from 'three';

interface Model {
  name: string;
  path: string;
}

function LoadingScreen() {
  return (
    <Html center style={{ transform: 'translateY(-50%)' }}>
      <div className="bg-background/80 backdrop-blur-sm rounded-lg px-6 py-3 text-center">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    </Html>
  );
}

function Lighting() {
  return (
    <>
      {/* Main ambient light */}
      <ambientLight intensity={0.5} />

      {/* Main directional light (sun) */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill light from the opposite side */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.5}
      />

      {/* Top down light for better detail visibility */}
      <directionalLight
        position={[0, 10, 0]}
        intensity={0.3}
      />

      {/* Ground fill light */}
      <directionalLight
        position={[0, -5, 0]}
        intensity={0.2}
      />

      {/* Front fill light */}
      <directionalLight
        position={[0, 2, 5]}
        intensity={0.3}
      />

      {/* Hemisphere light for natural sky-ground interaction */}
      <hemisphereLight
        args={["#ffffff", "#99ccff", 0.6]}
      />
    </>
  );
}

function Model({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  const controlsRef = useRef<typeof OrbitControlsImpl>(null);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const radius = Math.max(size.x, size.y, size.z) * 0.5;
    const fov = 50;
    const idealDistance = (radius * 1.0) / Math.tan((fov * 0.5) * Math.PI / 180);
    if (controlsRef.current) {
      const controls = controlsRef.current;
      controls.target.set(center.x, center.y, center.z);
      const newPosition = center.clone().add(new THREE.Vector3(idealDistance, idealDistance * 0.5, idealDistance));
      controls.object.position.set(newPosition.x, newPosition.y, newPosition.z);
      controls.update();
    }
  }, [scene]);

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.material) {
        child.material.side = THREE.DoubleSide;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    }
  });

  return (
    <Center>
      <Lighting />
      <primitive object={scene} />
      <OrbitControlsImpl
        ref={controlsRef}
        makeDefault
        enableDamping={false}
        minDistance={1}
        maxDistance={100}
      />
    </Center>
  );
}

export default function GLBLoader() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/models');
        if (!response.ok) throw new Error('Failed to fetch models');
        const files = await response.json();
        const modelList = files.map((file: string) => ({
          name: file.replace('.glb', ''),
          path: `/glbs/${file}`
        }));
        setModels(modelList);
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    fetchModels();
  }, []);

  return (
    <div className="relative w-full h-full">
      <div className="absolute pl-5 top-4 z-50 flex items-center gap-2">
        <Select
          onValueChange={(modelName) => {
            const selected = models.find((m) => m.name === modelName);
            setSelectedModel(selected || null);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.name} value={model.name}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowInfo(true)}
          className="rounded-full"
        >
          <InfoIcon className="h-5 w-5" />
        </Button>
      </div>

      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Model Credits</DialogTitle>
            <DialogDescription className="text-center pt-4">
              The models used in this page can be found in their pages on:{' '}
              <br />
              <a
                href="https://sketchfab.com/3d-models/free-1975-porsche-911-930-turbo-8568d9d14a994b9cae59499f0dbed21e"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 underline underline-offset-4"
              >
                FREE 1975 Porsche 911 (930) Turbo
              </a>
              <br />
              <a
                href="https://sketchfab.com/3d-models/silent-ash-bc44272e8c1047148b33c913e659fcfa#download"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 underline underline-offset-4"
              >
                Silent Ash
              </a>
              <br />
              <a
                href="https://sketchfab.com/3d-models/frank-0eb1f1757349489eab05a0f03cff5b46#download"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 underline underline-offset-4"
              >
                Frank
              </a>
              <br />
              All credit goes to the creators of the models.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Canvas
        camera={{
          position: [3, 2, 3],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        style={{ height: '100vh' }}
        shadows
      >
        <color attach="background" args={["#1a1a1a"]} />
        <Suspense fallback={<LoadingScreen />}>
          {selectedModel && <Model path={selectedModel.path} />}
        </Suspense>
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
} 