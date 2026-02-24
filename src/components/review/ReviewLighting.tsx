import SectionHeading from "./SectionHeading";

const LIGHTS = [
  { type: "Ambient", position: "—", intensity: 1.7, color: "#ffffff", label: "Global fill" },
  { type: "Spot", position: "[2, 3, 4]", intensity: 3.0, color: "#ffffff", label: "Top-right key" },
  { type: "Spot", position: "[-2, 3, 4]", intensity: 2.5, color: "#ffffff", label: "Top-left fill" },
  { type: "Spot", position: "[2, -2, 3]", intensity: 2.0, color: "#fff5e0", label: "Bottom-right warm" },
  { type: "Spot", position: "[-2, -2, 3]", intensity: 2.0, color: "#fff5e0", label: "Bottom-left warm" },
  { type: "RectArea", position: "[0, 0, 3]", intensity: 1.5, color: "#ffffff", label: "Front diffuse panel" },
  { type: "RectArea", position: "[0, 0, -3]", intensity: 0.8, color: "#ffe8c0", label: "Back warm panel" },
];

/* Positions for the top-down diagram (CSS pixel offsets) */
const LIGHT_POSITIONS: Record<string, { top: string; left: string }> = {
  "Top-right key": { top: "15%", left: "72%" },
  "Top-left fill": { top: "15%", left: "28%" },
  "Bottom-right warm": { top: "75%", left: "72%" },
  "Bottom-left warm": { top: "75%", left: "28%" },
  "Front diffuse panel": { top: "45%", left: "50%" },
  "Back warm panel": { top: "55%", left: "50%" },
};

export default function ReviewLighting() {
  return (
    <section className="py-16">
      <SectionHeading
        number={5}
        title="Lighting Setup"
        subtitle="7 lights create the multi-point reflection that sells the holographic effect"
      />

      {/* Top-down diagram */}
      <div className="relative mx-auto max-w-lg aspect-square mb-10 rounded-lg border border-stroke bg-[#0a0a0c] overflow-hidden">
        {/* Card silhouette at center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-24 rounded border-2 border-stroke bg-dark-gray flex items-center justify-center">
          <span className="text-[10px] text-body">Card</span>
        </div>

        {/* Light indicators */}
        {LIGHTS.filter((l) => l.type !== "Ambient").map((light) => {
          const pos = LIGHT_POSITIONS[light.label];
          if (!pos) return null;
          return (
            <div
              key={light.label}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
              style={{ top: pos.top, left: pos.left }}
            >
              <div
                className="w-4 h-4 rounded-full border-2 border-white/30"
                style={{ backgroundColor: light.color, boxShadow: `0 0 12px ${light.color}88` }}
              />
              <span className="text-[9px] text-body whitespace-nowrap">{light.label}</span>
            </div>
          );
        })}

        {/* Ambient indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white/20 border border-white/30" />
          <span className="text-[9px] text-body">Ambient (1.7)</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stroke text-body text-left">
              <th className="py-2 pr-4 font-medium">Type</th>
              <th className="py-2 pr-4 font-medium">Position</th>
              <th className="py-2 pr-4 font-medium">Intensity</th>
              <th className="py-2 pr-4 font-medium">Color</th>
              <th className="py-2 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {LIGHTS.map((light, i) => (
              <tr key={i} className="border-b border-stroke/50">
                <td className="py-2 pr-4 text-white">{light.type}</td>
                <td className="py-2 pr-4 text-body font-mono text-xs">{light.position}</td>
                <td className="py-2 pr-4 text-white">{light.intensity}</td>
                <td className="py-2 pr-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full border border-stroke"
                      style={{ backgroundColor: light.color }}
                    />
                    <span className="text-body text-xs font-mono">{light.color}</span>
                  </div>
                </td>
                <td className="py-2 text-body">{light.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
