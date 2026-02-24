import SectionHeading from "./SectionHeading";

/* ── Texture data ── */

const TEXTURES = [
  { src: "/assets/sorare/card-diffuse.png", name: "card-diffuse.png", role: "Front face diffuse", dimensions: "1024x1024" },
  { src: "/assets/sorare/normal-map.png", name: "normal-map.png", role: "Front normal map", dimensions: "1024x1024" },
  { src: "/assets/sorare/card-layer-1.png", name: "card-layer-1.png", role: "Back face diffuse", dimensions: "1024x1024" },
  { src: "/assets/sorare/card-layer-2.png", name: "card-layer-2.png", role: "Back normal map", dimensions: "1024x1024" },
];

/* ── Material data ── */

const MATERIALS = [
  {
    name: "Material_0",
    target: "card_front",
    roughness: 0.1,
    metalness: 0,
    hasNormal: true,
    hasDiffuse: true,
    color: null,
  },
  {
    name: "Material_1",
    target: "card_back",
    roughness: 0.1,
    metalness: 0,
    hasNormal: true,
    hasDiffuse: true,
    color: null,
  },
  {
    name: "Node",
    target: "case",
    roughness: 0,
    metalness: 0,
    hasNormal: false,
    hasDiffuse: false,
    color: "#ffc425",
  },
  {
    name: "STL_material",
    target: "case logos",
    roughness: 0.5,
    metalness: 0.5,
    hasNormal: false,
    hasDiffuse: false,
    color: "#8d5b1a",
  },
];

function RoughnessBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-stroke overflow-hidden">
        <div
          className="h-full rounded-full bg-brand"
          style={{ width: `${value * 100}%` }}
        />
      </div>
      <span className="text-xs text-white w-8 text-right">{value}</span>
    </div>
  );
}

export default function ReviewMaterials() {
  return (
    <section className="py-16">
      <SectionHeading
        number={4}
        title="Materials & Textures"
        subtitle="4 textures and 4 materials define the card's appearance"
      />

      {/* Textures */}
      <h3 className="text-white text-lg font-medium mb-4">Textures</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {TEXTURES.map((tex) => (
          <div key={tex.name} className="rounded-lg border border-stroke overflow-hidden bg-dark-gray">
            <div className="relative aspect-square bg-[#0a0a0c]">
              <img
                src={tex.src}
                alt={tex.name}
                className="w-full h-full object-contain"
                loading="lazy"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <div className="text-white text-xs font-medium">{tex.role}</div>
                <div className="text-body text-[10px]">{tex.dimensions}</div>
              </div>
            </div>
            <div className="px-3 py-2 text-xs text-body truncate">{tex.name}</div>
          </div>
        ))}
      </div>

      {/* Materials */}
      <h3 className="text-white text-lg font-medium mb-4">Materials</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MATERIALS.map((mat) => (
          <div key={mat.name} className="rounded-lg border border-stroke p-4 bg-dark-gray space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium">{mat.name}</span>
              {mat.color && (
                <div
                  className="w-5 h-5 rounded-full border border-stroke"
                  style={{ backgroundColor: mat.color }}
                />
              )}
            </div>
            <div className="text-xs text-body">Applied to: {mat.target}</div>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-body mb-1">Roughness</div>
                <RoughnessBar value={mat.roughness} />
              </div>
              <div>
                <div className="text-xs text-body mb-1">Metalness</div>
                <RoughnessBar value={mat.metalness} />
              </div>
            </div>
            <div className="flex gap-2 text-[10px]">
              {mat.hasNormal && (
                <span className="px-2 py-0.5 rounded bg-brand/10 text-brand border border-brand/20">
                  Normal Map
                </span>
              )}
              {mat.hasDiffuse && (
                <span className="px-2 py-0.5 rounded bg-brand/10 text-brand border border-brand/20">
                  Diffuse
                </span>
              )}
              {!mat.hasNormal && !mat.hasDiffuse && (
                <span className="px-2 py-0.5 rounded bg-stroke text-body">
                  Solid color
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
