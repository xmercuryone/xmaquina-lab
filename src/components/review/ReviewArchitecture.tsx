import SectionHeading from "./SectionHeading";
import CodeBlock from "./CodeBlock";

const CSS_CODE = `/* HoloCard CSS vars (spring-driven) */
--rotate-x: 0deg;
--rotate-y: 0deg;
--pointer-x: 50%;
--pointer-y: 50%;
--card-opacity: 0;
--background-x: 50%;
--background-y: 50%;

/* Shine layer */
.holo-card__shine {
  mix-blend-mode: color-dodge;
  background-image:
    repeating-linear-gradient(110deg,
      violet, blue, green, yellow, red ...);
  background-size: 400% 400%;
}`;

const WEBGL_CODE = `/* SorareCard3D — R3F Canvas setup */
<Canvas
  gl={{
    antialias: true,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.0,
    outputColorSpace: THREE.SRGBColorSpace,
  }}
  dpr={[1, 2]}
>
  <CameraSetup />       {/* position: [0, 0, 0.38] */}
  <SceneLighting />     {/* 7 lights */}
  <Environment preset="studio" />
  <CardModel mouseX={mouse.x} mouseY={mouse.y} />
</Canvas>`;

export default function ReviewArchitecture() {
  return (
    <section className="py-16">
      <SectionHeading
        number={2}
        title="Architecture Overview"
        subtitle="Dual-layer approach: CSS fallback + WebGL"
      />

      {/* Layer diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="rounded-lg border border-stroke p-6 bg-dark-gray">
          <div className="text-brand text-xs font-medium tracking-widest uppercase mb-4">
            Layer 1 — CSS Fallback
          </div>
          <div className="space-y-3 text-sm text-body">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-sm bg-white/80" />
              <span className="text-white">Card image</span>
              <span className="ml-auto text-xs">&lt;img&gt;</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-red-500 via-green-500 to-blue-500" />
              <span className="text-white">Shine layer</span>
              <span className="ml-auto text-xs">color-dodge</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-sm bg-white/30" />
              <span className="text-white">Glare layer</span>
              <span className="ml-auto text-xs">overlay</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-stroke text-xs text-body">
            Spring physics drive CSS vars. No GPU required.
          </div>
        </div>

        <div className="rounded-lg border border-brand/30 p-6 bg-dark-gray">
          <div className="text-brand text-xs font-medium tracking-widest uppercase mb-4">
            Layer 2 — WebGL (Sorare Production)
          </div>
          <div className="space-y-3 text-sm text-body">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-sm bg-amber-600" />
              <span className="text-white">GLTF Model</span>
              <span className="ml-auto text-xs">5 meshes</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-sm bg-blue-400" />
              <span className="text-white">PBR Materials</span>
              <span className="ml-auto text-xs">MeshStandard</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-sm bg-yellow-300" />
              <span className="text-white">7 Light sources</span>
              <span className="ml-auto text-xs">spot + rect</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-sm bg-purple-400" />
              <span className="text-white">Environment map</span>
              <span className="ml-auto text-xs">studio HDRI</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-stroke text-xs text-body">
            Real-time PBR rendering. Normal maps create holographic rainbow.
          </div>
        </div>
      </div>

      {/* Code snippets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CodeBlock label="HoloCard.css — CSS approach" code={CSS_CODE} />
        <CodeBlock label="SorareCard3D.tsx — WebGL approach" code={WEBGL_CODE} />
      </div>
    </section>
  );
}
