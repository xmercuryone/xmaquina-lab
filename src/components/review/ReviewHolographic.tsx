import SectionHeading from "./SectionHeading";
import MeshViewer from "./MeshViewer";

const COMPARISONS = [
  {
    label: "Flat",
    description: "Roughness 0.8, no normal map. Dull, plastic-looking surface with barely visible reflections.",
    meshName: "card_front",
    overrides: {
      roughness: 0.8,
      normalMap: null as unknown as undefined,
    },
  },
  {
    label: "Textured",
    description: "Roughness 0.8, with normal map. Surface detail visible but reflections are blurred and diffuse.",
    meshName: "card_front",
    overrides: {
      roughness: 0.8,
    },
  },
  {
    label: "Holographic",
    description: "Roughness 0.1, with normal map. Sharp reflections follow the normal map's micro-surface, creating rainbow shifts.",
    meshName: "card_front",
    overrides: {
      roughness: 0.1,
    },
  },
];

export default function ReviewHolographic() {
  return (
    <section className="py-16">
      <SectionHeading
        number={8}
        title="The Holographic Secret"
        subtitle="Low roughness + normal maps + multiple lights = holographic appearance"
      />

      <p className="text-body leading-relaxed mb-8 max-w-3xl">
        The holographic rainbow effect isn't produced by custom shaders or special materials. It emerges
        naturally from standard PBR rendering when three conditions align: a very low roughness value
        creates mirror-like reflections, a normal map perturbs the surface normals so each micro-area
        reflects a different direction, and multiple light sources provide different colors/angles to reflect.
        As the card tilts, the reflection angles shift — and the normal map causes them to shift at different
        rates across the surface, producing a rainbow sweep.
      </p>

      {/* Three comparison viewers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {COMPARISONS.map((comp) => (
          <div key={comp.label} className="flex flex-col gap-3">
            <MeshViewer
              meshName={comp.meshName}
              label={comp.label}
              height={260}
              materialOverrides={comp.overrides}
            />
            <p className="text-body text-xs leading-relaxed px-2">{comp.description}</p>
          </div>
        ))}
      </div>

      {/* Summary formula */}
      <div className="rounded-lg border border-brand/30 p-6 bg-dark-gray">
        <h4 className="text-brand text-sm font-medium tracking-widest uppercase mb-4">
          The Formula
        </h4>
        <div className="flex flex-wrap items-center gap-3 text-white text-sm">
          <span className="px-3 py-1.5 rounded border border-stroke bg-[#0a0a0c]">
            Roughness 0.1
          </span>
          <span className="text-brand">+</span>
          <span className="px-3 py-1.5 rounded border border-stroke bg-[#0a0a0c]">
            Normal Map
          </span>
          <span className="text-brand">+</span>
          <span className="px-3 py-1.5 rounded border border-stroke bg-[#0a0a0c]">
            7 Lights
          </span>
          <span className="text-brand">+</span>
          <span className="px-3 py-1.5 rounded border border-stroke bg-[#0a0a0c]">
            Environment Map
          </span>
          <span className="text-brand">=</span>
          <span className="px-3 py-1.5 rounded border border-brand bg-brand/10 text-brand font-medium">
            Holographic Effect
          </span>
        </div>
      </div>
    </section>
  );
}
