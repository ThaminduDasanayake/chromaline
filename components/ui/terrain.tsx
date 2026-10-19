"use client";

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

/* ══ Terrain ═══════════════════════════════════════════════
   An interactive 3D isometric topographic surface of pillars on a plinth.
   Features:
   - Configurable grid dimensions (e.g. 7×7, 9×9, 11×11, 13×13 nodes)
   - Clickable & selectable pillars with coordinate resolution
   - Cursor tracking with tactile spring elevation
   - Shockwave ripple impulse on click
   - Autonomous idle wave kinematics
   ─────────────────────────────────────────────────────────── */

export interface TerrainNode {
  row: number;
  col: number;
  height: number;
}

export interface TerrainProps {
  /** Number of pillars along each axis. e.g. 7 (49), 9 (81), 11 (121), 13 (169). Default: 9 */
  gridSize?: number;
  /** Spring response radius/intensity (0.2 subtle to 1.5 wide). Default: 0.6 */
  intensity?: number;
  /** Whether the terrain plays an autonomous wave loop when idle. Default: true */
  play?: boolean;
  /** Selected pillar coordinate */
  selected?: { row: number; col: number } | null;
  /** Default selected pillar */
  defaultSelected?: { row: number; col: number } | null;
  /** Callback fired when a pillar is clicked */
  onClick?: (node: TerrainNode) => void;
  /** Callback fired when a pillar is hovered */
  onHover?: (node: TerrainNode | null) => void;
  /** Accent color for selected / active node */
  accentColor?: string;
  className?: string;
  style?: React.CSSProperties;
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

function unproj(C: Camera, sx: number, sy: number, z: number): [number, number] {
  const c = Math.cos(C.az);
  const s = Math.sin(C.az);
  const zf = Math.sqrt(1 - C.k * C.k);
  const X = (sx - C.ox) / C.S;
  const Y = ((sy - C.oy) / C.S + z * zf) / C.k;
  return [X * c + Y * s, -X * s + Y * c];
}

function fit(C: Camera, pts: number[][], cx: number, cy: number) {
  C.ox = 0;
  C.oy = 0;
  const P = proj(C);
  let a = 1e9,
    b = -1e9,
    c = 1e9,
    d = -1e9;
  for (const p of pts) {
    const q = P(p[0], p[1], p[2]);
    a = Math.min(a, q[0]);
    b = Math.max(b, q[0]);
    c = Math.min(c, q[1]);
    d = Math.max(d, q[1]);
  }
  C.ox = cx - (a + b) / 2;
  C.oy = cy - (c + d) / 2;
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

const ringAt = (P: (x: number, y: number, z: number) => [number, number], ring: Point2D[], z: number) =>
  ring.map((q) => P(q.u, q.v, z));

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
  u <= 0 ? 1 : u <= 0.417 ? 1 - (u / 0.417) * 0.6875 : u <= 1 ? 0.3125 - ((u - 0.417) / 0.583) * 0.2185 : 0.094;

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
}

export function Terrain({
  gridSize = 9,
  intensity = 0.6,
  play = true,
  selected: controlledSelected,
  defaultSelected = null,
  onClick,
  onHover,
  accentColor = "#E54F10",
  className = "",
  style = {},
}: TerrainProps) {
  const instanceId = useId();
  const N = Math.max(5, Math.min(17, gridSize));
  const CELL = 14;
  const FOOT = 11;
  const HMAX = 56;
  const EXT = N * CELL;
  const PB = 5;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(
    defaultSelected
  );
  const activeSelected = controlledSelected !== undefined ? controlledSelected : selectedCell;

  const hoverRef = useRef<{ row: number; col: number } | null>(null);
  const overRef = useRef<[number, number] | null>(null);
  const shockwaveRef = useRef<{ row: number; col: number; time: number } | null>(null);
  const timeRef = useRef(0);

  // Setup Camera via useMemo
  const C = useMemo(() => {
    const cam = Cam(45, 0.5, 1.58);
    fit(
      cam,
      [
        [-6, -6, -PB],
        [EXT + 6, EXT + 6, -PB],
        [EXT + 6, -6, -PB],
        [-6, EXT + 6, -PB],
        [0, 0, HMAX * 0.75],
      ],
      200,
      166
    );
    return cam;
  }, [EXT, PB, HMAX]);

  const P = useMemo(() => proj(C), [C]);
  const front = useMemo(() => facing(C), [C]);

  // Base Plinth Rings & Shape
  const plinthPrism = useMemo(() => {
    const [pr, pi] = rings(-6, -6, EXT + 6, EXT + 6, 9, 2.2);
    return prism(P, front, pr, pi, -PB, 0);
  }, [EXT, P, front, PB]);

  // Columns layout via useMemo
  const columns = useMemo<ColumnMeta[]>(() => {
    const cols: ColumnMeta[] = [];
    for (let s = 0; s <= 2 * (N - 1); s++) {
      for (let i = 0; i < N; i++) {
        const j = s - i;
        if (j < 0 || j >= N) continue;
        const u = i / (N - 1);
        const v = j / (N - 1);
        const h0 =
          4 +
          25 * Math.exp(-((u - 0.22) ** 2 + (v - 0.74) ** 2) / 0.07) +
          12 * Math.exp(-((u - 0.8) ** 2 + (v - 0.26) ** 2) / 0.035);

        const x0 = i * CELL + (CELL - FOOT) / 2;
        const y0 = j * CELL + (CELL - FOOT) / 2;
        const [ring, inner] = rings(x0, y0, x0 + FOOT, y0 + FOOT, 2.6, 0.9);

        cols.push({ i, j, h0, ring, inner });
      }
    }
    return cols;
  }, [N, CELL, FOOT]);

  // Node element references for direct SVG path mutation without re-renders
  const domRefs = useRef<
    Map<
      string,
      {
        sil: SVGPathElement | null;
        cr: SVGPathElement | null;
        dot: SVGEllipseElement | null;
      }
    >
  >(new Map());

  const springsRef = useRef<Map<string, SpringState>>(new Map());

  // Main Animation & Physics Loop
  useEffect(() => {
    let raf = 0;
    let prevTime = performance.now();

    // Initialize or prune springs
    for (const c of columns) {
      const key = `${c.i}-${c.j}`;
      if (!springsRef.current.has(key)) {
        springsRef.current.set(key, createSpring(c.h0));
      }
    }

    const loop = (currentTime: number) => {
      const dt = clamp((currentTime - prevTime) / 1000, 0, 0.1);
      prevTime = currentTime;
      timeRef.current += dt;

      const over = overRef.current;
      const R = intensity * CELL * (N / 9);

      // Check shockwave
      const shock = shockwaveRef.current;
      const shockAge = shock ? (currentTime - shock.time) / 1000 : 999;
      if (shock && shockAge > 1.2) {
        shockwaveRef.current = null;
      }

      // Update target elevations
      for (const c of columns) {
        const key = `${c.i}-${c.j}`;
        const sp = springsRef.current.get(key);
        if (!sp) continue;

        if (over) {
          const dx = (c.i + 0.5) * CELL - over[0];
          const dy = (c.j + 0.5) * CELL - over[1];
          const dist = Math.hypot(dx, dy);
          sp.t = HMAX * falloff(dist / R);
        } else if (play) {
          // Autonomous breathing wave
          const t = timeRef.current * 1.5;
          const u = c.i / (N - 1);
          const v = c.j / (N - 1);
          const wave =
            Math.sin(u * 4 + t) * 6 +
            Math.cos(v * 4 + t * 0.8) * 6 +
            Math.sin((u + v) * 3 - t) * 4;
          sp.t = Math.max(3, c.h0 + wave);
        } else {
          sp.t = c.h0;
        }

        // Apply shockwave bump if active
        if (shock && shockAge < 1.0) {
          const sDist = Math.hypot(c.i - shock.row, c.j - shock.col);
          const waveFront = shockAge * 8;
          const waveDist = Math.abs(sDist - waveFront);
          if (waveDist < 1.8) {
            const shockLift = (1 - waveDist / 1.8) * (1 - shockAge) * 20;
            sp.t += shockLift;
          }
        }

        // Keep pinned height if currently selected
        const isSel = activeSelected?.row === c.i && activeSelected?.col === c.j;
        if (isSel) {
          sp.t = Math.max(sp.t, HMAX * 0.85);
        }

        stepSpring(sp, dt);

        // Update DOM element directly
        const h = Math.max(0.6, sp.x);
        const nodeEls = domRefs.current.get(key);
        if (nodeEls?.sil && nodeEls?.cr) {
          const p = prism(P, front, c.ring, c.inner, 0, h);
          nodeEls.sil.setAttribute("d", p.sil);
          nodeEls.cr.setAttribute("d", p.crease);
        }

        if (nodeEls?.dot) {
          const cx = (c.i + 0.5) * CELL;
          const cy = (c.j + 0.5) * CELL;
          const pt = P(cx, cy, h + 1);
          nodeEls.dot.setAttribute("cx", String(r2(pt[0])));
          nodeEls.dot.setAttribute("cy", String(r2(pt[1])));
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [N, CELL, HMAX, P, front, intensity, play, activeSelected, columns]);

  // Handle pointer interactions
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const sx = ((e.clientX - rect.left) / rect.width) * 200;
      const sy = ((e.clientY - rect.top) / rect.height) * 166;
      const [wx, wy] = unproj(C, sx, sy, 0);

      overRef.current = [wx, wy];

      const row = clamp(Math.floor(wx / CELL), 0, N - 1);
      const col = clamp(Math.floor(wy / CELL), 0, N - 1);

      if (!hoverRef.current || hoverRef.current.row !== row || hoverRef.current.col !== col) {
        hoverRef.current = { row, col };
        const sp = springsRef.current.get(`${row}-${col}`);
        onHover?.({ row, col, height: sp ? sp.x : 0 });
      }
    },
    [C, CELL, N, onHover]
  );

  const handlePointerLeave = useCallback(() => {
    overRef.current = null;
    hoverRef.current = null;
    onHover?.(null);
  }, [onHover]);

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const sx = ((e.clientX - rect.left) / rect.width) * 200;
      const sy = ((e.clientY - rect.top) / rect.height) * 166;
      const [wx, wy] = unproj(C, sx, sy, 0);

      const row = clamp(Math.floor(wx / CELL), 0, N - 1);
      const col = clamp(Math.floor(wy / CELL), 0, N - 1);

      setSelectedCell({ row, col });
      shockwaveRef.current = { row, col, time: performance.now() };

      const sp = springsRef.current.get(`${row}-${col}`);
      onClick?.({ row, col, height: sp ? sp.x : 0 });
    },
    [C, CELL, N, onClick]
  );

  return (
    <>
      <style>{`
        .hl-terrain-${instanceId} {
          position: relative;
          display: block;
          aspect-ratio: 5 / 4;
          touch-action: none;
          user-select: none;
          cursor: crosshair;
        }

        .hl-terrain-${instanceId} svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          overflow: visible;
        }

        .hl-terrain-${instanceId} .plinth-sil {
          fill: #f8fafc;
          stroke: #0f172a;
          stroke-width: 0.95;
          stroke-linejoin: round;
        }

        .hl-terrain-${instanceId} .plinth-cr {
          fill: none;
          stroke: rgba(15, 23, 42, 0.12);
          stroke-width: 0.85;
        }

        .hl-terrain-${instanceId} .col-sil {
          fill: #ffffff;
          stroke: #0f172a;
          stroke-width: 0.9;
          stroke-linejoin: round;
          transition: fill 200ms ease;
        }

        .hl-terrain-${instanceId} .col-sil.selected {
          fill: ${accentColor};
          stroke: #0f172a;
          stroke-width: 1.1;
        }

        .hl-terrain-${instanceId} .col-cr {
          fill: none;
          stroke: rgba(15, 23, 42, 0.14);
          stroke-width: 0.75;
        }

        .hl-terrain-${instanceId} .beacon-dot {
          fill: ${accentColor};
          stroke: #ffffff;
          stroke-width: 0.8;
          opacity: 0;
          transition: opacity 200ms ease;
        }

        .hl-terrain-${instanceId} .beacon-dot.active {
          opacity: 1;
        }
      `}</style>

      <div
        ref={containerRef}
        className={`hl-terrain-${instanceId} ${className}`}
        style={style}
        role="region"
        aria-label={`Interactive ${N} by ${N} pillar terrain surface`}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 200 166"
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
              const isSelected = activeSelected?.row === c.i && activeSelected?.col === c.j;
              return (
                <g key={key}>
                  <path
                    ref={(el) => {
                      let node = domRefs.current.get(key);
                      if (!node) {
                        node = { sil: null, cr: null, dot: null };
                        domRefs.current.set(key, node);
                      }
                      node.sil = el;
                    }}
                    className={`col-sil ${isSelected ? "selected" : ""}`}
                  />
                  <path
                    ref={(el) => {
                      let node = domRefs.current.get(key);
                      if (!node) {
                        node = { sil: null, cr: null, dot: null };
                        domRefs.current.set(key, node);
                      }
                      node.cr = el;
                    }}
                    className="col-cr"
                  />
                  <ellipse
                    ref={(el) => {
                      let node = domRefs.current.get(key);
                      if (!node) {
                        node = { sil: null, cr: null, dot: null };
                        domRefs.current.set(key, node);
                      }
                      node.dot = el;
                    }}
                    rx="1.2"
                    ry="0.6"
                    className={`beacon-dot ${isSelected ? "active" : ""}`}
                  />
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </>
  );
}
