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
  rotationX: number;
  rotationY: number;
}

function CardModel({ rotationX, rotationY }: CardModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/assets/sorare/card.gltf");
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

  useFrame(() => {
    if (!groupRef.current) return;
    currentRotation.current.x = lerp(currentRotation.current.x, rotationX, 0.12);
    currentRotation.current.y = lerp(currentRotation.current.y, rotationY, 0.12);
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
    camera.position.set(0, 0, 0.22);
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
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };

    // Map pixel drag to radians — sensitivity tuned for natural feel
    const sensitivity = 0.006;
    setRotation((prev) => ({
      x: prev.x + dy * sensitivity,
      y: prev.y + dx * sensitivity,
    }));
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width, height, touchAction: "none" }}
      className="cursor-grab active:cursor-grabbing relative select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
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
        <CardModel rotationX={rotation.x} rotationY={rotation.y} />
      </Canvas>
      <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
        <span className="text-[11px] text-white/40 tracking-wide">
          Drag to rotate
        </span>
      </div>
    </div>
  );
}

// Preload the GLTF model
useGLTF.preload("/assets/sorare/card.gltf");
