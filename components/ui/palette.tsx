"use client";

import React, { useId, useRef, useState, useEffect } from "react";
import { ArrowsClockwiseIcon, CheckIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * ══ Palette (OKLCH Harmonic Color Generator) ════════════════════
 * Tactile liquid color generator powered by perceptual OKLCH color space,
 * 5 harmonic generative moods, and two-phase elastic overshoot deformation.
 *
 * Architecture & Kinematics:
 * - Perceptual Uniformity: Colors are generated in OKLCH (Lightness, Chroma, Hue)
 *   where lightness steps are perceptually linear, unlike HSL.
 * - Gamut Boundary Tracing: Maximizes saturation by probing the sRGB boundary
 *   per channel rather than clipping (which shifts hues).
 * - Five Generative Moods:
 *   1. "ramp": Monochromatic harmonic scale with lightness gradient.
 *   2. "spread": Wide 40°–70° hue fan at consistent luminance.
 *   3. "pair": Near-complementary opposite pairs.
 *   4. "triad": Three equidistant hues (120° triadic harmony).
 *   5. "accent": Muted soft brights with one deep saturated contrast anchor.
 * - Liquid Seam Blending: Dynamic SVG alpha-threshold filter expands during
 *   deformation and settles to zero blur at rest to preserve crisp segment edges.
 * ═════════════════════════════════════════════════════════════════
 */

export type PaletteTheme = "light" | "dark";
export type PaletteMood = "ramp" | "spread" | "pair" | "triad" | "accent";

export interface PaletteProps {
  /** Number of color swatches (3..5, default: 4) */
  count?: number;
  /** Swatch corner radius in px (0..29, default: 14) */
  corner?: number;
  /** Morph speed tuning factor (0..100, default: 50) */
  morph?: number;
  /** Visual theme mode (default: "light") */
  theme?: PaletteTheme;
  /** Initial array of hex colors for SSR hydration consistency */
  initialPalette?: string[];
  /** Callback fired when a new palette is generated */
  onGenerate?: (colors: string[]) => void;
  /** Callback fired when a swatch hex is copied */
  onCopy?: (hex: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface Swatch {
  hex: string;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const stillness = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const rate = (speed: number) => 1.6 - (speed / 100) * 1.2;

/* ── OKLCH → sRGB Hex Converter ───────────────────────────── */
function hex(L: number, C: number, H: number): string {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3,
    m = m_ ** 3,
    s = s_ ** 3;

  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];

  return (
    "#" +
    lin
      .map((v) => {
        const g = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.abs(v) ** (1 / 2.4) - 0.055;
        return Math.round(clamp(g, 0, 1) * 255)
          .toString(16)
          .padStart(2, "0");
      })
      .join("")
  );
}

/* ── Gamut Boundary Check & Chroma Extraction ─────────────── */
function fits(L: number, C: number, H: number): boolean {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const e = 0.0005;
  return r >= -e && r <= 1 + e && g >= -e && g <= 1 + e && bl >= -e && bl <= 1 + e;
}

function vivid(L: number, C: number, H: number): string {
  let c = C;
  while (c > 0.01 && !fits(L, c, H)) c -= 0.004;
  return hex(L, c, H);
}

const MOODS: PaletteMood[] = ["ramp", "spread", "pair", "triad", "accent"];
let lastBase = Math.random() * 360;
let lastMood: PaletteMood | null = null;

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const wrap = (h: number) => ((h % 360) + 360) % 360;

function generatePalette(n: number): Swatch[] {
  const base = wrap(lastBase + rnd(60, 300));
  lastBase = base;
  const pool = MOODS.filter((m) => m !== lastMood);
  const mood = pool[Math.floor(Math.random() * pool.length)];
  lastMood = mood;
  const dir = Math.random() < 0.5 ? -1 : 1;

  const out: [number, number, number][] = [];
  for (let i = 0; i < n; i++) {
    const p = n === 1 ? 0 : i / (n - 1);
    switch (mood) {
      case "ramp": {
        const step = rnd(14, 26) * dir;
        out.push([0.9 - p * 0.48, 0.12 + Math.sin(p * Math.PI) * 0.12, base + i * step]);
        break;
      }
      case "spread": {
        const step = rnd(40, 70) * dir;
        out.push([rnd(0.66, 0.8), 0.24, base + i * step]);
        break;
      }
      case "pair": {
        const other = i % 2 === 1;
        const deep = i >= n / 2;
        out.push([
          deep ? rnd(0.46, 0.56) : rnd(0.8, 0.88),
          0.22,
          base + (other ? rnd(160, 190) : 0),
        ]);
        break;
      }
      case "triad": {
        out.push([rnd(0.58, 0.82), 0.22, base + (i % 3) * 120 * dir + rnd(-8, 8)]);
        break;
      }
      default: {
        const deep = i === n - 1;
        out.push(
          deep ? [0.52, 0.26, base + 180 * dir] : [rnd(0.8, 0.87), 0.18, base + i * 18 * dir]
        );
      }
    }
  }

  // Sort descending by lightness so values step harmoniously
  out.sort((x, y) => y[0] - x[0]);

  // Keep yellows bright (below 0.62 L they turn olive/brown)
  for (const c of out) {
    const h = wrap(c[2]);
    if (h > 60 && h < 120 && c[0] < 0.62) {
      c[0] = 0.62 + (0.62 - c[0]) * 0.2;
    }
  }

  return out.map(([L, C, H]) => ({ hex: vivid(L, C, wrap(H)) }));
}

function useGoo(blur = 7, cut = 28) {
  const id = `goo-${useId().replace(/:/g, "")}`;
  const goo = (
    <svg className="absolute h-0 w-0 overflow-hidden" aria-hidden="true" focusable="false">
      <defs>
        <filter
          id={id}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="smear" />
          <feColorMatrix
            in="smear"
            type="matrix"
            values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${cut} ${-(cut / 2)}`}
          />
        </filter>
      </defs>
    </svg>
  );
  return { id, url: `url(#${id})`, goo };
}

/* ── Geometry & Layout Tokens ─────────────────────────────── */
const W = 300;
const PAD = 10;
const BAR_H = 58;
const TOOL = 30;
const GAP = 6;
const CORNER = 14;
const BASE = 760;
const SEAM = 4;
const HEAT = 5;

/* ── Elastic Overshoot Kinematics ─────────────────────────── */
const OUT = 0.4;
const back = (k: number) => {
  const c = 1.7;
  const u = k - 1;
  return 1 + (c + 1) * u ** 3 + c * u ** 2;
};

const swellOf = (ti: number) =>
  ti <= 0 ? 0 : ti < OUT ? 1 - (1 - ti / OUT) ** 3 : 1 - back((ti - OUT) / (1 - OUT));

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const INITIAL_PALETTES: Record<number, Swatch[]> = {
  3: [{ hex: "#fe5a5f" }, { hex: "#5e86fe" }, { hex: "#0ca854" }],
  4: [{ hex: "#feaaa6" }, { hex: "#fe5a5f" }, { hex: "#5e86fe" }, { hex: "#0ca854" }],
  5: [
    { hex: "#feaaa6" },
    { hex: "#fe5a5f" },
    { hex: "#5e86fe" },
    { hex: "#0ca854" },
    { hex: "#8a3ffc" },
  ],
};

export function Palette({
  count = 4,
  corner = CORNER,
  morph = 50,
  theme = "light",
  initialPalette,
  onGenerate,
  onCopy,
  className = "",
  style,
}: PaletteProps) {
  const isDark = theme === "dark";
  const n = clamp(Math.round(count), 3, 5);

  const [pal, setPal] = useState<Swatch[]>(() => {
    if (initialPalette && initialPalette.length >= n) {
      return initialPalette.slice(0, n).map((h) => ({ hex: h }));
    }
    return INITIAL_PALETTES[n] || INITIAL_PALETTES[4];
  });
  const [prevN, setPrevN] = useState(n);
  if (prevN !== n) {
    setPrevN(n);
    if (initialPalette && initialPalette.length >= n) {
      setPal(initialPalette.slice(0, n).map((h) => ({ hex: h })));
    } else {
      setPal(INITIAL_PALETTES[n] || INITIAL_PALETTES[4]);
    }
  }

  const [next, setNext] = useState<Swatch[] | null>(null);
  const [t, setT] = useState(0);
  const [spins, setSpins] = useState(0);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const raf = useRef(0);
  const copyTimer = useRef<number | null>(null);

  const heat = Math.sin(Math.PI * clamp(t, 0, 1)) * HEAT;
  const { url: gooUrl, goo } = useGoo(heat, 26);

  useEffect(() => {
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, []);

  if (pal.length !== n) {
    const fresh = INITIAL_PALETTES[n] || INITIAL_PALETTES[4];
    setPal(fresh);
    setNext(null);
  }

  const roll = () => {
    if (raf.current) return;
    setSpins((s) => s + 1);

    const fresh = generatePalette(n);
    onGenerate?.(fresh.map((s) => s.hex));

    if (stillness()) {
      setPal(fresh);
      return;
    }

    setNext(fresh);
    const ms = BASE * rate(clamp(morph, 0, 100));
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      setT(p);
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        raf.current = 0;
        setPal(fresh);
        setNext(null);
        setT(0);
      }
    };
    raf.current = requestAnimationFrame(tick);
  };

  const handleCopy = (hexVal: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(hexVal);
      }
    } catch {
      // Ignore clipboard permission issues
    }
    setCopiedHex(hexVal);
    onCopy?.(hexVal);
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopiedHex(null), 1400);
  };

  const toolW = TOOL + PAD * 2;
  const barW = W - toolW - GAP - PAD * 2;
  const seg = (barW - SEAM * (n - 1)) / n;
  const step = seg + SEAM;
  const r = clamp(corner, 0, BAR_H / 2);
  const slabR = r + PAD * Math.min(1, r / CORNER);
  const beat = 1 - 0.035 * swellOf(clamp(t, 0, 1));

  return (
    <div
      className={cn("relative flex items-stretch font-sans select-none", className)}
      style={{ width: W, gap: GAP, ...style }}
    >
      {/* Pill 1: Swatches Container */}
      <div
        className={cn(
          "flex items-center justify-center transition-colors duration-300",
          isDark
            ? "bg-[#1a1a1a] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
            : "bg-[#ffffff] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
        )}
        style={{ padding: PAD, borderRadius: slabR, scale: beat }}
      >
        <div className="relative flex-none" style={{ height: BAR_H, width: barW }}>
          <div className="absolute inset-0" aria-hidden="true" style={{ filter: gooUrl }}>
            {pal.map((c, i) => {
              const ti = clamp(t, 0, 1);
              const shown = next && ti >= OUT ? next[i].hex : c.hex;
              const d = Math.max(0, swellOf(ti));

              const side = mix(seg, BAR_H * 0.66, d);
              const h = mix(BAR_H, BAR_H * 0.66, d);
              const isCopied = copiedHex === shown;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleCopy(shown)}
                  title={`Copy ${shown}`}
                  aria-label={`Copy color ${shown}`}
                  className="absolute top-0 left-0 cursor-pointer border-0 p-0 transition-transform duration-100 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    background: shown,
                    width: side,
                    height: h,
                    top: (BAR_H - h) / 2,
                    borderRadius: mix(r, h / 2, d),
                    transform: `translateX(${(i * step + (seg - side) / 2).toFixed(2)}px)`,
                  }}
                >
                  {isCopied && (
                    <span className="animate-in fade-in zoom-in-75 flex h-full w-full items-center justify-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] duration-150">
                      <CheckIcon size={16} weight="bold" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pill 2: Refresh Tool Button */}
      <div
        className={cn(
          "flex flex-none items-center justify-center transition-all duration-160 ease-[cubic-bezier(0.22,1,0.36,1)] has-active:scale-[0.96] motion-reduce:duration-160",
          isDark
            ? "bg-[#1a1a1a] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
            : "bg-[#ffffff] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
        )}
        style={{ padding: PAD, borderRadius: slabR }}
      >
        <button
          type="button"
          className={cn(
            "grid flex-none cursor-pointer place-items-center border-0 bg-transparent transition-colors duration-160 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:duration-160",
            isDark
              ? "text-[#ffffff] hover:text-[#9a9a9a] focus-visible:ring-[#ffffff]/40 focus-visible:ring-offset-[#1a1a1a]"
              : "text-[#18181b] hover:text-[#71717a] focus-visible:ring-[#18181b]/30 focus-visible:ring-offset-[#ffffff]"
          )}
          onClick={roll}
          aria-label="Generate a new palette"
          style={{ width: TOOL, height: BAR_H, borderRadius: r }}
        >
          <ArrowsClockwiseIcon
            size={24}
            className="transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-160"
            style={{ transform: `rotate(${spins * 180}deg)` }}
          />
        </button>
      </div>

      {goo}
    </div>
  );
}
