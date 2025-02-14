// components/PhysicsParticleSystem2D.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Label } from './ui/label';
import { Slider } from './ui/slider';


interface Particle {
  mesh: THREE.Mesh;
  velocity: { x: number; y: number };
}

const PhysicsParticleSystem2D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number>();
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

  useEffect(() => {
    // Capture ref value at the start of effect
    const currentParticles = particlesRef.current;
    
    if (!mountRef.current) return;

    /** ======================
     * THREE.JS SETUP
     * ====================== */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background

    // Get the dimensions of the mount element
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Create an Orthographic Camera for 2D rendering
    const camera = new THREE.OrthographicCamera(
      width / -2, // left
      width / 2,  // right
      height / 2, // top
      height / -2, // bottom
      0.1, // near
      1000 // far
    );
    camera.position.z = 10; // Position the camera slightly away from the scene

    // Create the WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    /** ======================
     * PARTICLE CREATION
     * ====================== */
    const particleCount = 100; // Number of particles
    const particleRadius = 5;  // Radius of each particle

    // Create a shared material for all particles
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.CircleGeometry(particleRadius, 32);
      const mesh = new THREE.Mesh(geometry, particleMaterial.clone());

      // Random initial position within the viewport, considering radius
      const posX = Math.random() * (width - 2 * particleRadius) - (width / 2 - particleRadius);
      const posY = Math.random() * (height - 2 * particleRadius) - (height / 2 - particleRadius);
      mesh.position.set(posX, posY, 0);

      scene.add(mesh);
      particlesRef.current.push({
        mesh,
        velocity: {
          x: (Math.random() - 0.5) * 200, // pixels per second
          y: (Math.random() - 0.5) * 200,
        },
      });
    }

    /** ======================
     * ANIMATION LOOP
     * ====================== */
    const clock = new THREE.Clock();

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta(); // Time elapsed since last frame in seconds

      // Update particle positions based on velocity and speedMultiplier
      particlesRef.current.forEach((particle) => {
        particle.mesh.position.x += particle.velocity.x * delta * speedMultiplier;
        particle.mesh.position.y += particle.velocity.y * delta * speedMultiplier;
      });

      // Handle collisions with walls
      particlesRef.current.forEach((particle) => {
        const { x, y } = particle.mesh.position;

        // Left Wall
        if (x - particleRadius < -width / 2) {
          particle.mesh.position.x = -width / 2 + particleRadius;
          particle.velocity.x *= -1;
        }

        // Right Wall
        if (x + particleRadius > width / 2) {
          particle.mesh.position.x = width / 2 - particleRadius;
          particle.velocity.x *= -1;
        }

        // Bottom Wall
        if (y - particleRadius < -height / 2) {
          particle.mesh.position.y = -height / 2 + particleRadius;
          particle.velocity.y *= -1;
        }

        // Top Wall
        if (y + particleRadius > height / 2) {
          particle.mesh.position.y = height / 2 - particleRadius;
          particle.velocity.y *= -1;
        }
      });

      // Handle collisions between particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];

          const dx = p2.mesh.position.x - p1.mesh.position.x;
          const dy = p2.mesh.position.y - p1.mesh.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDist = 2 * particleRadius;

          if (distance < minDist) {
            // Calculate overlap
            const overlap = minDist - distance;

            // Normalize the collision vector
            const nx = dx / distance;
            const ny = dy / distance;

            // Push particles apart based on overlap
            p1.mesh.position.x -= (overlap / 2) * nx;
            p1.mesh.position.y -= (overlap / 2) * ny;
            p2.mesh.position.x += (overlap / 2) * nx;
            p2.mesh.position.y += (overlap / 2) * ny;

            // Calculate relative velocity
            const dvx = p2.velocity.x - p1.velocity.x;
            const dvy = p2.velocity.y - p1.velocity.y;

            // Calculate velocity along the normal
            const vn = dvx * nx + dvy * ny;

            // If particles are moving away, skip
            if (vn > 0) continue;

            // Calculate restitution (elastic collision)
            const restitution = 0.7;

            // Impulse scalar
            const impulse = -(1 + restitution) * vn / 2; // mass=1 for both

            // Apply impulse to the velocities
            p1.velocity.x -= impulse * nx;
            p1.velocity.y -= impulse * ny;
            p2.velocity.x += impulse * nx;
            p2.velocity.y += impulse * ny;
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    /** ======================
     * HANDLE RESIZE
     * ====================== */
    const handleResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      renderer.setSize(newWidth, newHeight);
      camera.left = newWidth / -2;
      camera.right = newWidth / 2;
      camera.top = newHeight / 2;
      camera.bottom = newHeight / -2;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mountRef.current);

    /** ======================
     * CLEANUP ON UNMOUNT
     * ====================== */
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      resizeObserver.disconnect();

      // Dispose of particle geometries and materials
      currentParticles.forEach((particle) => {
        particle.mesh.geometry.dispose();
        (particle.mesh.material as THREE.Material).dispose();
        scene.remove(particle.mesh);
      });

      // Dispose of Three.js renderer
      renderer.dispose();
      scene.clear();

      // Remove renderer's canvas
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [speedMultiplier]); // Re-run effect when speedMultiplier changes

  useEffect(() => {
    // Capture ref value at the start of effect
    const currentMount = mountRef.current;
    
    // Rest of the effect code...

    return () => {
      // Use captured value in cleanup
      if (currentMount) {
        // cleanup code
      }
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center">
      {/* Sliders to control speed */}
      <div className="mb-4 w-1/3">
        <Label htmlFor="speed-slider" className="block text-sm font-medium text-white mb-1">
          Speed Multiplier: {speedMultiplier.toFixed(1)}x
        </Label>
        <Slider
          id="speed-slider"
          min={0.1}
          max={3}
          step={0.1}
          value={[speedMultiplier]}
          onValueChange={(value: number[]) => setSpeedMultiplier(value[0])}
        />
      </div>

      {/* Three.js Canvas */}
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};

export default PhysicsParticleSystem2D;
