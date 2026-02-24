import ApolloViewer3D from "../components/ApolloViewer3D";

const VERSIONS = [
  {
    id: "v2",
    label: "V2 — Single Front Photo",
    description:
      "1 reference image (standing front, white BG). Best proportions, back is hallucinated.",
    path: "/assets/robots/apollo/generations/v2-single-front/apollo-web.glb",
  },
  {
    id: "v3",
    label: "V3 — Front + Back",
    description:
      "2 reference images (standing front + pedestal back crop). Better back accuracy, slight proportion shift.",
    path: "/assets/robots/apollo/generations/v3-front-back/apollo-web.glb",
  },
];

const SPECS = [
  { label: "Height", value: '5\'8"' },
  { label: "Weight", value: "160 lbs" },
  { label: "Payload", value: "55 lbs" },
  { label: "DOF", value: "36" },
  { label: "Battery", value: "4 hours" },
  { label: "Walk Speed", value: "1.4 m/s" },
];

export default function ApolloPage({ version }: { version?: string }) {
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
            APPTRONIK
            <br />
            APOLLO
          </h1>
          <p className="text-body text-sm leading-relaxed">
            General-purpose humanoid robot designed for commercial deployment in
            manufacturing, logistics, and retail environments.
          </p>
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {SPECS.map((s) => (
            <div key={s.label}>
              <p className="text-white/40 text-[11px] uppercase tracking-wider">
                {s.label}
              </p>
              <p className="text-white text-sm">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Version selector */}
        <div className="space-y-3">
          <p className="text-white/40 text-[11px] uppercase tracking-wider">
            3D Model Version
          </p>
          <div className="flex flex-col gap-2">
            {VERSIONS.map((ver) => (
              <a
                key={ver.id}
                href={`#/apollo/${ver.id}`}
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
