"use client";

import React, { useRef, useState, useEffect } from "react";

interface BreakerProps {
  intensity?: number;
  isTouring?: boolean;
}

export function Breaker({ isTouring = false }: BreakerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [switchesState, setSwitchesState] = useState([true, true, true]);

  useEffect(() => {
    if (!isTouring) return;
    let animId: number;
    const start = performance.now();
    const loop = (t: number) => {
      const elapsed = (t - start) / 1000;
      const s1 = Math.sin(elapsed * 2) > -0.3;
      const s2 = Math.sin(elapsed * 2 + 1.2) > -0.1;
      const s3 = Math.sin(elapsed * 2 + 2.4) > 0.1;
      setSwitchesState([s1, s2, s3]);
      setPointerOffset({
        x: Math.sin(elapsed * 2) * 8,
        y: Math.cos(elapsed * 2) * 5,
      });
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isTouring]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isTouring) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setPointerOffset({ x: nx * 12, y: ny * 8 });
  };

  const toggleSwitch = (index: number) => {
    setSwitchesState((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const allClosed = switchesState.every(Boolean);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (!isTouring) setPointerOffset({ x: 0, y: 0 });
      }}
      className="relative flex aspect-[5/4] max-h-[460px] w-full cursor-crosshair items-center justify-center overflow-hidden bg-white select-none"
    >
      <div className="absolute top-4 right-5 font-mono text-[11px] tracking-wider text-slate-400 select-none">
        {allClosed ? "CIRCUITS CLOSED" : "TRIP FAULT"}
      </div>

      <svg
        viewBox="0 0 540 400"
        className="h-full w-full fill-none stroke-slate-900"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Isometric Breaker Casing */}
        <g
          className="transition-transform duration-200"
          style={{
            transform: `translate(${pointerOffset.x * 0.3}px, ${pointerOffset.y * 0.3}px)`,
          }}
        >
          <path d="M 270 60 L 440 158 L 270 256 L 100 158 Z" className="fill-white" />
          <path d="M 100 158 L 100 238 L 270 336 L 270 256" />
          <path d="M 440 158 L 440 238 L 270 336" />
          <path d="M 270 95 L 400 170 L 270 245 L 140 170 Z" strokeDasharray="3 3" opacity="0.25" />
        </g>

        {/* Bus Bars & Continuity Rails */}
        <g
          className="transition-transform duration-300"
          style={{
            transform: `translate(${pointerOffset.x * 0.5}px, ${pointerOffset.y * 0.5}px)`,
          }}
        >
          <path d="M 180 170 L 270 118 L 360 170" strokeDasharray="3 3" opacity="0.35" />
          <path d="M 180 205 L 270 153 L 360 205" strokeDasharray="3 3" opacity="0.35" />
        </g>

        {/* 3 Parallel Breaker Switches */}
        {[
          { x: 220, y: 195, id: 0, label: "MAIN" },
          { x: 270, y: 166, id: 1, label: "AUX 1" },
          { x: 320, y: 195, id: 2, label: "AUX 2" },
        ].map((sw) => {
          const isClosed = switchesState[sw.id];
          return (
            <g
              key={sw.id}
              onClick={() => toggleSwitch(sw.id)}
              className="cursor-pointer transition-transform duration-300"
              style={{
                transform: `translate(${pointerOffset.x * 0.8}px, ${
                  (isClosed ? 0 : 10) + pointerOffset.y * 0.8
                }px)`,
              }}
            >
              <path
                d={`M ${sw.x - 25} ${sw.y + 12} L ${sw.x} ${sw.y} L ${sw.x + 25} ${sw.y + 12}`}
              />

              <line
                x1={sw.x}
                y1={sw.y}
                x2={isClosed ? sw.x : sw.x + 18}
                y2={isClosed ? sw.y - 30 : sw.y - 16}
                strokeWidth="1.8"
                className={isClosed ? "stroke-emerald-600" : "stroke-rose-600"}
              />

              <circle
                cx={isClosed ? sw.x : sw.x + 18}
                cy={isClosed ? sw.y - 30 : sw.y - 16}
                r="3"
                className={isClosed ? "fill-emerald-100" : "fill-rose-100"}
              />
            </g>
          );
        })}
      </svg>

      <div className="absolute right-5 bottom-3 left-5 flex items-center justify-between font-mono text-[11px] text-slate-400 select-none">
        <span>CLICK SWITCHES TO TOGGLE</span>
        <span>05 · Circuit Breaker</span>
      </div>
    </div>
  );
}
