import ApolloViewer3D from "../components/ApolloViewer3D";

const VERSIONS = [
  {
    id: "rodin-hp",
    label: "Rodin Gen-2 HighPack",
    description:
      "4K textures, high-poly mesh. Best detail. 53MB.",
    path: "/assets/robots/apollo/generations/bust/rodin-hp/apollo-bust-web.glb",
  },
  {
    id: "rodin",
    label: "Rodin Gen-2",
    description:
      "Standard — 500K triangles, 1K textures, PBR. 33MB.",
    path: "/assets/robots/apollo/generations/bust/rodin/apollo-bust-web.glb",
  },
  {
    id: "tripo25",
    label: "Tripo3D v2.5",
    description:
      "Tripo3D v2.5 — HD textures, PBR, 800K faces. Hero shot input. 24.2MB.",
    path: "/assets/robots/apollo/generations/bust/tripo25/apollo-bust.glb",
  },
  {
    id: "trellis",
    label: "Trellis",
    description:
      "Microsoft Trellis — voxel-based, fast (25s). Hero shot input. 2.2MB.",
    path: "/assets/robots/apollo/generations/bust/trellis/apollo-bust.glb",
  },
];

export default function BustPage({ version }: { version?: string }) {
  const v = VERSIONS.find((v) => v.id === version) || VERSIONS[0];

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0">
      {/* Left — 3D Viewer, full height */}
      <div className="flex-1 min-h-[500px] lg:min-h-0">
        <ApolloViewer3D width="100%" height="100%" modelPath={v.path} />
      </div>

      {/* Right — Info panel */}
      <div className="w-full lg:w-[380px] flex-shrink-0 flex flex-col gap-8 py-10 px-6 lg:px-10 lg:border-l border-stroke overflow-y-auto">
        <div className="space-y-3">
          <h1 className="text-[40px] font-normal leading-[1.05] tracking-tight text-white">
            APOLLO
            <br />
            BUST
          </h1>
          <p className="text-body text-sm leading-relaxed">
            High-detail 3D bust generated from the Apollo hero shot — head and
            upper torso with A1 chest display, visor, and red accent stripe.
          </p>
        </div>

        {/* Source image */}
        <div className="space-y-2">
          <p className="text-white/40 text-[11px] uppercase tracking-wider">
            Source Image
          </p>
          <img
            src="/assets/robots/apollo/photos/apollo-bust-square-1024.png"
            alt="Apollo hero shot"
            className="w-full rounded-lg border border-white/10"
          />
        </div>

        {/* Version selector */}
        <div className="space-y-3">
          <p className="text-white/40 text-[11px] uppercase tracking-wider">
            3D Model Engine
          </p>
          <div className="flex flex-col gap-2">
            {VERSIONS.map((ver) => (
              <a
                key={ver.id}
                href={`#/bust/${ver.id}`}
                className={`px-4 py-3 rounded-lg text-sm transition-colors ${
                  ver.id === v.id
                    ? "bg-white/10 text-white border border-white/20"
                    : "text-white/50 border border-white/5 hover:text-white/80 hover:border-white/10"
                }`}
              >
                <span className="font-medium">{ver.label}</span>
                <p className="text-[11px] mt-1 opacity-60">{ver.description}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
