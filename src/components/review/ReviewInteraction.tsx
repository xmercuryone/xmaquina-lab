import SectionHeading from "./SectionHeading";
import CodeBlock from "./CodeBlock";

const MOUSE_CODE = `// Mouse → rotation mapping
const handlePointerMove = (e: React.PointerEvent) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;  // -1 to 1
  const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;   // -1 to 1
  setMouse({ x, y });
};

// In useEffect:
targetRotation.y = mouseX * 25 * (Math.PI / 180);  // ±25°
targetRotation.x = -mouseY * 15 * (Math.PI / 180);  // ±15°`;

const LERP_CODE = `// Lerp interpolation per frame
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// useFrame callback:
const speed = isHovering ? 0.08 : 0.04;
currentRotation.x = lerp(currentRotation.x, targetRotation.x, speed);
currentRotation.y = lerp(currentRotation.y, targetRotation.y, speed);
groupRef.current.rotation.x = currentRotation.x;
groupRef.current.rotation.y = currentRotation.y;`;

export default function ReviewInteraction() {
  return (
    <section className="py-16">
      <SectionHeading
        number={6}
        title="Interaction Model"
        subtitle="Mouse position drives card rotation via lerp interpolation"
      />

      {/* Rotation range diagram */}
      <div className="flex flex-col lg:flex-row gap-8 mb-10">
        <div className="flex-1 rounded-lg border border-stroke p-6 bg-dark-gray">
          <h4 className="text-white text-sm font-medium mb-4">Rotation Ranges</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-body mb-1">
                <span>Horizontal (Y axis)</span>
                <span className="text-white">-25° to +25°</span>
              </div>
              <div className="relative h-3 rounded-full bg-stroke">
                <div className="absolute inset-y-0 left-1/4 right-1/4 rounded-full bg-brand/30" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand" />
              </div>
              <div className="flex justify-between text-[10px] text-body mt-1">
                <span>-25°</span>
                <span>0°</span>
                <span>+25°</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-body mb-1">
                <span>Vertical (X axis)</span>
                <span className="text-white">-15° to +15°</span>
              </div>
              <div className="relative h-3 rounded-full bg-stroke">
                <div className="absolute inset-y-0 left-[30%] right-[30%] rounded-full bg-brand/30" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand" />
              </div>
              <div className="flex justify-between text-[10px] text-body mt-1">
                <span>-15°</span>
                <span>0°</span>
                <span>+15°</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-lg border border-stroke p-6 bg-dark-gray">
          <h4 className="text-white text-sm font-medium mb-4">Lerp Speeds</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-sm">Hover (active)</div>
                <div className="text-body text-xs">Card follows mouse quickly</div>
              </div>
              <div className="text-brand text-lg font-medium">0.08</div>
            </div>
            <div className="h-px bg-stroke" />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-sm">Idle (return)</div>
                <div className="text-body text-xs">Card drifts back to center slowly</div>
              </div>
              <div className="text-body text-lg font-medium">0.04</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-stroke text-xs text-body">
            Higher lerp = snappier response. Lower lerp = floaty, organic feel.
            The 2:1 ratio gives responsive tracking with graceful return.
          </div>
        </div>
      </div>

      {/* Code snippets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CodeBlock label="Mouse-to-rotation mapping" code={MOUSE_CODE} />
        <CodeBlock label="Lerp interpolation (per frame)" code={LERP_CODE} />
      </div>
    </section>
  );
}
