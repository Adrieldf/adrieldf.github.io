"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { inBox } from "maath/random";

// 1. Mapeamento de cores (Certifique-se de que as chaves batem com as tags do seu page.tsx)
const tagColors: Record<string, string> = {
  All: "#6366f1",    // Indigo
  Unity: "#22c55e",  // Green
  "C++": "#3b82f6",  // Blue
  React: "#06b6d4",  // Cyan
  "Next.js": "#ffffff", // White
  "C#": "#a855f7"    // Purple
};

interface SceneProps {
  activeTag: string;
}

function ParticleField({ activeTag }: { activeTag: string }) {
  const ref = useRef<THREE.Points>(null!);
  const materialRef = useRef<any>(null!);

  // 2. Gerando os pontos com segurança
  // Usamos inBox para formar um cubo, reforçando estética pixel art
  const box = useMemo(() => {
    const data = inBox(new Float32Array(5001), { sides: [3, 3, 3] }) as Float32Array;

    // Checagem rigorosa: se houver algum valor inválido (NaN ou Infinity), resetamos para 0
    for (let i = 0; i < data.length; i++) {
      if (!isFinite(data[i])) {
        data[i] = 0;
      }
    }
    return data;
  }, []);

  // 3. Cor alvo baseada na tag atual
  const targetColor = useMemo(() => {
    const colorHex = tagColors[activeTag] || tagColors.All;
    return new THREE.Color(colorHex);
  }, [activeTag]);

  useFrame((state, delta) => {
    // Rotação constante
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;

      // Efeito suave de paralaxe com o mouse
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, state.mouse.x * 0.1, 0.05);
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, state.mouse.y * 0.1, 0.05);
    }

    // 4. Transição de cor suave (Lerp)
    if (materialRef.current) {
      materialRef.current.color.lerp(targetColor, 0.05);
    }
  });

  return (
    <group>
      <Points ref={ref} positions={box} stride={3} frustumCulled={false}>
        <PointMaterial
          ref={materialRef}
          transparent={false}
          color={tagColors.All}
          size={0.01}
          sizeAttenuation={true}
          depthWrite={true}
        />
      </Points>
    </group>
  );
}

export default function Scene({ activeTag }: SceneProps) {
  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <Canvas
        camera={{ position: [0, 0, 1.5] }}
        onCreated={(state) => {
          // Fundo escuro
          state.gl.setClearColor(0x000000, 1);
        }}
      >
        <ParticleField activeTag={activeTag} />
      </Canvas>
    </div>
  );
}