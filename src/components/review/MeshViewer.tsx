import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center, Environment } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ── Lazy visibility hook ── */

function useInView(ref: React.RefObject<HTMLElement | null>, margin = "200px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
        else setInView(false);
      },
      { rootMargin: margin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, margin]);
  return inView;
}

/* ── Isolated mesh scene ── */

interface IsolatedMeshProps {
  meshName: string;
  materialOverrides?: Partial<THREE.MeshStandardMaterialParameters>;
}

function IsolatedMesh({ meshName, materialOverrides }: IsolatedMeshProps) {
  const { scene } = useGLTF("/assets/sorare/card.gltf");

  const clonedMesh = useMemo(() => {
    let found: THREE.Mesh | null = null;
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === meshName) {
        found = child;
      }
    });
    if (!found) return null;
    const mesh = (found as THREE.Mesh).clone(true);
    if (mesh.material) {
      mesh.material = (mesh.material as THREE.MeshStandardMaterial).clone();
      if (materialOverrides) {
        Object.assign(mesh.material, materialOverrides);
        mesh.material.needsUpdate = true;
      }
    }
    return mesh;
  }, [scene, meshName, materialOverrides]);

  if (!clonedMesh) return null;

  return (
    <Center>
      <primitive object={clonedMesh} />
    </Center>
  );
}

/* ── Main MeshViewer ── */

interface MeshViewerProps {
  meshName: string;
  label: string;
  stats?: { vertices: number; triangles: number; material: string; purpose: string };
  height?: number;
  materialOverrides?: Partial<THREE.MeshStandardMaterialParameters>;
  autoRotate?: boolean;
}

export default function MeshViewer({
  meshName,
  label,
  stats,
  height = 200,
  materialOverrides,
  autoRotate = true,
}: MeshViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef);

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={containerRef}
        className="rounded-lg border border-stroke bg-[#0a0a0c] overflow-hidden"
        style={{ height }}
      >
        {inView ? (
          <Canvas
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.0,
              outputColorSpace: THREE.SRGBColorSpace,
            }}
            camera={{ position: [0, 0, 0.35], fov: 50 }}
            dpr={[1, 2]}
          >
            <ambientLight intensity={1.5} />
            <spotLight position={[2, 3, 4]} intensity={3} angle={Math.PI / 3} penumbra={0.5} />
            <spotLight position={[-2, 3, 4]} intensity={2.5} angle={Math.PI / 3} penumbra={0.5} />
            <Environment preset="studio" />
            <IsolatedMesh meshName={meshName} materialOverrides={materialOverrides} />
            <OrbitControls autoRotate={autoRotate} autoRotateSpeed={4} enableZoom={false} />
          </Canvas>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-body text-xs">
            Loading...
          </div>
        )}
      </div>
      <div className="text-center">
        <span className="text-white text-sm font-medium">{label}</span>
      </div>
      {stats && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-body px-2">
          <span>Vertices</span>
          <span className="text-white text-right">{stats.vertices.toLocaleString()}</span>
          <span>Triangles</span>
          <span className="text-white text-right">{stats.triangles.toLocaleString()}</span>
          <span>Material</span>
          <span className="text-white text-right">{stats.material}</span>
          <span>Purpose</span>
          <span className="text-white text-right">{stats.purpose}</span>
        </div>
      )}
    </div>
  );
}
