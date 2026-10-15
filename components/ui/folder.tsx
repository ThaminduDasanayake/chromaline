"use client";

import React from "react";

export interface FolderProps {
  bodyColor?: string;
  darkOutline?: string;
  lightOutline?: string;
  borderWidth?: number | string; // Thickness of the silhouette outline and divider lines (e.g. 1.2, 1, or "1px")
  depth?: boolean | number; // 3D cardstock thickness with offset back face (default: true)
  folderIndex?: number; // 0 to 7 to determine exact tab position and active punch dot
  tabPosition?: "left" | "center" | "right";
  showLines?: boolean; // Set to false to hide the 4 horizontal ruled lines
  className?: string;
  children?: React.ReactNode;
}

// Geometric constants matching @lucasmarkes/hairline riffle-geometry.ts
const W = 84;
const H = 54;
const TW = 22;
const TH = 7;
const TOTAL_H = H + TH + 1; // 62
const TABS = [6, 31, 56]; // Left, Center, Right

function fillet(pts: [number, number][], rs: number[], n = 4): [number, number][] {
  const m = pts.length;
  const out: [number, number][] = [];
  for (let i = 0; i < m; i++) {
    const a = pts[(i + m - 1) % m];
    const p = pts[i];
    const b = pts[(i + 1) % m];
    const la = Math.hypot(a[0] - p[0], a[1] - p[1]);
    const lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const t = Math.min(rs[i], la / 2, lb / 2);
    const p1: [number, number] = [p[0] + ((a[0] - p[0]) / la) * t, p[1] + ((a[1] - p[1]) / la) * t];
    const p2: [number, number] = [p[0] + ((b[0] - p[0]) / lb) * t, p[1] + ((b[1] - p[1]) / lb) * t];
    for (let k = 0; k <= n; k++) {
      const s = k / n;
      const w = 1 - s;
      out.push([
        w * w * p1[0] + 2 * w * s * p[0] + s * s * p2[0],
        w * w * p1[1] + 2 * w * s * p[1] + s * s * p2[1],
      ]);
    }
  }
  return out;
}

const r2 = (x: number) => Math.round(x * 100) / 100;
const toSvgPath = (pts: [number, number][]) =>
  "M" + pts.map((p) => r2(p[0]) + " " + r2(p[1])).join("L") + "Z";

function generateFolderSilhouette(t0: number): string {
  const rawPts = fillet(
    [
      [0, 0],
      [W, 0],
      [W, H],
      [t0 + TW, H],
      [t0 + TW, H + TH],
      [t0, H + TH],
      [t0, H],
      [0, H],
    ],
    [1, 1, 3.2, 1.8, 2.4, 2.4, 1.8, 3.2]
  );
  // Invert Y so the tab is at the top in SVG
  const pts: [number, number][] = rawPts.map(([x, y]) => [x, TOTAL_H - y]);
  return toSvgPath(pts);
}

// Pre-computed silhouette paths for each tab position (Left = 0, Center = 1, Right = 2)
const SILHOUETTES = [
  generateFolderSilhouette(TABS[0]),
  generateFolderSilhouette(TABS[1]),
  generateFolderSilhouette(TABS[2]),
];

/**
 * Folder
 * Renders a folder card facing forward in 2D vector format,
 * using geometric vector paths, tab fillets, ruled lines, and punch dots.
 */
export function Folder({
  bodyColor = "#E54F10",
  darkOutline = "#7C2D12",
  lightOutline = "#FED7AA",
  borderWidth = 1.2,
  depth = true,
  folderIndex = 0,
  tabPosition,
  showLines = true,
  className = "w-44 h-auto drop-shadow-sm",
  children,
}: FolderProps) {
  // Determine tab index: 0 = left, 1 = center, 2 = right
  let tabIdx = 1;
  if (tabPosition === "left") tabIdx = 0;
  else if (tabPosition === "center") tabIdx = 1;
  else if (tabPosition === "right") tabIdx = 2;
  else {
    // Matches tab cycle: t0 = TABS[(8 - 1 - i) % 3]
    tabIdx = (7 - (folderIndex % 8)) % 3;
  }

  const t0 = TABS[tabIdx];
  const silhouettePath = SILHOUETTES[tabIdx];
  // Active dot index matching hairline (k === n - 1 where n = 8 - i)
  const activeDotIndex = 7 - (folderIndex % 8);

  const dividerStrokeWidth =
    typeof borderWidth === "number" ? Math.max(0.75, borderWidth * 0.75) : borderWidth;

  // 3D cardstock thickness offset (back face shifted up and to the right)
  const depthValue = typeof depth === "number" ? depth : depth ? 1 : 0;
  const depthOffsetX = depthValue * 0.95;
  const depthOffsetY = -depthValue * 0.95;

  const svgContent = (
    <svg
      viewBox={depthValue > 0 ? "-2 -2 89 66" : "-2 -1 88 65"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={children ? "h-full w-full" : className}
    >
      {/* 0. 3D Back Face (Cardstock Thickness Bevel with Light Outline) */}
      {depthValue > 0 && (
        <path
          d={silhouettePath}
          transform={`translate(${depthOffsetX}, ${depthOffsetY})`}
          fill={bodyColor}
          stroke={lightOutline}
          strokeWidth={borderWidth}
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
      )}

      {/* 1. Main Folder Silhouette Face (Front Face with Dark Outline) */}
      <path
        d={silhouettePath}
        fill={bodyColor}
        stroke={darkOutline}
        strokeWidth={borderWidth}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />

      {/* 2. Top Header Divider Line below the tab */}
      <line
        x1="6"
        y1="19"
        x2="78"
        y2="19"
        stroke={darkOutline}
        strokeWidth={dividerStrokeWidth}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
      />

      {/* 3. Four Horizontal Ruled Lines */}
      {showLines &&
        [26, 33, 40, 47].map((y) => (
          <line
            key={y}
            x1="6"
            y1={y}
            x2="78"
            y2={y}
            stroke={lightOutline}
            strokeWidth={dividerStrokeWidth}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
          />
        ))}

      {/* 4. Eight Punch Dots on the Tab (2 rows of 4) */}
      {Array.from({ length: 8 }).map((_, k) => {
        const cx = t0 + TW / 2 + ((k % 4) - 1.5) * 3.6;
        const cy = Math.floor(k / 4) === 0 ? 3.2 : 5.8;
        const isActive = k === activeDotIndex;

        return (
          <circle
            key={k}
            cx={cx}
            cy={cy}
            r={1.05}
            fill={isActive ? darkOutline : lightOutline}
            stroke="none"
          />
        );
      })}
    </svg>
  );

  if (!children) {
    return svgContent;
  }

  return (
    <div className={`relative ${className}`}>
      {svgContent}
      <div className="absolute inset-0 flex flex-col">{children}</div>
    </div>
  );
}
