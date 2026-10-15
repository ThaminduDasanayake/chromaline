"use client";

import React, { useRef, useState, useEffect } from "react";

interface DocumentScannerProps {
  intensity?: number;
  isTouring?: boolean;
}

export function DocumentScanner({ intensity = 100, isTouring = false }: DocumentScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scanY, setScanY] = useState(0.35); // 0 (top) to 1 (bottom)

  useEffect(() => {
    if (!isTouring) return;
    let animId: number;
    const start = performance.now();
    const loop = (t: number) => {
      const elapsed = (t - start) / 1000;
      const progress = (elapsed * 0.45) % 1;
      setScanY(progress);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isTouring]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isTouring) return;
    const rect = containerRef.current.getBoundingClientRect();
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setScanY(ny);
  };

  const factor = intensity / 100;
  const screenTopY = 110;
  const screenHeight = 180;
  const currentScanSVG_Y = screenTopY + scanY * screenHeight;
  const scanSVG_X = 285 - scanY * 18 * 0.866;

  const stageHeaderPeeled = scanY > 0.15;
  const stageImagePeeled = scanY > 0.45;
  const stageTextPeeled = scanY > 0.75;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex aspect-[5/4] max-h-[460px] w-full cursor-ns-resize items-center justify-center overflow-hidden bg-white select-none"
    >
      <div className="absolute top-4 right-5 font-mono text-[11px] tracking-wider text-slate-400 select-none">
        {`SCAN PROGRESS: ${Math.round(scanY * 100)}%`}
      </div>

      <svg
        viewBox="0 0 540 420"
        className="h-full w-full fill-none stroke-slate-900"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Stand Base */}
        <g opacity="0.9">
          <path d="M 260 295 L 315 263 L 315 273 L 260 305 Z" className="fill-white" />
          <path
            d="M 260 275 L 305 249 Q 312 245 320 250 L 335 259 Q 340 263 335 268 L 290 294 Q 282 298 275 294 L 260 285 Z"
            className="fill-white"
          />
          <path d="M 275 270 L 315 247" opacity="0.35" strokeDasharray="2 2" />
        </g>

        {/* Upright Monitor / Display Screen */}
        <g>
          <path
            d="M 220 100 L 300 146 L 300 326 L 220 280 Z"
            className="fill-white"
            strokeWidth="1.4"
          />
          <path d="M 225 112 L 292 151 L 292 318 L 225 279 Z" className="fill-white" />

          {/* Screen Top Status Dots */}
          <circle cx="233" cy="120" r="1.5" className="fill-slate-500" />
          <circle cx="239" cy="123.5" r="1.5" className="fill-slate-500" />
          <circle cx="245" cy="127" r="1.5" className="fill-slate-500" />

          <line x1="225" y1="130" x2="292" y2="169" opacity="0.25" />

          {/* Document Section 1: Title */}
          <g
            className="transition-transform duration-300"
            style={{
              transform: stageHeaderPeeled
                ? `translate(${24 * factor}px, ${-12 * factor}px)`
                : "none",
              opacity: stageHeaderPeeled ? 0.35 : 1,
            }}
          >
            <line x1="233" y1="145" x2="275" y2="169" />
            <line x1="233" y1="153" x2="260" y2="169" opacity="0.5" />
          </g>

          {/* Document Section 2: Visual Asset Block */}
          <g
            className="transition-transform duration-300"
            style={{
              transform: stageImagePeeled
                ? `translate(${32 * factor}px, ${-16 * factor}px)`
                : "none",
              opacity: stageImagePeeled ? 0.35 : 1,
            }}
          >
            <path
              d="M 233 175 L 275 199 L 275 235 L 233 211 Z"
              strokeDasharray={stageImagePeeled ? "2 2" : "none"}
            />
            <path d="M 238 206 L 248 198 L 258 206" />
            <path d="M 252 203 L 262 195 L 272 202" />
            <circle cx="265" cy="188" r="1.5" />
          </g>

          {/* Document Section 3: Data Rows */}
          <g
            className="transition-transform duration-300"
            style={{
              transform: stageTextPeeled
                ? `translate(${40 * factor}px, ${-20 * factor}px)`
                : "none",
              opacity: stageTextPeeled ? 0.35 : 1,
            }}
          >
            <rect x="233" y="240" width="3" height="3" rx="0.5" />
            <line x1="240" y1="242" x2="275" y2="262" />
            <rect x="233" y="252" width="3" height="3" rx="0.5" />
            <line x1="240" y1="254" x2="280" y2="277" />
            <rect x="233" y="264" width="3" height="3" rx="0.5" />
            <line x1="240" y1="266" x2="265" y2="281" />
          </g>
        </g>

        {/* Optical Laser Sensor Head (Original sensor cursor) */}
        <g
          className="transition-transform duration-75 ease-out"
          style={{ transform: `translate(${scanSVG_X}px, ${currentScanSVG_Y}px)` }}
        >
          {/* Isometric Diamond Sensor Housing */}
          <path
            d="M 0 -8 L 14 0 L 0 8 L -14 0 Z"
            className="fill-white stroke-slate-900"
            strokeWidth="1.5"
          />
          <circle cx="0" cy="0" r="2.5" className="fill-purple-600 stroke-none" />
          {/* Laser targeting guide lines */}
          <line
            x1="-30"
            y1="0"
            x2="-14"
            y2="0"
            strokeDasharray="2 2"
            className="stroke-purple-600"
          />
          <line x1="14" y1="0" x2="30" y2="0" strokeDasharray="2 2" className="stroke-purple-600" />
        </g>

        {/* Structured Output Target Sheet on the Right */}
        <g
          className="transition-all duration-300"
          style={{ opacity: stageHeaderPeeled ? 0.95 : 0.35 }}
        >
          <path
            d="M 340 160 L 420 206 L 420 346 L 340 300 Z"
            strokeDasharray="3 3"
            className="fill-white"
          />
          <text
            x="355"
            y="185"
            className="fill-slate-400 stroke-none font-mono text-[9px] font-semibold select-none"
          >
            # PARSED DATA
          </text>
          {stageHeaderPeeled && <line x1="352" y1="200" x2="405" y2="231" opacity="0.8" />}
          {stageImagePeeled && <path d="M 352 230 L 385 249 L 385 270 L 352 251 Z" opacity="0.8" />}
          {stageTextPeeled && (
            <>
              <line x1="352" y1="285" x2="400" y2="313" opacity="0.8" />
              <line x1="352" y1="298" x2="390" y2="320" opacity="0.8" />
            </>
          )}
        </g>
      </svg>

      <div className="absolute right-5 bottom-3 left-5 flex items-center justify-between font-mono text-[11px] text-slate-400 select-none">
        <span>POINT DOWN · ↓</span>
        <span>02 · Scanner</span>
      </div>
    </div>
  );
}
