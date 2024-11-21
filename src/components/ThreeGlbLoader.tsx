// "use client";

// import React, { useRef, useEffect, useState } from "react";
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import ResizeObserver from "resize-observer-polyfill";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// interface ModelOption {
//   name: string;
//   file: string;
// }

// const ThreejsGlbLoader: React.FC = () => {
//   const mountRef = useRef<HTMLDivElement>(null);
//   const [selectedModel, setSelectedModel] = useState<string>("model1.glb"); // Default model

//   // List of available models in public/models
//   const models: ModelOption[] = [
//     { name: "Model 1", file: "model1.glb" },
//     { name: "Model 2", file: "model2.glb" },
//     { name: "Model 3", file: "model3.glb" },
//     // Add more models as needed
//   ];

//   useEffect(() => {
//     if (!mountRef.current) return;

//     // === Three.js Setup ===
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x1e1e1e); // Dark background

//     const camera = new THREE.PerspectiveCamera(
//       75,
//       mountRef.current.clientWidth / mountRef.current.clientHeight,
//       0.1,
//       1000
//     );
//     camera.position.set(0, 1.5, 3); // Adjust as needed

//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(
//       mountRef.current.clientWidth,
//       mountRef.current.clientHeight
//     );
//     renderer.setPixelRatio(window.devicePixelRatio);
//     mountRef.current.appendChild(renderer.domElement);

//     // === Lighting ===
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     directionalLight.position.set(5, 10, 7.5);
//     scene.add(directionalLight);

//     // === GLTFLoader ===
//     const loader = new GLTFLoader();
//     let currentModel: THREE.Group | null = null;

//     const loadModel = (file: string) => {
//       // Remove existing model
//       if (currentModel) {
//         scene.remove(currentModel);
//         currentModel.traverse((child) => {
//           if ((child as THREE.Mesh).geometry) {
//             ((child as THREE.Mesh).geometry as THREE.BufferGeometry).dispose();
//           }
//           if ((child as THREE.Mesh).material) {
//             const materials = Array.isArray((child as THREE.Mesh).material)
//               ? (child as THREE.Mesh).material
//               : [(child as THREE.Mesh).material];
//             materials.forEach((material) => material.dispose());
//           }
//         });
//         currentModel = null;
//       }

//       // Load new model
//       loader.load(
//         `/models/${file}`,
//         (gltf) => {
//           currentModel = gltf.scene;
//           scene.add(currentModel);
//           // Optional: Adjust model scale and position
//           currentModel.scale.set(1, 1, 1);
//           currentModel.position.set(0, 0, 0);
//         },
//         undefined,
//         (error) => {
//           console.error(`Error loading model ${file}:`, error);
//         }
//       );
//     };

//     // Initial model load
//     loadModel(selectedModel);

//     // === Animation Loop ===
//     const animate = () => {
//       requestAnimationFrame(animate);
//       renderer.render(scene, camera);
//     };
//     animate();

//     // === Handle Resize ===
//     const handleResize = () => {
//       if (!mountRef.current) return;
//       const width = mountRef.current.clientWidth;
//       const height = mountRef.current.clientHeight;
//       renderer.setSize(width, height);
//       camera.aspect = width / height;
//       camera.updateProjectionMatrix();
//     };

//     // Initialize ResizeObserver
//     const resizeObserver = new ResizeObserver(() => {
//       handleResize();
//     });
//     resizeObserver.observe(mountRef.current);

//     // === Cleanup on Unmount ===
//     return () => {
//       resizeObserver.disconnect();
//       mountRef.current?.removeChild(renderer.domElement);
//       renderer.dispose();
//       scene.clear();
//     };
//   }, [selectedModel]);

//   return (
//     <div className="w-full h-full flex flex-col items-center">
//       {/* Dropdown to select model */}
//       <div className="mb-4">
//         <DropdownMenu>
//           <DropdownMenuTrigger className="w-48">
//             Select 3D Model
//           </DropdownMenuTrigger>
//           <DropdownMenuContent>
//             <DropdownMenuLabel>Available Models</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             {models.map((model) => (
//               <DropdownMenuItem key={model.file}>{model.name}</DropdownMenuItem>
//             ))}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       {/* Three.js Canvas */}
//       <div className="flex-1 w-full h-full" ref={mountRef} />
//     </div>
//   );
// };

// export default ThreejsGlbLoader;
