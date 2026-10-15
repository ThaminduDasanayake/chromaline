"use client";

import React, { useRef, useState, useEffect } from "react";

interface ExplodedProps {
  intensity?: number;
  isTouring?: boolean;
}

export function Exploded({ intensity = 100, isTouring = false }: ExplodedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lift, setLift] = useState(0.2);

  useEffect(() => {
    if (!isTouring) return;
    let animId: number;
    const start = performance.now();
    const loop = (t: number) => {
      const elapsed = (t - start) / 1000;
      const progress = 0.5 + 0.45 * Math.sin(elapsed * 2.2);
      setLift(progress);
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
    const dist = Math.sqrt(nx * nx + ny * ny);
    const newLift = Math.max(0, Math.min(1, 1 - dist * 1.6));
    setLift(newLift);
  };

  const handleMouseLeave = () => {
    if (!isTouring) setLift(0.2);
  };

  const factor = (intensity / 100) * lift;
  const topLayerY = -54 * factor;
  const midLayerY = -26 * factor;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[5/4] max-h-[460px] flex items-center justify-center select-none cursor-crosshair overflow-hidden bg-white"
    >
      <div className="absolute top-4 right-5 text-[11px] font-mono tracking-wider text-slate-400 select-none">
        {`SEPARATION: ${Math.round(lift * 100)}%`}
      </div>

      <svg
        viewBox="0 0 540 400"
        className="w-full h-full stroke-slate-900 fill-none"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Isometric Grid Floor */}
        <g opacity="0.1" strokeDasharray="2 3">
          {Array.from({ length: 9 }).map((_, r) => {
            const rx = 140 + r * 28 * 0.866;
            const ry = 180 + r * 28 * 0.5;
            return (
              <line
                key={`r-${r}`}
                x1={rx}
                y1={ry}
                x2={rx + 160 * 0.866}
                y2={ry - 160 * 0.5}
              />
            );
          })}
          {Array.from({ length: 9 }).map((_, c) => {
            const cx = 280 - c * 20 * 0.866;
            const cy = 90 + c * 20 * 0.5;
            return (
              <line
                key={`c-${c}`}
                x1={cx}
                y1={cy}
                x2={cx + 180 * 0.866}
                y2={cy + 180 * 0.5}
              />
            );
          })}
        </g>

        {/* Alignment corner guides */}
        <g opacity="0.25" strokeDasharray="2 3">
          <line x1="205" y1={255 + topLayerY} x2="205" y2="255" />
          <line x1="335" y1={180 + topLayerY} x2="335" y2="180" />
          <line x1="335" y1={330 + topLayerY} x2="335" y2="330" />
          <line x1="465" y1={255 + topLayerY} x2="465" y2="255" />
        </g>

        {/* Layer 3 (Bottom Chassis / Shadow) */}
        <g>
          <path
            d="M 335 180 L 465 255 L 335 330 L 205 255 Z"
            className="fill-white"
            opacity="0.9"
          />
          <path d="M 205 255 L 205 265 L 335 340 L 465 265 L 465 255" opacity="0.35" />
          <path d="M 240 255 L 335 200 L 430 255 L 335 310 Z" strokeDasharray="3 3" opacity="0.25" />
        </g>

        {/* Layer 2 (Middle Framework / Data Plane) */}
        <g
          className="transition-transform duration-150 ease-out"
          style={{ transform: `translateY(${midLayerY}px)` }}
        >
          <path
            d="M 335 180 L 465 255 L 335 330 L 205 255 Z"
            className="fill-white"
            opacity="0.95"
          />
          <path d="M 205 255 L 205 262 L 335 337 L 465 262 L 465 255" opacity="0.35" />
          <line x1="265" y1="242" x2="335" y2="282" opacity="0.35" strokeDasharray="2 2" />
          <line x1="335" y1="282" x2="405" y2="242" opacity="0.35" strokeDasharray="2 2" />
          <circle cx="335" cy="282" r="2.5" className="fill-slate-400" />
        </g>

        {/* Layer 1 (Top Glass / Surface UI Window) */}
        <g
          className="transition-transform duration-100 ease-out"
          style={{ transform: `translateY(${topLayerY}px)` }}
        >
          <path
            d="M 335 180 L 465 255 L 335 330 L 205 255 Z"
            className="fill-white"
            strokeWidth="1.5"
          />
          <path d="M 205 255 L 205 264 L 335 339 L 465 264 L 465 255" />

          {/* Window Header Dots */}
          <circle cx="255" cy="235" r="1.5" className="fill-slate-600" />
          <circle cx="261" cy="238.5" r="1.5" className="fill-slate-600" />
          <circle cx="267" cy="242" r="1.5" className="fill-slate-600" />

          {/* Search bar pill */}
          <path d="M 280 248 L 335 216 L 365 233 L 310 265 Z" opacity="0.3" />

          {/* Content Pane Lines */}
          <line x1="240" y1="265" x2="305" y2="302" opacity="0.6" strokeWidth="1.5" />
          <line x1="250" y1="280" x2="310" y2="315" opacity="0.25" />
          <line x1="330" y1="255" x2="420" y2="203" opacity="0.25" />
          <line x1="340" y1="270" x2="430" y2="218" opacity="0.25" />
        </g>
      </svg>

      <div className="absolute bottom-3 left-5 right-5 flex justify-between items-center text-[11px] font-mono text-slate-400 select-none">
        <span>POINTER PROXIMITY · LIFT</span>
        <span>04 · Layer Stack</span>
      </div>
    </div>
  );
}
