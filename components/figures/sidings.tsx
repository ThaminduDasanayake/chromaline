"use client";

import React, { useRef, useState, useEffect } from "react";

interface SidingsProps {
  intensity?: number;
  isTouring?: boolean;
}

export function Sidings({ intensity = 100, isTouring = false }: SidingsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLane, setActiveLane] = useState<number>(3);

  // Auto-tour cycle
  useEffect(() => {
    if (!isTouring) return;
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % 4;
      setActiveLane(index);
    }, 1200);
    return () => clearInterval(interval);
  }, [isTouring]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const lane = Math.min(3, Math.max(0, Math.floor(ny * 4)));
    setActiveLane(lane);
  };

  const factor = intensity / 100;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full aspect-[5/4] max-h-[460px] flex items-center justify-center select-none cursor-crosshair overflow-hidden bg-white"
    >
      <div className="absolute top-4 right-5 text-[11px] font-mono tracking-wider text-slate-400 select-none">
        {`TRACK ${activeLane + 1} CHECKED OUT`}
      </div>

      <svg
        viewBox="0 0 540 400"
        className="w-full h-full stroke-slate-900 fill-none"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Isometric Trackbed Slab Base */}
        <g>
          <path
            d="M 270 90 L 470 205 L 320 292 L 120 176 Z"
            className="fill-white"
            opacity="0.95"
          />
          <path d="M 120 176 L 120 200 L 320 316 L 320 292 Z" />
          <path d="M 320 292 L 320 316 L 470 229 L 470 205 Z" />
        </g>

        {/* Railway Ties & Sleepers */}
        <g opacity="0.3" strokeDasharray="1 2">
          {Array.from({ length: 14 }).map((_, step) => {
            const rx = 160 + step * 20 * 0.866;
            const ry = 160 + step * 20 * 0.5;
            return (
              <line
                key={step}
                x1={rx}
                y1={ry}
                x2={rx + 110 * 0.866}
                y2={ry - 110 * 0.5}
              />
            );
          })}
        </g>

        {/* 4 Parallel Railway Tracks with Switch Curves on Left */}
        {Array.from({ length: 4 }).map((_, laneIdx) => {
          const isSelected = activeLane === laneIdx;
          const startX = 170 + laneIdx * 16;
          const startY = 145 + laneIdx * 20;

          return (
            <g key={laneIdx} className="transition-all duration-300">
              <path
                d={`M ${startX} ${startY} Q ${startX + 50} ${startY + 28} ${
                  startX + 180
                } ${startY + 28 - 70}`}
                opacity={isSelected ? "0.9" : "0.3"}
                strokeWidth={isSelected ? "1.5" : "1.1"}
              />
              <path
                d={`M ${startX + 10} ${startY + 5} Q ${startX + 60} ${
                  startY + 33
                } ${startX + 190} ${startY + 33 - 70}`}
                opacity={isSelected ? "0.9" : "0.3"}
                strokeWidth={isSelected ? "1.5" : "1.1"}
              />

              {/* Wagons on this track */}
              {Array.from({ length: 4 }).map((_, wagonIdx) => {
                const isLeadingWagon = wagonIdx === 3;
                const lift = isSelected ? -(26 + wagonIdx * 8) * factor : 0;

                const wx = startX + 75 + wagonIdx * 32 * 0.866;
                const wy = startY + 12 - wagonIdx * 32 * 0.5 + lift;

                const wLen = 22;
                const wW = 14;
                const wH = isLeadingWagon ? 36 : 24;

                return (
                  <g
                    key={wagonIdx}
                    className="transition-transform duration-300 ease-out"
                  >
                    {/* Shadow on track when lifted */}
                    {isSelected && (
                      <ellipse
                        cx={wx + 10}
                        cy={startY + 12 - wagonIdx * 16 + 18}
                        rx="12"
                        ry="4"
                        opacity="0.08"
                        className="fill-slate-900"
                      />
                    )}

                    {/* Top Face */}
                    <path
                      d={`
                        M ${wx} ${wy - wH}
                        L ${wx + wW * 0.866} ${wy - wH - wW * 0.5}
                        L ${wx + (wW + wLen) * 0.866} ${wy - wH - (wW - wLen) * 0.5}
                        L ${wx + wLen * 0.866} ${wy - wH + wLen * 0.5}
                        Z
                      `}
                      className={isSelected && isLeadingWagon ? "fill-purple-50" : "fill-white"}
                      strokeWidth={isSelected && isLeadingWagon ? "1.6" : "1.25"}
                    />

                    {/* Front-Left Face */}
                    <path
                      d={`
                        M ${wx} ${wy - wH}
                        L ${wx + wLen * 0.866} ${wy - wH + wLen * 0.5}
                        L ${wx + wLen * 0.866} ${wy + wLen * 0.5}
                        L ${wx} ${wy}
                        Z
                      `}
                      className="fill-white"
                    />

                    {/* Front-Right Face */}
                    <path
                      d={`
                        M ${wx + wLen * 0.866} ${wy - wH + wLen * 0.5}
                        L ${wx + (wW + wLen) * 0.866} ${wy - wH - (wW - wLen) * 0.5}
                        L ${wx + (wW + wLen) * 0.866} ${wy - (wW - wLen) * 0.5}
                        L ${wx + wLen * 0.866} ${wy + wLen * 0.5}
                        Z
                      `}
                      className="fill-white"
                    />

                    {wagonIdx < 3 && (
                      <circle
                        cx={wx + wLen * 0.866 + 4}
                        cy={wy + wLen * 0.5 - 4}
                        r="1.2"
                        className="fill-slate-500"
                      />
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-3 left-5 right-5 flex justify-between items-center text-[11px] font-mono text-slate-400 select-none">
        <span>POINT TRACKS · ↑ ↓</span>
        <span>03 · Rail Branch</span>
      </div>
    </div>
  );
}
