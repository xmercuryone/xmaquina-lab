import { useCallback, useEffect, useRef, useState } from "react";
import "./HoloCard.css";

/* ── Spring physics (ported from simeydotme/pokemon-cards-css) ── */

interface SpringValue {
  x: number;
  y: number;
  o?: number;
}

function createSpring(initial: SpringValue, stiffness = 0.066, damping = 0.25) {
  let current = { ...initial };
  let target = { ...initial };
  let velocity = { x: 0, y: 0, o: 0 };

  return {
    set(t: Partial<SpringValue>, s?: number, d?: number) {
      target = { ...target, ...t };
      if (s !== undefined) stiffness = s;
      if (d !== undefined) damping = d;
    },
    tick(): SpringValue {
      for (const k of ["x", "y", "o"] as const) {
        if (target[k] === undefined) continue;
        const delta = target[k]! - (current[k] ?? 0);
        velocity[k] = velocity[k] * (1 - damping) + delta * stiffness;
        current[k] = (current[k] ?? 0) + velocity[k];
      }
      return { ...current };
    },
    get: () => ({ ...current }),
  };
}

const clamp = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v: number, p = 3) => parseFloat(v.toFixed(p));
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number) =>
  round(tMin + (tMax - tMin) * (v - fMin) / (fMax - fMin));

/* ── Component ── */

interface HoloCardProps {
  img: string;
  alt?: string;
  width?: number;
}

export default function HoloCard({ img, alt = "Card", width = 300 }: HoloCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [interacting, setInteracting] = useState(false);
  const rafRef = useRef<number>(0);

  const springRotate = useRef(createSpring({ x: 0, y: 0 }));
  const springGlare = useRef(createSpring({ x: 50, y: 50, o: 0 }));
  const springBg = useRef(createSpring({ x: 50, y: 50 }));

  // Animation loop — update CSS vars from springs
  const animate = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;

    const rot = springRotate.current.tick();
    const glare = springGlare.current.tick();
    const bg = springBg.current.tick();

    const fromCenter = clamp(
      Math.sqrt(
        (glare.y - 50) * (glare.y - 50) +
        (glare.x - 50) * (glare.x - 50)
      ) / 50, 0, 1
    );

    el.style.setProperty("--rotate-x", `${rot.x}deg`);
    el.style.setProperty("--rotate-y", `${rot.y}deg`);
    el.style.setProperty("--pointer-x", `${glare.x}%`);
    el.style.setProperty("--pointer-y", `${glare.y}%`);
    el.style.setProperty("--pointer-from-center", `${fromCenter}`);
    el.style.setProperty("--pointer-from-top", `${glare.y / 100}`);
    el.style.setProperty("--pointer-from-left", `${glare.x / 100}`);
    el.style.setProperty("--card-opacity", `${glare.o ?? 0}`);
    el.style.setProperty("--background-x", `${bg.x}%`);
    el.style.setProperty("--background-y", `${bg.y}%`);

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const abs = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    const pct = {
      x: clamp(round((100 / rect.width) * abs.x)),
      y: clamp(round((100 / rect.height) * abs.y)),
    };
    const center = { x: pct.x - 50, y: pct.y - 50 };

    setInteracting(true);

    springRotate.current.set({ x: round(-(center.x / 3.5)), y: round(center.y / 3.5) }, 0.066, 0.25);
    springGlare.current.set({ x: round(pct.x), y: round(pct.y), o: 1 }, 0.066, 0.25);
    springBg.current.set({
      x: adjust(pct.x, 0, 100, 37, 63),
      y: adjust(pct.y, 0, 100, 33, 67),
    }, 0.066, 0.25);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setInteracting(false);
    springRotate.current.set({ x: 0, y: 0 }, 0.01, 0.06);
    springGlare.current.set({ x: 50, y: 50, o: 0 }, 0.01, 0.06);
    springBg.current.set({ x: 50, y: 50 }, 0.01, 0.06);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`holo-card ${interacting ? "interacting" : ""}`}
      style={{ width }}
    >
      <div className="holo-card__translater">
        <div
          className="holo-card__rotator"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div className="holo-card__front">
            <img src={img} alt={alt} width={660} height={921} />
            <div className="holo-card__shine" />
            <div className="holo-card__glare" />
          </div>
        </div>
      </div>
    </div>
  );
}
