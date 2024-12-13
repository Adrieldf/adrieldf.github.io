import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const GalaxyShaderComponent = () => {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const [shaders, setShaders] = useState<{ vertexShader: string; fragmentShader: string } | null>(null);

    useEffect(() => {
        // Load shaders from public folder
        const loadShaders = async () => {
            const response = await fetch('/shaders/starfield.glsl');
            const shaderCode = await response.text();
            const vertexShader = shaderCode.split('#ifdef FRAGMENT')[0];
            const fragmentShader = shaderCode.split('#ifdef FRAGMENT')[1];
            setShaders({ vertexShader, fragmentShader });
        };
        loadShaders();
    }, []);

    useEffect(() => {
        if (!shaders || !mountRef.current) return;

        const { vertexShader, fragmentShader } = shaders;

        const uniforms = {
            time: { value: 0.0 },
            resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        };

        const scene = new THREE.Scene();
        const camera = new THREE.Camera();
        camera.position.z = 1;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const animate = () => {
            uniforms.time.value += 0.01;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            // eslint-disable-next-line react-hooks/exhaustive-deps
            mountRef.current.removeChild(renderer.domElement);
        };
    }, [shaders]);

    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default GalaxyShaderComponent;
