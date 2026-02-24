import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

/* ── Apollo Model ── */

function ApolloModel({ modelPath, hovered }: { modelPath: string; hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.envMapIntensity = 1.2;
        mat.needsUpdate = true;
      }
    });
  }, [scene]);

  // Slow idle rotation — pause when hovered
  useFrame((_, delta) => {
    if (!groupRef.current || hovered) return;
    groupRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

/* ── Lighting — adapted from SorareCard3D for 3D humanoid form ── */

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />

      {/* Key light — high right */}
      <spotLight
        position={[3, 5, 4]}
        intensity={2.5}
        angle={Math.PI / 3}
        penumbra={0.5}
        decay={2}
        color="#ffffff"
      />
      {/* Fill light — high left, cool */}
      <spotLight
        position={[-3, 3, 4]}
        intensity={1.5}
        angle={Math.PI / 3}
        penumbra={0.5}
        decay={2}
        color="#e8f0ff"
      />
      {/* Back-right warm */}
      <spotLight
        position={[3, 2, -3]}
        intensity={1.5}
        angle={Math.PI / 3}
        penumbra={0.5}
        decay={2}
        color="#fff5e0"
      />
      {/* Back-left warm */}
      <spotLight
        position={[-3, 2, -3]}
        intensity={1.0}
        angle={Math.PI / 3}
        penumbra={0.5}
        decay={2}
        color="#fff5e0"
      />
      {/* Rim light — silhouette edge */}
      <spotLight
        position={[0, 4, -4]}
        intensity={2.0}
        angle={Math.PI / 3}
        penumbra={0.5}
        decay={2}
        color="#ffffff"
      />

      {/* Soft front fill panel */}
      <rectAreaLight
        position={[0, 1, 5]}
        width={4}
        height={6}
        intensity={1.0}
        color="#ffffff"
      />
      {/* Ground bounce */}
      <rectAreaLight
        position={[0, -2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={6}
        height={6}
        intensity={0.3}
        color="#e0e8ff"
      />
    </>
  );
}

/* ── Zoom-to-cursor OrbitControls ── */

function ZoomToCursorControls() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera, gl } = useThree();
  const mouse = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());

  useEffect(() => {
    const canvas = gl.domElement;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const controls = controlsRef.current;
      if (!controls) return;

      // Convert mouse to NDC
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Project mouse ray to a plane at the target distance
      raycaster.current.setFromCamera(mouse.current, camera);
      const target = controls.target;
      const dist = camera.position.distanceTo(target);
      const pointOnRay = camera.position
        .clone()
        .add(raycaster.current.ray.direction.clone().multiplyScalar(dist));

      // Zoom direction: negative deltaY = zoom in
      const zoomIn = e.deltaY < 0;
      const zoomFactor = zoomIn ? 0.93 : 1.07;

      // Move camera closer/further along its current direction
      const camToTarget = target.clone().sub(camera.position);
      const newDist = camToTarget.length() * zoomFactor;

      // Clamp distance
      if (newDist < 0.4 || newDist > 8) return;

      // Shift target toward mouse-projected point when zooming in
      const shiftAmount = zoomIn ? 0.15 : -0.08;
      target.lerp(pointOnRay, shiftAmount);

      // Set new camera distance
      const dir = camToTarget.normalize();
      camera.position.copy(target).sub(dir.multiplyScalar(newDist));

      controls.update();
    };

    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [camera, gl]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      minDistance={0.4}
      maxDistance={8}
      minPolarAngle={Math.PI * 0.15}
      maxPolarAngle={Math.PI * 0.8}
      dampingFactor={0.08}
      enableDamping={true}
    />
  );
}

/* ── Main Component ── */

interface ApolloViewer3DProps {
  width?: number | string;
  height?: number | string;
  modelPath?: string;
}

export default function ApolloViewer3D({
  width = "100%",
  height = 700,
  modelPath = "/assets/robots/apollo/apollo-web.glb",
}: ApolloViewer3DProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ width, height, minHeight: 0 }}
      className="relative select-none overflow-hidden"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <Canvas
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        camera={{ position: [0, 0, 3.5], fov: 35 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SceneLighting />
          <Environment preset="studio" />
          <ApolloModel modelPath={modelPath} hovered={hovered} />
        </Suspense>
        <ZoomToCursorControls />
      </Canvas>
      <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
        <span className="text-[11px] text-white/40 tracking-wide">
          Drag to orbit &middot; Scroll to zoom on point
        </span>
      </div>
    </div>
  );
}
