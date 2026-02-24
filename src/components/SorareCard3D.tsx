import { useRef, useCallback, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

/* ── Lerp utility ── */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/* ── Card Model (loaded from GLTF) ── */

interface CardModelProps {
  mouseX: number;
  mouseY: number;
  isHovering: boolean;
}

function CardModel({ mouseX, mouseY, isHovering }: CardModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/assets/sorare/card.gltf");
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  // Enhance materials for PBR reflections
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.envMapIntensity = 1.0;
        mat.needsUpdate = true;
      }
    });
  }, [scene]);

  // Update target rotation from mouse
  useEffect(() => {
    if (isHovering) {
      // Map mouse position to rotation: +-25 degrees
      targetRotation.current.y = mouseX * 25 * (Math.PI / 180);
      targetRotation.current.x = -mouseY * 15 * (Math.PI / 180);
    } else {
      targetRotation.current.x = 0;
      targetRotation.current.y = 0;
    }
  }, [mouseX, mouseY, isHovering]);

  useFrame(() => {
    if (!groupRef.current) return;
    const speed = isHovering ? 0.08 : 0.04;
    currentRotation.current.x = lerp(currentRotation.current.x, targetRotation.current.x, speed);
    currentRotation.current.y = lerp(currentRotation.current.y, targetRotation.current.y, speed);
    groupRef.current.rotation.x = currentRotation.current.x;
    groupRef.current.rotation.y = currentRotation.current.y;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

/* ── Scene lighting — matching Sorare's 4 spot + 2 area + ambient ── */

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={1.7} />

      {/* 4 spot lights positioned around the card */}
      <spotLight
        position={[2, 3, 4]}
        intensity={3}
        angle={Math.PI / 3}
        penumbra={0.5}
        decay={2}
        color="#ffffff"
      />
      <spotLight
        position={[-2, 3, 4]}
        intensity={2.5}
        angle={Math.PI / 3}
        penumbra={0.5}
        decay={2}
        color="#ffffff"
      />
      <spotLight
        position={[2, -2, 3]}
        intensity={2}
        angle={Math.PI / 3}
        penumbra={0.5}
        decay={2}
        color="#fff5e0"
      />
      <spotLight
        position={[-2, -2, 3]}
        intensity={2}
        angle={Math.PI / 3}
        penumbra={0.5}
        decay={2}
        color="#fff5e0"
      />

      {/* 2 rectangular area lights for broad diffuse illumination */}
      <rectAreaLight
        position={[0, 0, 3]}
        width={4}
        height={6}
        intensity={1.5}
        color="#ffffff"
      />
      <rectAreaLight
        position={[0, 0, -3]}
        width={4}
        height={6}
        intensity={0.8}
        color="#ffe8c0"
      />
    </>
  );
}

/* ── Camera setup ── */

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, 0.38);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

/* ── Main Component ── */

interface SorareCard3DProps {
  width?: number;
  height?: number;
}

export default function SorareCard3D({ width = 340, height = 550 }: SorareCard3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1
    setMouse({ x, y });
  }, []);

  const handlePointerEnter = useCallback(() => setIsHovering(true), []);
  const handlePointerLeave = useCallback(() => {
    setIsHovering(false);
    setMouse({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width, height }}
      className="cursor-pointer relative"
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <Canvas
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        dpr={[1, 2]}
      >
        <CameraSetup />
        <SceneLighting />
        <Environment preset="studio" />
        <CardModel mouseX={mouse.x} mouseY={mouse.y} isHovering={isHovering} />
      </Canvas>
    </div>
  );
}

// Preload the GLTF model
useGLTF.preload("/assets/sorare/card.gltf");
