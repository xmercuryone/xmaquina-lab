import { useCallback, useRef } from "react";
import "./Crate3D.css";

interface Crate3DProps {
  size?: number;
}

const FACES = ["front", "back", "top", "bottom", "left", "right"] as const;

export default function Crate3D({ size = 220 }: Crate3DProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = sceneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", mx.toFixed(3));
    el.style.setProperty("--my", my.toFixed(3));
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = sceneRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "0.5");
    el.style.setProperty("--my", "0.5");
  }, []);

  return (
    <div
      ref={sceneRef}
      className="crate-scene"
      style={{ "--crate-size": `${size}px` } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="crate-body">
        {FACES.map((face) => (
          <div key={face} className={`crate-face ${face}`}>
            <div className="face-holo" />
            <div className="face-glare" />
          </div>
        ))}
      </div>
    </div>
  );
}
