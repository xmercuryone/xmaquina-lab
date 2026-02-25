import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

/* ── Apollo Model ── */

function ApolloModel({ modelPath, rotating, resetKey }: { modelPath: string; rotating: boolean; resetKey: number }) {
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

  // Reset model rotation
  useEffect(() => {
    if (resetKey === 0) return;
    if (groupRef.current) groupRef.current.rotation.y = 0;
  }, [resetKey]);

  // Slow idle rotation
  useFrame((_, delta) => {
    if (!groupRef.current || !rotating) return;
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

/* ── Initial camera constants ── */

const INITIAL_CAMERA_POS = new THREE.Vector3(0, 0, 3.5);
const INITIAL_TARGET = new THREE.Vector3(0, 0, 0);

/* ── Zoom-to-cursor OrbitControls ── */

function ZoomToCursorControls({ resetKey }: { resetKey: number }) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera, gl } = useThree();
  const mouse = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());

  // Reset camera + target when resetKey changes
  useEffect(() => {
    if (resetKey === 0) return; // skip initial mount
    const controls = controlsRef.current;
    if (!controls) return;
    camera.position.copy(INITIAL_CAMERA_POS);
    controls.target.copy(INITIAL_TARGET);
    controls.update();
  }, [resetKey, camera]);

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
  const [paused, setPaused] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const rotating = !paused && !hovered;

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
          <ApolloModel modelPath={modelPath} rotating={rotating} resetKey={resetKey} />
        </Suspense>
        <ZoomToCursorControls resetKey={resetKey} />
      </Canvas>

      {/* Controls — top left */}
      <div className="absolute top-3 left-3 flex gap-1.5">
        {/* Pause / Play */}
        <button
          className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/60 transition-colors"
          onClick={() => setPaused((p) => !p)}
          title={paused ? "Resume rotation" : "Pause rotation"}
        >
          {paused ? (
            <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
              <path d="M0 0L12 7L0 14Z" />
            </svg>
          ) : (
            <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
              <rect x="0" y="0" width="3" height="14" />
              <rect x="7" y="0" width="3" height="14" />
            </svg>
          )}
        </button>

        {/* Reset view */}
        <button
          className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/60 transition-colors"
          onClick={() => setResetKey((k) => k + 1)}
          title="Reset view"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M1 1v4h4" />
            <path d="M1 5A6 6 0 1 1 2.5 10" />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
        <span className="text-[11px] text-white/40 tracking-wide">
          Drag to orbit &middot; Scroll to zoom on point
        </span>
      </div>
    </div>
  );
}
