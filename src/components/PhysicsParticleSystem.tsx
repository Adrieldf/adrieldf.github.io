// components/PhysicsParticleSystem2D.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Card } from './ui/card';
import { DragHandleDots2Icon } from "@radix-ui/react-icons";

interface Particle {
  mesh: THREE.Mesh;
  velocity: { x: number; y: number };
}

const PhysicsParticleSystem: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [particleCount, setParticleCount] = useState<number>(100);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleDrag = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    let animationFrameId: number;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Clear previous canvas if it exists
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    mountRef.current.appendChild(renderer.domElement);

    // Mouse tracking
    const handleMouseMove = (event: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (rect) {
        mouseRef.current = {
          x: event.clientX - rect.left - rect.width / 2,
          y: -(event.clientY - rect.top - rect.height / 2),
        };
      }
    };
    mountRef.current.addEventListener('mousemove', handleMouseMove);

    // Create particles
    const createParticles = () => {
      // Clear existing particles
      particlesRef.current.forEach(particle => {
        particle.mesh.geometry.dispose();
        (particle.mesh.material as THREE.Material).dispose();
        scene.remove(particle.mesh);
      });
      particlesRef.current = [];

      const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const particleRadius = 2;

      for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.CircleGeometry(particleRadius, 16);
        const mesh = new THREE.Mesh(geometry, particleMaterial.clone());

        const posX = Math.random() * window.innerWidth - window.innerWidth / 2;
        const posY = Math.random() * window.innerHeight - window.innerHeight / 2;
        mesh.position.set(posX, posY, 0);

        // Increase base speed for more visible movement
        const baseSpeed = 100 * speedMultiplier;
        const angle = Math.random() * Math.PI * 2;

        scene.add(mesh);
        particlesRef.current.push({
          mesh,
          velocity: {
            x: Math.cos(angle) * baseSpeed,
            y: Math.sin(angle) * baseSpeed,
          },
        });
      }
    };

    createParticles();

    const clock = new THREE.Clock();
    const camera = new THREE.OrthographicCamera(
      window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 1000
    );
    camera.position.z = 10;
    const animate = () => {
      const delta = clock.getDelta();

      particlesRef.current.forEach((particle) => {
        // Update position first
        particle.mesh.position.x += particle.velocity.x * delta;
        particle.mesh.position.y += particle.velocity.y * delta;

        // Check mouse repulsion
        const dx = particle.mesh.position.x - mouseRef.current.x;
        const dy = particle.mesh.position.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repulsionRadius = 100;

        if (distance < repulsionRadius) {
          const angle = Math.atan2(dy, dx);
          const currentSpeed = Math.sqrt(
            particle.velocity.x * particle.velocity.x +
            particle.velocity.y * particle.velocity.y
          );
          particle.velocity.x = Math.cos(angle) * currentSpeed;
          particle.velocity.y = Math.sin(angle) * currentSpeed;
        }

        // Bounce off walls
        if (particle.mesh.position.x <= -window.innerWidth / 2 || particle.mesh.position.x >= window.innerWidth / 2) {
          particle.velocity.x *= -1;
        }
        if (particle.mesh.position.y <= -window.innerHeight / 2 || particle.mesh.position.y >= window.innerHeight / 2) {
          particle.velocity.y *= -1;
        }
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();



    const updateSize = () => {
      const sidebar = document.querySelector('[data-sidebar]');
      const sidebarWidth = sidebar?.clientWidth || 0;
      const width = window.innerWidth - sidebarWidth;
      const height = window.innerHeight;

      if (renderer && camera) {
        renderer.setSize(width, height);
        camera.left = width / -2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = height / -2;
        camera.updateProjectionMatrix();

        // Update particle boundaries when resizing
        particlesRef.current.forEach(particle => {
          if (particle.mesh.position.x < -width / 2) particle.mesh.position.x = -width / 2;
          if (particle.mesh.position.x > width / 2) particle.mesh.position.x = width / 2;
          if (particle.mesh.position.y < -height / 2) particle.mesh.position.y = -height / 2;
          if (particle.mesh.position.y > height / 2) particle.mesh.position.y = height / 2;
        });
      }
    };

    // Listen for sidebar transitions
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateSize);
    });

    const sidebar = document.querySelector('[data-sidebar]');
    if (sidebar) {
      resizeObserver.observe(sidebar);
    }

    // Also listen for window resize
    window.addEventListener('resize', () => {
      requestAnimationFrame(updateSize);
    });

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      resizeObserver.disconnect();
      window.removeEventListener('resize', () => {
        requestAnimationFrame(updateSize);
      });
      mountRef.current?.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      particlesRef.current.forEach(particle => {
        particle.mesh.geometry.dispose();
        (particle.mesh.material as THREE.Material).dispose();
      });
    };
  }, [particleCount, speedMultiplier]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Card
        className="absolute z-10 p-4 w-80 cursor-move max-w-[90vw]"
        style={{ left: position.x, top: position.y }}
      >
        <div
          className="flex items-center mb-4 cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
        >
          <DragHandleDots2Icon className="w-6 h-6 mr-2" />
          <h3 className="font-semibold">Particle Controls</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="speed-slider">
              Speed Multiplier: {speedMultiplier.toFixed(1)}x
            </Label>
            <Slider
              id="speed-slider"
              min={0.1}
              max={3}
              step={0.1}
              value={[speedMultiplier]}
              onValueChange={(value) => setSpeedMultiplier(value[0])}
            />
          </div>

          <div>
            <Label htmlFor="particle-count">
              Particle Count: {particleCount}
            </Label>
            <Slider
              id="particle-count"
              min={100}
              max={1000}
              step={10}
              value={[particleCount]}
              onValueChange={(value) => setParticleCount(value[0])}
            />
          </div>
        </div>
      </Card>

      <div ref={mountRef} className="w-full h-full" style={{ outline: 'none' }} />
    </div>
  );
};

export default PhysicsParticleSystem;
