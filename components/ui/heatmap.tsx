"use client";

import React, {useCallback, useEffect, useId, useMemo, useRef} from "react";
import {THAMINDU_CONTRIBUTIONS, THAMINDU_TOTAL_WEEKS} from "./thamindu-data";

/* ══ Heatmap ═══════════════════════════════════════════════
   An interactive 3D isometric contribution heatmap on a plinth.
   Features:
   - Full 52/53-week whole-year or 14-week timeline (X: Weeks, Y: Days, Z: Commit volume)
   - Decoupled Color Scheme (Default, Winter, Halloween) and Mode (Dark, Light)
   - Official GitHub palettes directly matching github.com CSS variables
   - Cursor tracking with tactile spring elevation kinematics
   - Shockwave ripple impulse on click
   - Live hover highlighting and cell metadata resolution
   ─────────────────────────────────────────────────────────── */

export type HeatmapSchemeKey = "default" | "winter" | "halloween";
export type HeatmapMode = "dark" | "light";
export type HeatmapRange = "year" | "14w";

export interface HeatmapPalette {
  colors: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
  };
  accent: string;
  canvasBg: string;
  plinthFill: string;
  plinthStroke: string;
  plinthCrease: string;
  colStroke: string;
  colCrease: string;
  hoverStroke: string;
  hoverCrease: string;
  dotCenter: string;
  dotOuter: string;
}

export const GITHUB_SCHEMES: Record<HeatmapSchemeKey, Record<HeatmapMode, HeatmapPalette>> = {
  default: {
    dark: {
      colors: {
        0: "#151b23",
        1: "#033a16",
        2: "#196c2e",
        3: "#2ea043",
        4: "#56d364",
      },
      accent: "#56d364",
      canvasBg: "bg-[#0d1117]",
      plinthFill: "#161b22",
      plinthStroke: "#30363d",
      plinthCrease: "rgba(255, 255, 255, 0.08)",
      colStroke: "rgba(255, 255, 255, 0.18)",
      colCrease: "rgba(255, 255, 255, 0.10)",
      hoverStroke: "#ffffff",
      hoverCrease: "rgba(255, 255, 255, 0.6)",
      dotCenter: "#ffffff",
      dotOuter: "rgba(255, 255, 255, 0.5)",
    },
    light: {
      colors: {
        0: "#ebedf0",
        1: "#9be9a8",
        2: "#40c463",
        3: "#30a14e",
        4: "#216e39",
      },
      accent: "#216e39",
      canvasBg: "bg-[#F9FAFB]",
      plinthFill: "#f8fafc",
      plinthStroke: "#cbd5e1",
      plinthCrease: "rgba(15, 23, 42, 0.10)",
      colStroke: "rgba(15, 23, 42, 0.26)",
      colCrease: "rgba(15, 23, 42, 0.14)",
      hoverStroke: "#0f172a",
      hoverCrease: "rgba(15, 23, 42, 0.5)",
      dotCenter: "#0f172a",
      dotOuter: "rgba(15, 23, 42, 0.4)",
    },
  },
  winter: {
    dark: {
      colors: {
        0: "#151b23",
        1: "#0c2d6b",
        2: "#1158c7",
        3: "#58a6ff",
        4: "#cae8ff",
      },
      accent: "#58a6ff",
      canvasBg: "bg-[#0d1117]",
      plinthFill: "#0b1522",
      plinthStroke: "#223b59",
      plinthCrease: "rgba(202, 232, 255, 0.10)",
      colStroke: "rgba(202, 232, 255, 0.28)",
      colCrease: "rgba(202, 232, 255, 0.16)",
      hoverStroke: "#ffffff",
      hoverCrease: "rgba(202, 232, 255, 0.65)",
      dotCenter: "#ffffff",
      dotOuter: "rgba(88, 166, 255, 0.6)",
    },
    light: {
      colors: {
        0: "#ebedf0",
        1: "#cae8ff",
        2: "#58a6ff",
        3: "#1158c7",
        4: "#0c2d6b",
      },
      accent: "#0c2d6b",
      canvasBg: "bg-[#F9FAFB]",
      plinthFill: "#f0f6fc",
      plinthStroke: "#cbd5e1",
      plinthCrease: "rgba(12, 45, 107, 0.10)",
      colStroke: "rgba(12, 45, 107, 0.30)",
      colCrease: "rgba(12, 45, 107, 0.16)",
      hoverStroke: "#0f172a",
      hoverCrease: "rgba(12, 45, 107, 0.5)",
      dotCenter: "#0f172a",
      dotOuter: "rgba(17, 88, 199, 0.4)",
    },
  },
  halloween: {
    dark: {
      colors: {
        0: "#151b23",
        1: "#fac68f",
        2: "#c46212",
        3: "#984b10",
        4: "#e3d04f",
      },
      accent: "#e3d04f",
      canvasBg: "bg-[#0d1117]",
      plinthFill: "#171412",
      plinthStroke: "#422f22",
      plinthCrease: "rgba(254, 215, 170, 0.10)",
      colStroke: "rgba(254, 215, 170, 0.28)",
      colCrease: "rgba(254, 215, 170, 0.16)",
      hoverStroke: "#ffffff",
      hoverCrease: "rgba(254, 215, 170, 0.65)",
      dotCenter: "#ffffff",
      dotOuter: "rgba(254, 215, 170, 0.6)",
    },
    light: {
      colors: {
        0: "#ebedf0",
        1: "#ffeeaa",
        2: "#fbb13c",
        3: "#c46212",
        4: "#6e2f05",
      },
      accent: "#c46212",
      canvasBg: "bg-[#F9FAFB]",
      plinthFill: "#faf7f4",
      plinthStroke: "#cbd5e1",
      plinthCrease: "rgba(75, 30, 8, 0.10)",
      colStroke: "rgba(75, 30, 8, 0.30)",
      colCrease: "rgba(75, 30, 8, 0.16)",
      hoverStroke: "#0f172a",
      hoverCrease: "rgba(75, 30, 8, 0.5)",
      dotCenter: "#0f172a",
      dotOuter: "rgba(75, 30, 8, 0.4)",
    },
  },
};


export interface HeatmapNode {
  row: number;
  col: number;
  height: number;
  count?: number;
  color?: string;
  label?: string;
  date?: string;
  isFuture?: boolean;
  [key: string]: unknown;
}

export interface HeatmapProps {
  /** 2D grid matrix of nodes: data[col][row]. If not provided, generates realistic activity data */
  data?: HeatmapNode[][];
  /** Color scheme: 'default' (classic green) | 'winter' (blue) | 'halloween' (orange/gold). Default: 'default' */
  scheme?: HeatmapSchemeKey;
  /** Theme mode: 'dark' | 'light'. Default: 'dark' */
  mode?: HeatmapMode;
  /** Timeline range: 'year' (full 52-53 weeks) | '14w' (14 weeks). Default: 'year' */
  range?: HeatmapRange;
  /** Spring response radius/intensity (0.2 subtle to 1.5 wide). Default: 0.6 */
  intensity?: number;
  /** Whether hovered pillars highlight with the accent color. Default: true */
  colorOnHover?: boolean;
  /** Callback fired when a pillar is clicked */
  onClick?: (node: HeatmapNode) => void;
  /** Callback fired when a pillar is hovered */
  onHover?: (node: HeatmapNode | null) => void;
  /** Accent color for hovered node. Defaults to active scheme accent */
  accentColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function calculateTier(count: number, maxCount: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0 || maxCount <= 0) return 0;
  const ratio = count / maxCount;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

/**
 * Calculates whether a color has dark perceived luminance (Rec. 709).
 * Dark colors (luminance < 0.48) require light outlines for clear edge definition.
 * Light colors (luminance >= 0.48) require dark outlines to avoid blending.
 */
export function isDarkColor(color?: string): boolean {
  if (!color) return true;
  const str = color.trim().toLowerCase();

  // Hex format (#rgb, #rgba, #rrggbb, #rrggbbaa)
  if (str.startsWith("#")) {
    let hex = str.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .slice(0, 3)
        .split("")
        .map((ch) => ch + ch)
        .join("");
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        return luminance < 0.48;
      }
    }
  }

  // RGB / RGBA format
  const rgbMatch = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance < 0.48;
  }

  return true;
}

export function getCommitTier(count: number, maxCount?: number): 0 | 1 | 2 | 3 | 4 {
  if (maxCount && maxCount > 0) {
    return calculateTier(count, maxCount);
  }
  if (count <= 0) return 0;
  if (count <= 6) return 1;
  if (count <= 12) return 2;
  if (count <= 18) return 3;
  return 4;
}

export function getCommitHeight(count: number, maxCount: number = 25, level?: number): number {
  if (count <= 0) return 2.5;
  const safeMax = Math.max(1, maxCount);
  const ratio = Math.min(1, count / safeMax);
  const effectiveLevel =
    level !== undefined ? level : ratio <= 0.25 ? 1 : ratio <= 0.5 ? 2 : ratio <= 0.75 ? 3 : 4;

  const baseByLevel = [2.5, 7.5, 18, 30, 44];
  const spanByLevel = [0, 8.5, 10, 11, 10];
  const levelMinRatio = [0, 0, 0.25, 0.5, 0.75][effectiveLevel] ?? 0;
  const levelMaxRatio = [0, 0.25, 0.5, 0.75, 1.0][effectiveLevel] ?? 1.0;
  const span = levelMaxRatio - levelMinRatio || 0.25;
  const frac = Math.max(0, Math.min(1, (ratio - levelMinRatio) / span));

  return Math.round((baseByLevel[effectiveLevel] + frac * spanByLevel[effectiveLevel]) * 10) / 10;
}

/**
 * Deterministically generates a timeline contribution matrix (full year 53 weeks or 14 weeks)
 */
// export function generateHeatmapMatrix(
//   profile: HeatmapProfile = "maintainer",
//   scheme: HeatmapSchemeKey = "default",
//   mode: HeatmapMode = "dark",
//   range: HeatmapRange = "year"
// ): {
//   matrix: HeatmapNode[][];
//   totalContributions: number;
// } {
//   const numWeeks = range === "14w" ? 14 : 53;
//   const numDays = 7;
//   const palette = (GITHUB_SCHEMES[scheme] || GITHUB_SCHEMES.default)[mode];
//   let totalContributions = 0;
//
//   const baseDate = new Date(2026, 9, 20); // Oct 20, 2026
//
//   // Pass 1: compute daily counts and find max activity
//   const rawCells: { w: number; d: number; count: number; dateStr: string; dayOfWeek: number }[] =
//     [];
//   let maxCount = 1;
//
//   for (let w = 0; w < numWeeks; w++) {
//     for (let d = 0; d < numDays; d++) {
//       const daysAgo = (numWeeks - 1 - w) * 7 + (numDays - 1 - d);
//       const cellDate = new Date(baseDate);
//       cellDate.setDate(cellDate.getDate() - daysAgo);
//
//       const dayOfWeek = (cellDate.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
//       const isWeekend = dayOfWeek >= 5;
//
//       const seed = Math.sin(w * 17.3 + d * 31.7) * 10000;
//       const rnd = seed - Math.floor(seed);
//
//       let count = 0;
//
//       if (profile === "maintainer") {
//         if (isWeekend) {
//           count = rnd > 0.4 ? Math.floor(rnd * 4) : 0;
//         } else {
//           count = Math.floor(2 + rnd * 10);
//           if (
//             (w % 5 === 0 && d === 2) ||
//             (w % 7 === 0 && d === 3) ||
//             (w === numWeeks - 2 && d === 1)
//           ) {
//             count = 18 + Math.floor(rnd * 7);
//           }
//         }
//       } else if (profile === "weekend") {
//         if (isWeekend) {
//           count = Math.floor(8 + rnd * 16);
//         } else {
//           count = rnd > 0.65 ? Math.floor(rnd * 4) : 0;
//         }
//       } else {
//         const inSprintPeak = w % 3 === 2;
//         if (inSprintPeak && !isWeekend) {
//           count = Math.floor(10 + rnd * 14);
//         } else if (!isWeekend) {
//           count = Math.floor(2 + rnd * 6);
//         } else {
//           count = rnd > 0.5 ? Math.floor(rnd * 3) : 0;
//         }
//       }
//
//       totalContributions += count;
//       if (count > maxCount) maxCount = count;
//
//       const formattedDate = cellDate.toLocaleDateString("en-US", {
//         weekday: "short",
//         month: "short",
//         day: "numeric",
//       });
//
//       rawCells.push({
//         w,
//         d,
//         count,
//         dateStr: formattedDate,
//         dayOfWeek,
//       });
//     }
//   }
//
//   // Pass 2: map into matrix columns with dynamic quartile tiers
//   const cols: HeatmapNode[][] = [];
//   for (let w = 0; w < numWeeks; w++) {
//     const col: HeatmapNode[] = [];
//     for (let d = 0; d < numDays; d++) {
//       const cell = rawCells[w * numDays + d];
//       const count = cell.count;
//       const tier = calculateTier(count, maxCount);
//       const color = palette.colors[tier];
//       const height = getCommitHeight(count, maxCount, tier);
//
//       col.push({
//         col: w,
//         row: d,
//         count,
//         color,
//         height,
//         label: cell.dateStr,
//         date: cell.dateStr,
//       });
//     }
//     cols.push(col);
//   }
//
//   return { matrix: cols, totalContributions };
// }

/**
 * Generates matrix using Thamindu's real GitHub contributions (full year or 14 weeks)
 * Uses official GitHub data-level (0-4) directly matching github.com
 */
export function generateThaminduMatrix(
  scheme: HeatmapSchemeKey = "default",
  mode: HeatmapMode = "dark",
  range: HeatmapRange = "year"
): {
  matrix: HeatmapNode[][];
  totalContributions: number;
} {
  const palette = (GITHUB_SCHEMES[scheme] || GITHUB_SCHEMES.default)[mode];
  const totalWeeks = THAMINDU_TOTAL_WEEKS;
  const targetWeeks = range === "14w" ? 14 : totalWeeks;
  const startWeek = range === "14w" ? totalWeeks - 14 : 0;

  // Maximum commit count in Thamindu's history is 25
  const maxCount = 25;

  const cols: HeatmapNode[][] = [];
  let totalContributions = 0;

  for (let w = 0; w < targetWeeks; w++) {
    const actualWeekIdx = startWeek + w;
    const col: HeatmapNode[] = [];
    for (let d = 0; d < 7; d++) {
      const idx = actualWeekIdx * 7 + d;
      const item = THAMINDU_CONTRIBUTIONS[idx];
      const count = item?.count ?? 0;
      totalContributions += count;

      // Use GitHub's exact official level directly:
      // Level 0: 0 commits (142 days)
      // Level 1: 1-6 commits (134 days)
      // Level 2: 7-12 commits (51 days)
      // Level 3: 13-18 commits (36 days)
      // Level 4: 19-25 commits (only 8 top peak days!)
      const tier = (item?.level !== undefined ? item.level : calculateTier(count, maxCount)) as
        0 | 1 | 2 | 3 | 4;

      const color = palette.colors[tier];
      const height = getCommitHeight(count, maxCount, tier);

      let formattedDate = "";
      if (item?.date) {
        const dObj = new Date(item.date + "T00:00:00");
        formattedDate = dObj.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
      }

      col.push({
        col: w,
        row: d,
        count,
        color,
        height,
        label: formattedDate,
        date: item?.date || "",
        isFuture: item?.isFuture ?? false,
      });
    }
    cols.push(col);
  }

  return { matrix: cols, totalContributions };
}

const rad = (d: number) => (d * Math.PI) / 180;
const r2 = (n: number) => Math.round(n * 100) / 100;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

interface Camera {
  az: number;
  k: number;
  S: number;
  ox: number;
  oy: number;
}

const Cam = (azDeg: number, k: number, S: number): Camera => ({
  az: rad(azDeg),
  k,
  S,
  ox: 0,
  oy: 0,
});

function proj(C: Camera) {
  const c = Math.cos(C.az);
  const s = Math.sin(C.az);
  const zf = Math.sqrt(1 - C.k * C.k);
  return (x: number, y: number, z: number): [number, number] => {
    const X = x * c - y * s;
    const Y = x * s + y * c;
    return [C.ox + C.S * X, C.oy + C.S * (Y * C.k - z * zf)];
  };
}

function fit(C: Camera, pts: number[][], viewWidth: number, viewHeight: number, pad = 14) {
  const c = Math.cos(C.az);
  const s = Math.sin(C.az);
  const zf = Math.sqrt(1 - C.k * C.k);

  let minX = 1e9,
    maxX = -1e9,
    minY = 1e9,
    maxY = -1e9;

  for (const [x, y, z] of pts) {
    const X = x * c - y * s;
    const Y = (x * s + y * c) * C.k - z * zf;
    minX = Math.min(minX, X);
    maxX = Math.max(maxX, X);
    minY = Math.min(minY, Y);
    maxY = Math.max(maxY, Y);
  }

  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);

  const availW = viewWidth - pad * 2;
  const availH = viewHeight - pad * 2;

  C.S = Math.min(availW / spanX, availH / spanY);
  C.ox = viewWidth / 2 - (C.S * (minX + maxX)) / 2;
  C.oy = viewHeight / 2 - (C.S * (minY + maxY)) / 2;
}

interface Point2D {
  u: number;
  v: number;
  nu: number;
  nv: number;
}

function rrect(u0: number, v0: number, u1: number, v1: number, r: number, n = 4): Point2D[] {
  r = Math.max(0, Math.min(r, (u1 - u0) / 2, (v1 - v0) / 2));
  const out: Point2D[] = [];
  const corners = [
    [u1 - r, v1 - r, 0],
    [u0 + r, v1 - r, 90],
    [u0 + r, v0 + r, 180],
    [u1 - r, v0 + r, 270],
  ];
  for (const [cu, cv, a0] of corners) {
    for (let k = 0; k <= n; k++) {
      const a = rad(a0 + (90 * k) / n);
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      out.push({ u: cu + r * ca, v: cv + r * sa, nu: ca, nv: sa });
    }
  }
  return out;
}

const rings = (x0: number, y0: number, x1: number, y1: number, r: number, b: number) => [
  rrect(x0, y0, x1, y1, r),
  rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(0.3, r - b)),
];

const ringAt = (
  P: (x: number, y: number, z: number) => [number, number],
  ring: Point2D[],
  z: number
) => ring.map((q) => P(q.u, q.v, z));

const facing = (C: Camera) => {
  const s = Math.sin(C.az);
  const c = Math.cos(C.az);
  return (q: Point2D) => q.nu * s + q.nv * c >= -1e-6;
};

function run(ring: Point2D[], keep: (p: Point2D) => boolean) {
  const n = ring.length;
  let s = -1;
  for (let i = 0; i < n; i++) {
    if (keep(ring[i]) && !keep(ring[(i + n - 1) % n])) {
      s = i;
      break;
    }
  }
  if (s < 0) return keep(ring[0]) ? ring.slice() : [];
  const out: Point2D[] = [];
  for (let k = 0; k < n && keep(ring[(s + k) % n]); k++) {
    out.push(ring[(s + k) % n]);
  }
  return out;
}

function hull(input: [number, number][]) {
  const pts = input.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: [number, number], a: [number, number], b: [number, number]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: [number, number][] = [];
  const up: [number, number][] = [];
  for (const p of pts) {
    while (lo.length > 1 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop();
    lo.push(p);
  }
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (up.length > 1 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop();
    up.push(p);
  }
  lo.pop();
  up.pop();
  return lo.concat(up);
}

const poly = (pts: [number, number][]) =>
  "M" + pts.map((p) => r2(p[0]) + " " + r2(p[1])).join("L") + "Z";

const openPath = (pts: [number, number][]) =>
  pts.length < 2 ? "" : "M" + pts.map((p) => r2(p[0]) + " " + r2(p[1])).join("L");

function prism(
  P: (x: number, y: number, z: number) => [number, number],
  front: (q: Point2D) => boolean,
  ring: Point2D[],
  inner: Point2D[] | null,
  z0: number,
  z1: number
) {
  return {
    sil: poly(hull(ringAt(P, ring, z1).concat(ringAt(P, ring, z0)))),
    crease: inner ? openPath(ringAt(P, run(inner, front), z1)) : "",
  };
}

const falloff = (u: number) =>
  u <= 0
    ? 1
    : u <= 0.417
      ? 1 - (u / 0.417) * 0.6875
      : u <= 1
        ? 0.3125 - ((u - 0.417) / 0.583) * 0.3125
        : 0;

interface SpringState {
  x: number;
  v: number;
  t: number;
  k: number;
  c: number;
  m: number;
  eps: number;
}

function createSpring(x: number): SpringState {
  return { x, v: 0, t: x, k: 100, c: 18, m: 1, eps: 0.04 };
}

function stepSpring(sp: SpringState, dt: number): boolean {
  const n = Math.max(1, Math.ceil(dt * 240));
  const h = dt / n;
  for (let i = 0; i < n; i++) {
    const a = (-sp.k * (sp.x - sp.t) - sp.c * sp.v) / sp.m;
    sp.v += a * h;
    sp.x += sp.v * h;
  }
  if (Math.abs(sp.x - sp.t) < sp.eps && Math.abs(sp.v) < sp.eps * 10) {
    sp.x = sp.t;
    sp.v = 0;
    return false;
  }
  return true;
}

interface ColumnMeta {
  i: number;
  j: number;
  h0: number;
  ring: Point2D[];
  inner: Point2D[];
  color?: string;
  isDark: boolean;
  node: HeatmapNode;
  cx: number;
  baseY: number;
  capY: number;
}

export function Heatmap({
  data: providedData,
  scheme = "default",
  mode = "dark",
  range = "year",
  intensity = 0.6,
  colorOnHover = true,
  onClick,
  onHover,
  className = "",
  style = {},
}: HeatmapProps) {
  const instanceId = useId();

  const palette = (GITHUB_SCHEMES[scheme] || GITHUB_SCHEMES.default)[mode];

  // Resolve grid data (either user provided or generated from real GitHub contributions)
  const resolvedMatrix = useMemo(() => {
    if (providedData && providedData.length > 0) {
      return providedData;
    }
    return generateThaminduMatrix(scheme, mode, range).matrix;
  }, [providedData, scheme, mode, range]);

  const numCols = resolvedMatrix.length;
  const numRows = resolvedMatrix[0]?.length || 7;

  const isWide = numCols > 20;
  const VIEW_W = isWide ? 660 : 320;
  const VIEW_H = isWide ? 390 : 200;

  const CELL = 14;
  const FOOT = 11;
  const HMAX = 56;
  const EXT_X = numCols * CELL;
  const EXT_Y = numRows * CELL;
  const PB = 5;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const hoverRef = useRef<{ col: number; row: number } | null>(null);
  const overRef = useRef<[number, number] | null>(null);
  const shockwaveRef = useRef<{ col: number; row: number; time: number } | null>(null);
  const timeRef = useRef(0);

  // Setup Camera via useMemo
  const C = useMemo(() => {
    const cam = Cam(45, 0.5, 1);
    fit(
      cam,
      [
        [-8, -8, -PB],
        [EXT_X + 8, -8, -PB],
        [EXT_X + 8, EXT_Y + 8, -PB],
        [-8, EXT_Y + 8, -PB],
        [-8, -8, 0],
        [EXT_X + 8, -8, 0],
        [EXT_X + 8, EXT_Y + 8, 0],
        [-8, EXT_Y + 8, 0],
        [0, 0, HMAX],
        [EXT_X, 0, HMAX],
        [EXT_X, EXT_Y, HMAX],
        [0, EXT_Y, HMAX],
      ],
      VIEW_W,
      VIEW_H,
      16
    );
    return cam;
  }, [EXT_X, EXT_Y, PB, HMAX, VIEW_W, VIEW_H]);

  const P = useMemo(() => proj(C), [C]);
  const front = useMemo(() => facing(C), [C]);

  // Base Plinth Rings & Shape
  const plinthPrism = useMemo(() => {
    const [pr, pi] = rings(-6, -6, EXT_X + 6, EXT_Y + 6, 9, 2.2);
    return prism(P, front, pr, pi, -PB, 0);
  }, [EXT_X, EXT_Y, P, front, PB]);

  // Columns layout via useMemo (sorted in isometric painter's order)
  const columns = useMemo<ColumnMeta[]>(() => {
    const colsList: ColumnMeta[] = [];
    for (let s = 0; s <= numCols - 1 + (numRows - 1); s++) {
      for (let i = 0; i < numCols; i++) {
        const j = s - i;
        if (j < 0 || j >= numRows) continue;

        const node = resolvedMatrix[i]?.[j];
        if (!node || node.isFuture) continue;

        const h0 = node.height ?? (node.count !== undefined ? getCommitHeight(node.count) : 2.5);
        const color = node.color || palette.colors[0];
        let isDark = isDarkColor(color);

        // Theme-specific outline contrast rules:
        // 1. Default theme:
        //    - Dark mode: tier 4 (lightest green) and the previous 2 colors (tiers 3 & 2)
        //      use the dark outline; tiers 0 & 1 use the light outline.
        //    - Light mode: outlines are all dark.
        if (scheme === "default") {
          if (mode === "dark") {
            const isDarkOutlined =
              color === palette.colors[4] ||
              color === palette.colors[3] ||
              color === "#56d364" ||
              color === "#2ea043";

            isDark = !isDarkOutlined;
          } else {
            isDark = false;
          }
        }
        // 2. Halloween theme:
        //    - Dark mode: all active contribution bars (tiers 1-4) use dark outline,
        //      while tier 0 (zero contributions / less) keeps the light outline.
        //    - Light mode: everything uses the dark outline (no white outlines).
        else if (scheme === "halloween") {
          if (mode === "dark") {
            isDark = node.count !== undefined ? node.count === 0 : color === palette.colors[0];
          } else {
            isDark = false;
          }
        }

        const x0 = i * CELL + (CELL - FOOT) / 2;
        const y0 = j * CELL + (CELL - FOOT) / 2;
        const [ring, inner] = rings(x0, y0, x0 + FOOT, y0 + FOOT, 2.6, 0.9);
        const basePt = P((i + 0.5) * CELL, (j + 0.5) * CELL, 0);
        const capPt = P((i + 0.5) * CELL, (j + 0.5) * CELL, h0);
        const cx = basePt[0];
        const baseY = basePt[1];
        const capY = capPt[1];

        colsList.push({ i, j, h0, ring, inner, color, isDark, node, cx, baseY, capY });
      }
    }
    return colsList;
  }, [numCols, numRows, resolvedMatrix, palette, CELL, FOOT, P, scheme, mode]);

  // Node element references for direct SVG path mutation without re-renders
  const domRefs = useRef<
    Map<
      string,
      {
        sil: SVGPathElement | null;
        cr: SVGPathElement | null;
        mark: SVGGElement | null;
      }
    >
  >(new Map());

  const springsRef = useRef<Map<string, SpringState>>(new Map());
  const markGroupRef = useRef<SVGGElement | null>(null);
  const hiddenHostRef = useRef<SVGGElement | null>(null);
  const dotRefs = useRef<(SVGEllipseElement | null)[]>([]);

  // Main Animation & Physics Loop
  useEffect(() => {
    let raf = 0;
    let prevTime = performance.now();

    for (const c of columns) {
      const key = `${c.i}-${c.j}`;
      if (!springsRef.current.has(key)) {
        springsRef.current.set(key, createSpring(c.h0));
      } else {
        const sp = springsRef.current.get(key);
        if (sp) sp.t = c.h0;
      }
    }

    const loop = (currentTime: number) => {
      const dt = clamp((currentTime - prevTime) / 1000, 0, 0.1);
      prevTime = currentTime;
      timeRef.current += dt;

      const over = overRef.current;
      const R = intensity * CELL * (isWide ? 3.6 : 2.8);

      const shock = shockwaveRef.current;
      const shockAge = shock ? (currentTime - shock.time) / 1000 : 999;
      if (shock && shockAge > 1.2) {
        shockwaveRef.current = null;
      }

      for (const c of columns) {
        const key = `${c.i}-${c.j}`;
        const sp = springsRef.current.get(key);
        if (!sp) continue;

        if (over) {
          const dx = (c.i + 0.5) * CELL - over[0];
          const dy = (c.j + 0.5) * CELL - over[1];
          const dist = Math.hypot(dx, dy);
          const f = falloff(dist / R);
          // Graceful cohesive elevation cone preserving base commit volumes
          sp.t = Math.min(HMAX, c.h0 + 22 * f);
        } else {
          // Ambient subtle shimmer
          const t = timeRef.current * 1.5;
          const shimmer = Math.sin(t + c.i * 0.35 + c.j * 0.4) * 0.8;
          sp.t = Math.max(2, c.h0 + shimmer);
        }

        // Apply shockwave bump if active
        if (shock && shockAge < 1.0) {
          const sDist = Math.hypot(c.i - shock.col, c.j - shock.row);
          const waveFront = shockAge * (isWide ? 26 : 8);
          const waveDist = Math.abs(sDist - waveFront);
          if (waveDist < 1.8) {
            const shockLift = (1 - waveDist / 1.8) * (1 - shockAge) * 20;
            sp.t += shockLift;
          }
        }

        stepSpring(sp, dt);

        const h = Math.max(0.6, sp.x);
        const nodeEls = domRefs.current.get(key);
        if (nodeEls?.sil && nodeEls?.cr) {
          const p = prism(P, front, c.ring, c.inner, 0, h);
          nodeEls.sil.setAttribute("d", p.sil);
          nodeEls.cr.setAttribute("d", p.crease);
        }
      }

      // Update 9-dot punch matrix indicator on top of the hovered pillar
      if (over && hoverRef.current) {
        const mcKey = `${hoverRef.current.col}-${hoverRef.current.row}`;
        const mcSp = springsRef.current.get(mcKey);
        const colMeta = columns.find(
          (cm) => cm.i === hoverRef.current?.col && cm.j === hoverRef.current?.row
        );
        const targetSlot = domRefs.current.get(mcKey)?.mark;
        if (colMeta && markGroupRef.current) {
          if (targetSlot && (markGroupRef.current.parentNode as Node | null) !== targetSlot) {
            targetSlot.appendChild(markGroupRef.current);
          }
          markGroupRef.current.classList.toggle("for-dark-bar", colMeta.isDark);
          markGroupRef.current.classList.toggle("for-light-bar", !colMeta.isDark);
          markGroupRef.current.style.opacity = "1";
          const cx = (colMeta.i + 0.5) * CELL;
          const cy = (colMeta.j + 0.5) * CELL;
          const h = Math.max(0.6, mcSp ? mcSp.x : colMeta.h0);
          dotRefs.current.forEach((el, k) => {
            if (!el) return;
            const dx = cx + ((k % 3) - 1) * 2.5;
            const dy = cy + (Math.floor(k / 3) - 1) * 2.5;
            const pt = P(dx, dy, h + 0.25);
            el.setAttribute("cx", String(r2(pt[0])));
            el.setAttribute("cy", String(r2(pt[1])));
          });
        }
      } else if (markGroupRef.current) {
        markGroupRef.current.style.opacity = "0";
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [numCols, numRows, CELL, HMAX, P, front, intensity, columns, isWide]);

  // Reset hover on matrix change
  useEffect(() => {
    hoverRef.current = null;
    overRef.current = null;
    if (
      markGroupRef.current &&
      hiddenHostRef.current &&
      (markGroupRef.current.parentNode as Node | null) !== hiddenHostRef.current
    ) {
      hiddenHostRef.current.appendChild(markGroupRef.current);
    }
  }, [numCols, numRows, scheme, mode, range]);

  const getHitColumn = useCallback(
    (sx: number, sy: number): { col: number; row: number } | null => {
      // Horizontal and vertical reach radii for isometric columns
      const rx = CELL * 0.5 * C.S * 1.35;
      const ry = rx * C.k;

      let bestCol: ColumnMeta | null = null;
      let minD2 = Infinity;

      const currentHover = hoverRef.current;

      for (let k = 0; k < columns.length; k++) {
        const c = columns[k];
        const isHovered = currentHover && currentHover.col === c.i && currentHover.row === c.j;

        // Effective top cap boundary (extends up to live spring height if currently elevated)
        let topY = c.capY;
        if (isHovered) {
          const sp = springsRef.current.get(`${c.i}-${c.j}`);
          if (sp && sp.x > c.h0) {
            topY = Math.min(topY, P((c.i + 0.5) * CELL, (c.j + 0.5) * CELL, sp.x)[1]);
          }
        }

        // Horizontal distance from column center line
        const dx = (sx - c.cx) / rx;

        // Vertical distance to the pillar segment [topY, c.baseY]
        // dy is 0 anywhere along the pillar's body, base, or cap
        const clampedY = Math.max(topY, Math.min(c.baseY, sy));
        const dy = (sy - clampedY) / ry;

        let d2 = dx * dx + dy * dy;

        // Hysteresis deadband: give currently hovered column a stability preference
        if (isHovered) {
          d2 *= 0.55;
        }

        if (d2 < minD2) {
          minD2 = d2;
          bestCol = c;
        }
      }

      // Check boundary: if closest column is too far (cursor in empty space or preview padding)
      if (minD2 > 2.2) {
        return null;
      }

      return bestCol ? { col: bestCol.i, row: bestCol.j } : null;
    },
    [C, CELL, columns, P]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const sx = ((e.clientX - rect.left) / rect.width) * VIEW_W;
      const sy = ((e.clientY - rect.top) / rect.height) * VIEW_H;

      const hit = getHitColumn(sx, sy);

      if (!hit) {
        if (hoverRef.current) {
          const prev = hoverRef.current;
          const prevKey = `${prev.col}-${prev.row}`;
          const prevNode = domRefs.current.get(prevKey);
          prevNode?.sil?.classList.remove("hovered");
          prevNode?.cr?.classList.remove("hovered");
          hoverRef.current = null;
        }
        overRef.current = null;
        if (markGroupRef.current) {
          markGroupRef.current.style.opacity = "0";
        }
        onHover?.(null);
        return;
      }

      const colIdx = hit.col;
      const rowIdx = hit.row;

      // Inside terrain: center elevation mound on hovered pillar
      overRef.current = [(colIdx + 0.5) * CELL, (rowIdx + 0.5) * CELL];

      const prev = hoverRef.current;
      if (!prev || prev.col !== colIdx || prev.row !== rowIdx) {
        if (colorOnHover) {
          if (prev) {
            const prevKey = `${prev.col}-${prev.row}`;
            const prevNode = domRefs.current.get(prevKey);
            prevNode?.sil?.classList.remove("hovered");
            prevNode?.cr?.classList.remove("hovered");
          }
          const newKey = `${colIdx}-${rowIdx}`;
          const newNode = domRefs.current.get(newKey);
          newNode?.sil?.classList.add("hovered");
          newNode?.cr?.classList.add("hovered");
        }

        hoverRef.current = { col: colIdx, row: rowIdx };
        const sp = springsRef.current.get(`${colIdx}-${rowIdx}`);
        const colMeta = columns.find((cm) => cm.i === colIdx && cm.j === rowIdx);
        onHover?.(
          colMeta
            ? {
                ...colMeta.node,
                color: colMeta.color,
                height: sp ? sp.x : colMeta.h0,
              }
            : null
        );
      }
    },
    [VIEW_W, VIEW_H, getHitColumn, CELL, colorOnHover, columns, onHover]
  );

  const handlePointerLeave = useCallback(() => {
    if (hoverRef.current) {
      const prev = hoverRef.current;
      const prevKey = `${prev.col}-${prev.row}`;
      const prevNode = domRefs.current.get(prevKey);
      prevNode?.sil?.classList.remove("hovered");
      prevNode?.cr?.classList.remove("hovered");
    }
    overRef.current = null;
    hoverRef.current = null;
    if (markGroupRef.current) {
      markGroupRef.current.style.opacity = "0";
    }
    onHover?.(null);
  }, [onHover]);

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const sx = ((e.clientX - rect.left) / rect.width) * VIEW_W;
      const sy = ((e.clientY - rect.top) / rect.height) * VIEW_H;

      const hit = getHitColumn(sx, sy);
      if (!hit) return;

      const colIdx = hit.col;
      const rowIdx = hit.row;

      shockwaveRef.current = { col: colIdx, row: rowIdx, time: performance.now() };

      const sp = springsRef.current.get(`${colIdx}-${rowIdx}`);
      const colMeta = columns.find((cm) => cm.i === colIdx && cm.j === rowIdx);
      if (colMeta) {
        onClick?.({
          ...colMeta.node,
          color: colMeta.color,
          height: sp ? sp.x : colMeta.h0,
        });
      }
    },
    [VIEW_W, VIEW_H, getHitColumn, columns, onClick]
  );

  return (
    <>
      <style>{`
        .hl-heatmap-${instanceId} {
          position: relative;
          display: block;
          aspect-ratio: ${VIEW_W} / ${VIEW_H};
          width: 100%;
          touch-action: none;
          user-select: none;
          cursor: crosshair;
        }

        .hl-heatmap-${instanceId} svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          overflow: visible;
        }

        .hl-heatmap-${instanceId} .plinth-sil {
          fill: ${palette.plinthFill};
          stroke: ${palette.plinthStroke};
          stroke-width: 0.95;
          stroke-linejoin: round;
        }

        .hl-heatmap-${instanceId} .plinth-cr {
          fill: none;
          stroke: ${palette.plinthCrease};
          stroke-width: 0.85;
        }

        .hl-heatmap-${instanceId} .col-sil {
          fill: var(--base-fill, ${mode === "dark" ? "#151b23" : "#ffffff"});
          stroke: ${palette.colStroke};
          stroke-width: 0.85;
          stroke-linejoin: round;
          transition: stroke 120ms ease;
        }

        .hl-heatmap-${instanceId} .col-cr {
          fill: none;
          stroke: ${palette.colCrease};
          stroke-width: 0.65;
          transition: stroke 120ms ease;
        }

        /* Per-bar luminance-adaptive outline contrast:
           Dark colors get a light outline.
           Light colors get a dark outline. */
        .hl-heatmap-${instanceId} .is-dark-bar .col-sil {
          stroke: ${mode === "dark" ? "rgba(255, 255, 255, 0.22)" : "rgba(255, 255, 255, 0.60)"};
        }

        .hl-heatmap-${instanceId} .is-dark-bar .col-cr {
          stroke: ${mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.30)"};
        }

        .hl-heatmap-${instanceId} .is-dark-bar .col-sil.hovered {
          stroke: #ffffff;
          stroke-width: 1.15;
        }

        .hl-heatmap-${instanceId} .is-dark-bar .col-cr.hovered {
          stroke: rgba(255, 255, 255, 0.70);
          stroke-width: 0.85;
        }

        .hl-heatmap-${instanceId} .is-light-bar .col-sil {
          stroke: ${mode === "dark" ? "rgba(0, 0, 0, 0.50)" : "rgba(15, 23, 42, 0.30)"};
        }

        .hl-heatmap-${instanceId} .is-light-bar .col-cr {
          stroke: ${mode === "dark" ? "rgba(0, 0, 0, 0.28)" : "rgba(15, 23, 42, 0.16)"};
        }

        .hl-heatmap-${instanceId} .is-light-bar .col-sil.hovered {
          stroke: ${mode === "dark" ? "#000000" : "#0f172a"};
          stroke-width: 1.15;
        }

        .hl-heatmap-${instanceId} .is-light-bar .col-cr.hovered {
          stroke: ${mode === "dark" ? "rgba(0, 0, 0, 0.65)" : "rgba(15, 23, 42, 0.60)"};
          stroke-width: 0.85;
        }

        .hl-heatmap-${instanceId} .punch-dot-center {
          fill: ${palette.dotCenter};
          stroke: none;
        }

        .hl-heatmap-${instanceId} .punch-dot-outer {
          fill: ${palette.dotOuter};
          stroke: none;
        }

        .hl-heatmap-${instanceId} .is-dark-bar .punch-dot-center,
        .hl-heatmap-${instanceId} .for-dark-bar .punch-dot-center {
          fill: #ffffff;
        }

        .hl-heatmap-${instanceId} .is-dark-bar .punch-dot-outer,
        .hl-heatmap-${instanceId} .for-dark-bar .punch-dot-outer {
          fill: rgba(255, 255, 255, 0.65);
        }

        .hl-heatmap-${instanceId} .is-light-bar .punch-dot-center,
        .hl-heatmap-${instanceId} .for-light-bar .punch-dot-center {
          fill: ${mode === "dark" ? "#000000" : "#0f172a"};
        }

        .hl-heatmap-${instanceId} .is-light-bar .punch-dot-outer,
        .hl-heatmap-${instanceId} .for-light-bar .punch-dot-outer {
          fill: ${mode === "dark" ? "rgba(0, 0, 0, 0.45)" : "rgba(15, 23, 42, 0.45)"};
        }
      `}</style>

      <div
        ref={containerRef}
        className={`hl-heatmap-${instanceId} ${className}`}
        style={style}
        role="region"
        aria-label={`Interactive 3D GitHub Heatmap with ${numCols} weeks by ${numRows} days`}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
        >
          {/* Ground Plinth */}
          <g className="plinth">
            <path className="plinth-sil" d={plinthPrism.sil} />
            <path className="plinth-cr" d={plinthPrism.crease} />
          </g>

          {/* Isometric Pillars */}
          <g className="pillars">
            {columns.map((c) => {
              const key = `${c.i}-${c.j}`;
              return (
                <g key={key} className={c.isDark ? "is-dark-bar" : "is-light-bar"}>
                  <path
                    ref={(el) => {
                      let node = domRefs.current.get(key);
                      if (!node) {
                        node = { sil: null, cr: null, mark: null };
                        domRefs.current.set(key, node);
                      }
                      node.sil = el;
                    }}
                    style={
                      c.color ? ({ "--base-fill": c.color } as React.CSSProperties) : undefined
                    }
                    className="col-sil"
                  />
                  <path
                    ref={(el) => {
                      let node = domRefs.current.get(key);
                      if (!node) {
                        node = { sil: null, cr: null, mark: null };
                        domRefs.current.set(key, node);
                      }
                      node.cr = el;
                    }}
                    className="col-cr"
                  />
                  <g
                    ref={(el) => {
                      let node = domRefs.current.get(key);
                      if (!node) {
                        node = { sil: null, cr: null, mark: null };
                        domRefs.current.set(key, node);
                      }
                      node.mark = el;
                    }}
                    className="col-mark-slot"
                  />
                </g>
              );
            })}
          </g>

          {/* Hidden Host for the 9-dot punch matrix when unattached */}
          <g ref={hiddenHostRef} style={{ display: "none" }}>
            <g
              ref={markGroupRef}
              className="hl-punch-matrix"
              style={{ opacity: 0, pointerEvents: "none", transition: "opacity 120ms ease" }}
            >
              {Array.from({ length: 9 }).map((_, k) => {
                const isCenter = k === 4;
                return (
                  <ellipse
                    key={k}
                    ref={(el) => {
                      dotRefs.current[k] = el;
                    }}
                    rx={r2((isCenter ? 0.65 : 0.52) * C.S)}
                    ry={r2((isCenter ? 0.65 : 0.52) * C.S * C.k)}
                    className={isCenter ? "punch-dot-center" : "punch-dot-outer"}
                  />
                );
              })}
            </g>
          </g>
        </svg>
      </div>
    </>
  );
}
