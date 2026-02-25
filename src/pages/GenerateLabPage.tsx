import { useState } from "react";

/* ── All available source images ── */

interface SourceImage {
  id: string;
  path: string;
  label: string;
  group: "reference" | "era3d" | "era3d-normal" | "processed";
  description: string;
}

const SOURCES: SourceImage[] = [
  // Original reference photos
  {
    id: "standing-front",
    path: "/assets/robots/apollo/photos/apollo-standing-front.png",
    label: "Standing Front",
    group: "reference",
    description: "Full body, 3/4 front, white BG — our best single input",
  },
  {
    id: "back-battery",
    path: "/assets/robots/apollo/photos/apollo-back-battery.png",
    label: "Back Battery",
    group: "reference",
    description: "Upper body back, black BG — mechanical detail visible",
  },
  {
    id: "back-clean",
    path: "/assets/robots/apollo/photos/apollo-back-clean.png",
    label: "Back Clean",
    group: "processed",
    description: "Back battery with black BG removed, white BG, upper body only",
  },
  {
    id: "hero-shot",
    path: "/assets/robots/apollo/photos/apollo-hero-shot.png",
    label: "Hero Shot",
    group: "reference",
    description: "Head/shoulders close-up, white BG",
  },
  {
    id: "pedestal-front",
    path: "/assets/robots/apollo/photos/apollo-pedestal-front.png",
    label: "Pedestal Front",
    group: "processed",
    description: "Cropped front from pedestal image, torso on stand",
  },
  {
    id: "pedestal-back",
    path: "/assets/robots/apollo/photos/apollo-pedestal-back.png",
    label: "Pedestal Back",
    group: "processed",
    description: "Cropped back from pedestal — has arm bleed artifact",
  },
  {
    id: "front-square",
    path: "/assets/robots/apollo/photos/apollo-front-square-1024.png",
    label: "Front Square 1024",
    group: "processed",
    description: "Square crop of standing front, 1024x1024 — Era3D input",
  },

  // Era3D multi-view outputs
  {
    id: "era3d-0",
    path: "/assets/robots/apollo/multiview/images-0.png",
    label: "Era3D — Front 3/4",
    group: "era3d",
    description: "View 0: front 3/4 angle, consistent framing",
  },
  {
    id: "era3d-1",
    path: "/assets/robots/apollo/multiview/images-1.png",
    label: "Era3D — Right Side",
    group: "era3d",
    description: "View 1: right side profile — has floating hand artifact",
  },
  {
    id: "era3d-2",
    path: "/assets/robots/apollo/multiview/images-2.png",
    label: "Era3D — Back 3/4 R",
    group: "era3d",
    description: "View 2: back 3/4 right — has floating hand artifact",
  },
  {
    id: "era3d-3",
    path: "/assets/robots/apollo/multiview/images-3.png",
    label: "Era3D — Back 3/4 L",
    group: "era3d",
    description: "View 3: back 3/4 left — cleanest back view",
  },
  {
    id: "era3d-4",
    path: "/assets/robots/apollo/multiview/images-4.png",
    label: "Era3D — Left Side",
    group: "era3d",
    description: "View 4: left side profile — has floating hand artifact",
  },
  {
    id: "era3d-5",
    path: "/assets/robots/apollo/multiview/images-5.png",
    label: "Era3D — Front",
    group: "era3d",
    description: "View 5: direct front — has floating hand artifact",
  },

  // Era3D normal maps
  {
    id: "era3d-n0",
    path: "/assets/robots/apollo/multiview/normal_images-0.png",
    label: "Normal — Front 3/4",
    group: "era3d-normal",
    description: "Normal map for view 0",
  },
  {
    id: "era3d-n1",
    path: "/assets/robots/apollo/multiview/normal_images-1.png",
    label: "Normal — Right Side",
    group: "era3d-normal",
    description: "Normal map for view 1",
  },
  {
    id: "era3d-n2",
    path: "/assets/robots/apollo/multiview/normal_images-2.png",
    label: "Normal — Back 3/4 R",
    group: "era3d-normal",
    description: "Normal map for view 2",
  },
  {
    id: "era3d-n3",
    path: "/assets/robots/apollo/multiview/normal_images-3.png",
    label: "Normal — Back 3/4 L",
    group: "era3d-normal",
    description: "Normal map for view 3",
  },
  {
    id: "era3d-n4",
    path: "/assets/robots/apollo/multiview/normal_images-4.png",
    label: "Normal — Left Side",
    group: "era3d-normal",
    description: "Normal map for view 4",
  },
  {
    id: "era3d-n5",
    path: "/assets/robots/apollo/multiview/normal_images-5.png",
    label: "Normal — Front",
    group: "era3d-normal",
    description: "Normal map for view 5",
  },
];

const GROUP_LABELS: Record<string, string> = {
  reference: "Original Reference Photos",
  processed: "Processed / Cleaned",
  era3d: "Era3D Multi-View Outputs",
  "era3d-normal": "Era3D Normal Maps",
};

const GROUP_ORDER = ["reference", "processed", "era3d", "era3d-normal"];

/* ── Image Card ── */

function ImageCard({
  image,
  selected,
  order,
  onToggle,
  onPreview,
}: {
  image: SourceImage;
  selected: boolean;
  order: number | null;
  onToggle: () => void;
  onPreview: () => void;
}) {
  return (
    <div
      className={`relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
        selected
          ? "border-white/60 ring-2 ring-white/20"
          : "border-white/5 hover:border-white/20"
      }`}
      onClick={onToggle}
    >
      {/* Selection badge */}
      {order !== null && (
        <div className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">
          {order}
        </div>
      )}

      {/* Expand button */}
      <button
        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/60 text-white/80 flex items-center justify-center text-xs hover:bg-black/80 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onPreview();
        }}
        title="Preview full size"
      >
        +
      </button>

      {/* Image */}
      <div className="aspect-square bg-white/5">
        <img
          src={image.path}
          alt={image.label}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Label */}
      <div className="p-2">
        <p className="text-white text-xs font-medium truncate">{image.label}</p>
        <p className="text-white/40 text-[10px] leading-tight mt-0.5">
          {image.description}
        </p>
      </div>
    </div>
  );
}

/* ── Preview Modal ── */

function PreviewModal({
  image,
  onClose,
}: {
  image: SourceImage;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.path}
          alt={image.label}
          className="max-h-[80vh] object-contain rounded-lg"
        />
        <div className="mt-3 text-center">
          <p className="text-white text-sm font-medium">{image.label}</p>
          <p className="text-white/50 text-xs">{image.description}</p>
        </div>
        <button
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
          onClick={onClose}
        >
          x
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ── */

export default function GenerateLabPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [preview, setPreview] = useState<SourceImage | null>(null);
  const [seed, setSeed] = useState("777");
  const [mode, setMode] = useState<"concat" | "fuse">("concat");

  const toggleImage = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 5) return prev; // Rodin max 5 images
      return [...prev, id];
    });
  };

  const getOrder = (id: string): number | null => {
    const idx = selected.indexOf(id);
    return idx >= 0 ? idx + 1 : null;
  };

  const selectedImages = selected
    .map((id) => SOURCES.find((s) => s.id === id))
    .filter(Boolean) as SourceImage[];

  const generateCommand = `node scripts/generate-apollo.mjs ${
    selected.length > 0 ? "v-new" : "?"
  } ${seed}`;

  return (
    <div className="flex-1 flex flex-col py-8 gap-6 overflow-y-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-[32px] font-normal leading-[1.1] tracking-tight text-white">
          Generation Lab
        </h1>
        <p className="text-body text-sm max-w-2xl">
          Select up to 5 images to feed into Rodin Gen-2. Order matters — the
          first image sets the primary material reference. Click images to
          select, click + to preview full size.
        </p>
      </div>

      {/* Selection summary + config */}
      <div className="flex flex-wrap gap-4 items-start">
        {/* Selected images strip */}
        <div className="flex-1 min-w-[300px]">
          <p className="text-white/40 text-[11px] uppercase tracking-wider mb-2">
            Selected ({selected.length}/5)
          </p>
          {selected.length === 0 ? (
            <p className="text-white/20 text-sm">
              Click images below to select inputs
            </p>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {selectedImages.map((img, i) => (
                <div
                  key={img.id}
                  className="relative w-16 h-16 rounded border border-white/20 overflow-hidden group cursor-pointer"
                  onClick={() => toggleImage(img.id)}
                >
                  <img
                    src={img.path}
                    alt={img.label}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white text-black flex items-center justify-center text-[9px] font-bold">
                    {i + 1}
                  </div>
                  <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/30 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 text-xs">
                      x
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Config */}
        <div className="flex gap-4 items-end">
          <div>
            <p className="text-white/40 text-[11px] uppercase tracking-wider mb-1">
              Seed
            </p>
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              className="w-24 px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
            />
          </div>
          <div>
            <p className="text-white/40 text-[11px] uppercase tracking-wider mb-1">
              Mode
            </p>
            <div className="flex">
              {(["concat", "fuse"] as const).map((m) => (
                <button
                  key={m}
                  className={`px-3 py-2 text-sm transition-colors ${
                    mode === m
                      ? "bg-white/10 text-white border border-white/20"
                      : "text-white/40 border border-white/5 hover:text-white/60"
                  } ${m === "concat" ? "rounded-l" : "rounded-r"}`}
                  onClick={() => setMode(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generation command */}
      {selected.length > 0 && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-white/40 text-[11px] uppercase tracking-wider mb-2">
            Generation Config
          </p>
          <div className="text-white/60 text-xs space-y-1 font-mono">
            <p>
              <span className="text-white/30">images:</span>{" "}
              {selectedImages.map((img) => img.label).join(", ")}
            </p>
            <p>
              <span className="text-white/30">mode:</span> {mode}
            </p>
            <p>
              <span className="text-white/30">seed:</span> {seed}
            </p>
            <p>
              <span className="text-white/30">paths:</span>
            </p>
            {selectedImages.map((img) => (
              <p key={img.id} className="pl-4 text-white/40">
                {img.path}
              </p>
            ))}
          </div>
          <p className="text-white/30 text-[10px] mt-3">
            Copy the paths above to update{" "}
            <code className="text-white/50">scripts/generate-apollo.mjs</code>{" "}
            REFERENCE_PHOTOS and run the generation.
          </p>
        </div>
      )}

      {/* Image grid by group */}
      {GROUP_ORDER.map((groupKey) => {
        const images = SOURCES.filter((s) => s.group === groupKey);
        return (
          <div key={groupKey}>
            <p className="text-white/40 text-[11px] uppercase tracking-wider mb-3">
              {GROUP_LABELS[groupKey]}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {images.map((img) => (
                <ImageCard
                  key={img.id}
                  image={img}
                  selected={selected.includes(img.id)}
                  order={getOrder(img.id)}
                  onToggle={() => toggleImage(img.id)}
                  onPreview={() => setPreview(img)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Preview modal */}
      {preview && (
        <PreviewModal image={preview} onClose={() => setPreview(null)} />
      )}
    </div>
  );
}
