import SectionHeading from "./SectionHeading";
import CodeBlock from "./CodeBlock";

const STEPS = [
  {
    label: "GLTF Loading",
    description:
      "The model is loaded via drei's useGLTF hook, which caches the parsed result. The GLTF contains 5 meshes, 4 materials, 4 textures, and a binary geometry buffer.",
    code: `const { scene } = useGLTF("/assets/sorare/card.gltf");
// Returns cached THREE.Group with all meshes attached
// Binary: card-geometry.bin (202 KB)`,
  },
  {
    label: "MeshStandardMaterial",
    description:
      "Three.js automatically creates MeshStandardMaterial instances from the GLTF's PBR definitions. Each material gets its roughness, metalness, base color, and normal map from the file.",
    code: `// From GLTF material definition:
{
  "name": "Material_0",
  "normalTexture": { "index": 2 },
  "pbrMetallicRoughness": {
    "baseColorTexture": { "index": 3 },
    "metallicFactor": 0,
    "roughnessFactor": 0.1   // KEY: very low
  }
}`,
  },
  {
    label: "Environment Map",
    description:
      "The studio HDRI preset from drei provides an environment map that reflects off the low-roughness surfaces. This is what creates the visible reflections that shift as the card rotates.",
    code: `<Environment preset="studio" />
// Sets scene.environment = studioHDRI
// All MeshStandardMaterials automatically use it
// envMapIntensity = 1.0 (enhanced in useEffect)`,
  },
  {
    label: "Tone Mapping",
    description:
      "ACES Filmic tone mapping compresses the HDR environment map reflections into displayable range while preserving contrast and color richness.",
    code: `gl={{
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 1.0,
  outputColorSpace: THREE.SRGBColorSpace,
}}`,
  },
  {
    label: "Output",
    description:
      "The final rendered frame combines all PBR calculations: direct lighting from 7 sources, environment reflections, normal-map-perturbed surfaces, and tone-mapped output in sRGB.",
    code: `// The holographic effect emerges from:
// 1. Normal map perturbs surface normals
// 2. Low roughness = sharp reflections
// 3. Multiple lights = many reflection angles
// 4. Environment map = continuous reflections
// 5. Card rotation = changing reflection angles
// = RAINBOW HOLOGRAPHIC APPEARANCE`,
  },
];

export default function ReviewPipeline() {
  return (
    <section className="py-16">
      <SectionHeading
        number={7}
        title="PBR Pipeline"
        subtitle="Step-by-step from GLTF file to holographic output"
      />

      <div className="space-y-1">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex gap-4 lg:gap-8">
            {/* Vertical connector */}
            <div className="flex flex-col items-center shrink-0 w-8">
              <div className="w-8 h-8 rounded-full border-2 border-brand bg-dark-background flex items-center justify-center text-brand text-xs font-medium">
                {i + 1}
              </div>
              {i < STEPS.length - 1 && <div className="flex-1 w-px bg-stroke" />}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <h4 className="text-white text-lg font-medium mb-2">{step.label}</h4>
              <p className="text-body text-sm leading-relaxed mb-4">{step.description}</p>
              <CodeBlock code={step.code} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
