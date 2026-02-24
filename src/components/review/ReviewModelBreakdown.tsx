import SectionHeading from "./SectionHeading";
import MeshViewer from "./MeshViewer";

const MESHES = [
  {
    name: "card_front",
    label: "card_front",
    stats: { vertices: 201, triangles: 320, material: "Material_0", purpose: "Front face with diffuse + normal" },
  },
  {
    name: "card_back",
    label: "card_back",
    stats: { vertices: 201, triangles: 320, material: "Material_1", purpose: "Back face with diffuse + normal" },
  },
  {
    name: "case",
    label: "case",
    stats: { vertices: 3456, triangles: 6912, material: "Node (gold)", purpose: "Protective shell around card" },
  },
  {
    name: "case_logo_left",
    label: "case_logo_left",
    stats: { vertices: 1266, triangles: 422, material: "STL_material", purpose: "Left embossed logo on case" },
  },
  {
    name: "case_logo_right",
    label: "case_logo_right",
    stats: { vertices: 1266, triangles: 422, material: "STL_material", purpose: "Right embossed logo on case" },
  },
];

export default function ReviewModelBreakdown() {
  return (
    <section className="py-16">
      <SectionHeading
        number={3}
        title="3D Model Breakdown"
        subtitle="5 meshes composing the card — each isolated with auto-rotate"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MESHES.map((mesh) => (
          <MeshViewer
            key={mesh.name}
            meshName={mesh.name}
            label={mesh.label}
            stats={mesh.stats}
            height={220}
          />
        ))}
      </div>
    </section>
  );
}
