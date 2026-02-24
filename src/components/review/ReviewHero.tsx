import SorareCard3D from "../SorareCard3D";
import SectionHeading from "./SectionHeading";

const STATS = [
  { label: "Meshes", value: "5" },
  { label: "Textures", value: "4" },
  { label: "Lights", value: "7" },
  { label: "Triangles", value: "8,296" },
];

export default function ReviewHero() {
  return (
    <section className="py-16 lg:py-24">
      <SectionHeading number={1} title="Hero" subtitle="Interactive 3D Sorare card reproduction" />
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Card */}
        <div className="shrink-0">
          <SorareCard3D width={300} height={480} />
        </div>

        {/* Copy */}
        <div className="flex flex-col gap-6 max-w-xl">
          <h3 className="text-white text-2xl lg:text-3xl font-normal tracking-tight">
            Reverse Engineering the Sorare Holographic Card
          </h3>
          <p className="text-body leading-relaxed">
            We deconstructed Sorare's 3D card viewer to understand how they achieve their signature
            holographic effect using only standard PBR materials. No custom shaders required — just
            clever use of normal maps, low roughness, and strategic multi-light placement.
          </p>
          <p className="text-body leading-relaxed">
            The GLTF model was extracted from their web player, and every material property, light
            position, and interaction parameter was documented. This page breaks down each component.
          </p>

          {/* Stats badges */}
          <div className="flex flex-wrap gap-3 mt-2">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-stroke bg-dark-gray text-sm"
              >
                <span className="text-brand font-medium">{s.value}</span>
                <span className="text-body">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
