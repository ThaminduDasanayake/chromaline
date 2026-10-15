"use client";

import React, { useRef, useState, useEffect } from "react";

interface RiffleProps {
  intensity?: number;
  isTouring?: boolean;
}

export function Riffle({ intensity = 100, isTouring = false }: RiffleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointerX, setPointerX] = useState<number | null>(null);
  const [currentX, setCurrentX] = useState(0.5);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-tour animation
  useEffect(() => {
    if (!isTouring) return;
    let animId: number;
    const start = performance.now();
    const loop = (t: number) => {
      const elapsed = (t - start) / 1000;
      const sweep = 0.5 + 0.38 * Math.sin(elapsed * 2);
      setCurrentX(sweep);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isTouring]);

  // Spring / lerp interpolation
  useEffect(() => {
    if (isTouring) return;
    let animId: number;
    const update = () => {
      const target = pointerX !== null ? pointerX : 0.5;
      setCurrentX((prev) => prev + (target - prev) * 0.18);
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [pointerX, isTouring]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setPointerX(nx);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setPointerX(null);
    setIsHovered(false);
  };

  const numCards = 7;
  const factor = intensity / 100;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative flex aspect-[5/4] max-h-[460px] w-full cursor-crosshair items-center justify-center overflow-hidden bg-white select-none"
    >
      {/* HUD Status in Top Right */}
      <div className="absolute top-4 right-5 font-mono text-[11px] tracking-wider text-slate-400 select-none">
        {isHovered || isTouring ? "HIT BANDS" : "IDLE"}
      </div>

      <svg
        viewBox="0 0 540 440"
        className="h-full w-full fill-none stroke-slate-900"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Background Isometric Guide Band */}
        <g opacity="0.08" strokeDasharray="3 4">
          <path d="M 90 280 L 270 176 L 450 280 L 270 384 Z" />
        </g>

        {/* Outer Casing Tray Back & Floor */}
        <g className="opacity-90">
          <path d="M 120 220 L 270 134 L 418 220" />
          <path d="M 270 134 L 270 170" strokeDasharray="2 2" opacity="0.4" />
        </g>

        {/* The 7 Interactive Cards */}
        {Array.from({ length: numCards }).map((_, i) => {
          const cardNorm = i / (numCards - 1);
          const dist = cardNorm - currentX;
          const leanOffset = Math.sign(dist) * Math.pow(Math.abs(dist), 0.65) * 22 * factor;
          const liftOffset = Math.max(0, 1 - Math.abs(dist) * 3) * -16 * factor;

          const baseX = 175 + i * 14 + leanOffset * 0.866;
          const baseY = 285 - i * 15 + leanOffset * 0.5 + liftOffset;

          const cardW = 150;
          const cardH = 110;
          const tabW = 40;
          const tabH = 15;
          const tabOffset = 30 + ((i * 18) % 70);

          return (
            <g
              key={i}
              className="transition-transform duration-75"
              style={{
                filter:
                  i === Math.round(currentX * (numCards - 1))
                    ? "drop-shadow(0 4px 10px rgba(0,0,0,0.06))"
                    : "none",
              }}
            >
              {/* Card Face */}
              <path
                d={`
                  M ${baseX} ${baseY}
                  L ${baseX + cardW * 0.866} ${baseY - cardW * 0.5}
                  L ${baseX + cardW * 0.866} ${baseY - cardW * 0.5 - cardH}
                  L ${baseX + (cardW - tabOffset) * 0.866} ${baseY - (cardW - tabOffset) * 0.5 - cardH}
                  L ${baseX + (cardW - tabOffset) * 0.866} ${baseY - (cardW - tabOffset) * 0.5 - cardH - tabH}
                  L ${baseX + (cardW - tabOffset - tabW) * 0.866} ${baseY - (cardW - tabOffset - tabW) * 0.5 - cardH - tabH}
                  L ${baseX + (cardW - tabOffset - tabW) * 0.866} ${baseY - (cardW - tabOffset - tabW) * 0.5 - cardH}
                  L ${baseX} ${baseY - cardH}
                  Z
                `}
                className="fill-white"
                strokeWidth={i === Math.round(currentX * (numCards - 1)) ? "1.5" : "1.25"}
              />

              {/* Tab Punch Dots */}
              <circle
                cx={baseX + (cardW - tabOffset - tabW * 0.5) * 0.866}
                cy={baseY - (cardW - tabOffset - tabW * 0.5) * 0.5 - cardH - tabH * 0.5}
                r="1"
                className="fill-slate-500"
              />
              <circle
                cx={baseX + (cardW - tabOffset - tabW * 0.5) * 0.866 - 5}
                cy={baseY - (cardW - tabOffset - tabW * 0.5) * 0.5 - cardH - tabH * 0.5 + 2}
                r="0.75"
                className="fill-slate-400"
              />
              <circle
                cx={baseX + (cardW - tabOffset - tabW * 0.5) * 0.866 + 5}
                cy={baseY - (cardW - tabOffset - tabW * 0.5) * 0.5 - cardH - tabH * 0.5 - 2}
                r="0.75"
                className="fill-slate-400"
              />

              {/* Card Ruled Lines */}
              <line
                x1={baseX + 20 * 0.866}
                y1={baseY - 20 * 0.5 - cardH * 0.75}
                x2={baseX + (cardW - 20) * 0.866}
                y2={baseY - (cardW - 20) * 0.5 - cardH * 0.75}
                opacity="0.25"
              />
              <line
                x1={baseX + 20 * 0.866}
                y1={baseY - 20 * 0.5 - cardH * 0.55}
                x2={baseX + (cardW - 20) * 0.866}
                y2={baseY - (cardW - 20) * 0.5 - cardH * 0.55}
                opacity="0.25"
              />
              <line
                x1={baseX + 20 * 0.866}
                y1={baseY - 20 * 0.5 - cardH * 0.35}
                x2={baseX + (cardW - 35) * 0.866}
                y2={baseY - (cardW - 35) * 0.5 - cardH * 0.35}
                opacity="0.25"
              />
            </g>
          );
        })}

        {/* Front Tray Walls & Bevels */}
        <g>
          <path d="M 125 240 L 268 322 L 268 368 L 125 286 Z" className="fill-white" />
          <path d="M 268 322 L 415 237 L 415 283 L 268 368 Z" className="fill-white" />
          <path d="M 125 240 Q 130 237 135 240 L 268 317 L 405 238" opacity="0.6" />

          {/* Front Pull Handle Pill Notch */}
          <g transform="translate(196, 310) rotate(30)">
            <rect
              x="0"
              y="0"
              width="36"
              height="12"
              rx="6"
              className="fill-white stroke-slate-500"
              opacity="0.85"
            />
          </g>

          <path d="M 125 286 L 268 368 L 415 283" opacity="0.4" strokeDasharray="2 2" />
        </g>
      </svg>

      <div className="absolute right-5 bottom-3 left-5 flex items-center justify-between font-mono text-[11px] text-slate-400 select-none">
        <span>HOVER · ← →</span>
        <span>01 · Deck Fanner</span>
      </div>
    </div>
  );
}
