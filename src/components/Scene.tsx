"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";

interface SceneProps {
  activeTag: string;
  isGlitch?: boolean;
  theme: string;
}

// Data Pillar component for individual animation
function DataPillar({ x, z, height, initialOpacity, speed, isGlitch }: any) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null!);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (meshRef.current) {
      // 1. Vertical Movement (Slowly rising)
      meshRef.current.position.y = (t * speed * 20) % 15 - 5;
      
      // 2. Height animation (Breathing effect)
      meshRef.current.scale.y = 1 + Math.sin(t * speed * 10) * 0.2;

      // 3. Jitter on glitch
      if (isGlitch) {
        meshRef.current.position.x = x + Math.sin(t * 50) * 0.05;
      } else {
        meshRef.current.position.x = x;
      }
    }

    if (materialRef.current) {
      // 4. Opacity pulsing
      materialRef.current.opacity = initialOpacity * (0.6 + Math.sin(t * speed * 30) * 0.4);
      if (isGlitch) materialRef.current.opacity *= (0.5 + Math.random() * 0.5);
    }
  });

  return (
    <mesh ref={meshRef} position={[x, -2, z]}>
      <boxGeometry args={[0.02, height, 0.02]} />
      <meshBasicMaterial ref={materialRef} color="#ff003c" transparent blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

// The Blackwall / Deep Dive Scene (Inspired by CP2077 Alt scene)
function BlackwallScene({ isGlitch }: { isGlitch?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  
  // Undulating Data Sea (Floor)
  const floorCount = 40;
  const [floorPositions, floorColors] = useMemo(() => {
    const pos = new Float32Array(floorCount * floorCount * 3);
    const cols = new Float32Array(floorCount * floorCount * 3);
    const colorRed = new THREE.Color("#ff003c");
    
    for (let i = 0; i < floorCount; i++) {
      for (let j = 0; j < floorCount; j++) {
        const idx = (i * floorCount + j) * 3;
        pos[idx] = (i - floorCount / 2) * 0.8;
        pos[idx + 1] = -2; // Fixed Y
        pos[idx + 2] = (j - floorCount / 2) * 0.8;
        
        cols[idx] = colorRed.r;
        cols[idx + 1] = colorRed.g;
        cols[idx + 2] = colorRed.b;
      }
    }
    return [pos, cols];
  }, []);

  // Vertical Data Pillars Data
  const pillarCount = 60;
  const pillarsData = useMemo(() => {
    const data = [];
    for (let i = 0; i < pillarCount; i++) {
      data.push({
        x: (Math.random() - 0.5) * 20,
        z: -Math.random() * 30,
        height: Math.random() * 10 + 5,
        initialOpacity: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.02 + 0.005
      });
    }
    return data;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Animate the floor points (wave effect)
    if (groupRef.current) {
      const floorPoints = groupRef.current.children[0] as THREE.Points;
      const positions = floorPoints.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < floorCount; i++) {
        for (let j = 0; j < floorCount; j++) {
          const idx = (i * floorCount + j) * 3;
          const x = positions[idx];
          const z = positions[idx + 2];
          positions[idx + 1] = -2 + Math.sin(t + x * 0.5 + z * 0.5) * 0.3;
        }
      }
      floorPoints.geometry.attributes.position.needsUpdate = true;
      
      // Jitter on glitch
      if (isGlitch) {
        groupRef.current.position.x = Math.sin(t * 50) * 0.05;
      } else {
        groupRef.current.position.x = 0;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. The Undulating Data Sea */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[floorPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[floorColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} vertexColors transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </points>

      {/* 2. Vertical Data Pillars (now individually animated) */}
      {pillarsData.map((p, i) => (
        <DataPillar key={i} {...p} isGlitch={isGlitch} />
      ))}

      {/* 3. Floating Digital Debris */}
      <FloatingDebris count={200} />
    </group>
  );
}

function FloatingDebris({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = -Math.random() * 30;
    }
    return pos;
  });

  useFrame((state, delta) => {
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= delta * 0.2;
      if (pos[i * 3 + 1] < -5) pos[i * 3 + 1] = 5;
      pos[i * 3] += Math.sin(state.clock.getElapsedTime() + i) * 0.002;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#ffffff" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// Moving Starfield for Retro Theme
function Starfield() {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 1000;
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  });

  useFrame((state, delta) => {
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 2] += delta * 1.5;
      if (pos[i * 3 + 2] > 2) pos[i * 3 + 2] = -8;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#ffffff" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

export default function Scene({ activeTag, isGlitch, theme }: SceneProps) {
  const bgColor = theme === "cyberpunk" ? "#0a0505" : "#000000";

  return (
    <div className={`fixed inset-0 -z-10 transition-colors duration-500`} style={{ backgroundColor: bgColor }}>
      <Canvas
        camera={{ position: [0, 0, 1.5], fov: 60 }}
        onCreated={(state) => {
          state.gl.setClearColor(bgColor, 1);
          state.scene.fog = new THREE.FogExp2(bgColor, theme === "cyberpunk" ? 0.15 : 0);
        }}
      >
        <ambientLight intensity={0.5} />
        
        {theme === "retro" ? (
          <Starfield />
        ) : (
          <>
            <BlackwallScene isGlitch={isGlitch} />
            <pointLight position={[0, 0, -2]} color="#ff003c" intensity={4} distance={20} />
            {isGlitch && (
              <pointLight position={[0, 0, 1]} color="#fcee0a" intensity={5} distance={10} />
            )}
          </>
        )}
      </Canvas>
    </div>
  );
}