"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * ══ Card stack ════════════════════════════════════════════
 * A short pile of cards that fans out when you go near it and
 * packs itself away when you leave.
 *
 * ── IT IS ONE ROTATION PER CARD, AND NOTHING ELSE ─────────
 * The pivot is a point 200px BELOW the pile, well outside the
 * block, and `transform-origin` puts it there — which means
 * the sideways travel, the arc that drops the outer cards
 * lower than the middle one, and the tilt are all the same
 * rotation. The fan cannot come apart, because there is
 * nothing to come apart.
 *
 * ── AND THE SCATTER IS SEEDED, NOT RANDOM ─────────────────
 * Five columns per card, all in -1..1, all multiplied by Scatter:
 * how far off square it sits in the pile, how far off centre in
 * each axis, how late it is out of the pile, and how much livelier
 * or heavier its own spring is than the knob says.
 */

const springOf = (tune: number) => ({
  /* stiffness: how hard it is pulled toward the target */
  k: 0.08 + (tune / 100) * 0.16,
  /* decay, per frame: how much of the velocity survives */
  d: 0.62 + (tune / 100) * 0.2,
});

function useSpring(target: number, tune = 50, instant = false) {
  const [at, setAt] = useState(target);
  const cur = useRef(target);
  const vel = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    if (instant) {
      cur.current = target;
      vel.current = 0;
      const id = requestAnimationFrame(() => setAt(target));
      return () => cancelAnimationFrame(id);
    }
    const { k, d } = springOf(tune);
    let prev = 0;
    const tick = (t: number) => {
      const dt = prev ? clamp((t - prev) / 16.67, 0, 2.5) : 1;
      prev = t;
      vel.current += (target - cur.current) * k * dt;
      vel.current *= Math.pow(d, dt);
      cur.current += vel.current * dt;
      if (Math.abs(target - cur.current) < 0.02 && Math.abs(vel.current) < 0.02) {
        cur.current = target;
        vel.current = 0;
        setAt(target);
        raf.current = 0;
        return;
      }
      setAt(cur.current);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [target, tune, instant]);

  return at;
}

const stillness = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const rad = (deg: number) => (deg * Math.PI) / 180;

const CARD_W = 156;
const CARD_H = 208;
const PIVOT = 260;
const ARC = 40;
const SHUT_ROT = 5;
const SHUT_OFF = 7;
const RAGGED = 0.22;
const REST = 0.4;
const DEEP = 5;
const SINK = 0.016;
const LIFT = 20;
const BEAT = 55;
const MAX = 6;

const SEED = [
  { rot: -0.62, dx: 0.41, dy: -0.28, beat: 0.34, tune: -0.22 },
  { rot: 0.83, dx: -0.55, dy: 0.36, beat: -0.47, tune: 0.31 },
  { rot: -0.24, dx: 0.68, dy: 0.52, beat: 0.71, tune: -0.44 },
  { rot: 0.47, dx: -0.31, dy: -0.63, beat: -0.18, tune: 0.58 },
  { rot: -0.91, dx: -0.72, dy: 0.19, beat: 0.52, tune: -0.36 },
  { rot: 0.36, dx: 0.24, dy: -0.47, beat: -0.66, tune: 0.27 },
];

const MOST = (ARC / 2) * (1 + RAGGED);
const SWING = PIVOT * Math.sin(rad(MOST));
const DROP = PIVOT * (1 - Math.cos(rad(MOST)));
const EXT_X = (CARD_W * Math.cos(rad(MOST)) + CARD_H * Math.sin(rad(MOST))) / 2;
const EXT_Y = (CARD_W * Math.sin(rad(MOST)) + CARD_H * Math.cos(rad(MOST))) / 2;
const JIT =
  SHUT_OFF + (CARD_W * Math.sin(rad(SHUT_ROT)) + CARD_H * (1 - Math.cos(rad(SHUT_ROT)))) / 2;
const PILE = (MAX - 1) * DEEP;

const STAGE_W = Math.ceil((SWING + EXT_X + JIT) * 2);
const ABOVE = Math.max(CARD_H / 2 + PILE, EXT_Y - DROP) + LIFT + JIT;
const BELOW = Math.max(CARD_H / 2, EXT_Y + DROP) + JIT;
const STAGE_H = Math.ceil(ABOVE + BELOW);

const DEFAULT_PHOTOS = [
  "/lab/stack-flowers4.jpg",
  "/lab/stack-flowers.jpg",
  "/lab/stack-flowers5.jpg",
  "/lab/stack-flowers3.jpg",
  "/lab/stack-flowers2.jpg",
];

const VIEW_H = STAGE_H - 24;
const VIEW_W = Math.round((VIEW_H * CARD_W) / CARD_H);
const VIEW_IN = 920;
const VIEW_OUT = 660;
const TILT = 6;
const VIEW_AT = "perspective(2000px) translate(0px, 0px) rotate(0deg) rotateY(180deg) scale(1)";

export interface StackProps {
  /** How wide the fan opens, 0..100. Default: 85 */
  spread?: number;
  /** Spring bounce, 0..100. Default: 5 */
  bounce?: number;
  /** How much the pile and fan disagree with themselves, 0..100. Default: 0 */
  scatter?: number;
  /** Number of cards, 3..6. Default: 5 */
  count?: number;
  /** Card corner radius in px. Default: 14 */
  corner?: number;
  /** Custom image URLs */
  images?: string[];
  className?: string;
  style?: React.CSSProperties;
}

export function Stack({
  spread = 85,
  bounce = 5,
  scatter = 0,
  count = 5,
  corner = 14,
  images = DEFAULT_PHOTOS,
  className,
  style,
}: StackProps) {
  const n = clamp(Math.round(count), 3, MAX);
  const sc = clamp(scatter, 0, 100) / 100;
  const still = stillness();

  const [hover, setHover] = useState(false);
  const [lit, setLit] = useState<boolean[]>(() => Array(MAX).fill(false));
  const [near, setNear] = useState<number | null>(null);
  const timers = useRef<number[]>([]);

  const [view, setView] = useState<{ id: number; from: string } | null>(null);
  const on = hover || Boolean(view);

  const [deck, setDeck] = useState<number[]>(() => Array.from({ length: MAX }, (_, k) => k));
  const [shuffle, setShuffle] = useState(false);
  const root = useRef<HTMLDivElement | null>(null);
  const faces = useRef<(HTMLSpanElement | null)[]>([]);
  const flyer = useRef<HTMLSpanElement | null>(null);
  const tilt = useRef<HTMLSpanElement | null>(null);
  const closing = useRef(false);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const gap = still ? 0 : BEAT;
    for (let i = 0; i < MAX; i += 1) {
      const place = on ? n - 1 - i : i;
      const atTime = Math.max(0, gap * (place + SEED[i].beat * sc * 0.6));
      const set = () =>
        setLit((prev) => {
          if (prev[i] === on) return prev;
          const next = [...prev];
          next[i] = on;
          return next;
        });
      if (atTime <= 0) set();
      else timers.current.push(window.setTimeout(set, atTime));
    }
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [on, n, sc, still]);

  const tune = (i: number) => clamp(bounce * (1 + SEED[i].tune * sc * 0.45), 0, 100);
  const s0 = useSpring(lit[0] ? 100 : 0, tune(0), still);
  const s1 = useSpring(lit[1] ? 100 : 0, tune(1), still);
  const s2 = useSpring(lit[2] ? 100 : 0, tune(2), still);
  const s3 = useSpring(lit[3] ? 100 : 0, tune(3), still);
  const s4 = useSpring(lit[4] ? 100 : 0, tune(4), still);
  const s5 = useSpring(lit[5] ? 100 : 0, tune(5), still);
  const at = [s0, s1, s2, s3, s4, s5];

  const arc = 10 + (clamp(spread, 0, 100) / 100) * (ARC - 10);
  const step = arc / (n - 1);

  const poseOf = (i: number) => {
    const r = root.current?.getBoundingClientRect();
    const f = faces.current[i]?.getBoundingClientRect();
    if (!r || !f || !r.width) return VIEW_AT;
    const u = at[i] / 100;
    const back = n - 1 - i;
    const c = i - (n - 1) / 2;
    const openRot = c * step + SEED[i].rot * sc * RAGGED * step;
    const shutRot = c * step * REST + SEED[i].rot * sc * SHUT_ROT * 0.6;
    const rot = mix(shutRot, openRot, u);
    const recede = 1 - back * SINK * (1 - u);
    const k = r.width / STAGE_W;
    const dx = (f.left + f.width / 2 - (r.left + r.width / 2)) / k;
    const dy = (f.top + f.height / 2 - (r.top + r.height / 2)) / k;
    const s = (CARD_W / VIEW_W) * recede;
    return `perspective(2000px) translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) rotate(${rot.toFixed(3)}deg) rotateY(0deg) scale(${s.toFixed(4)})`;
  };

  const open = (i: number) => {
    if (view) return;
    closing.current = false;
    setView({ id: deck[n - 1 - i], from: poseOf(i) });
  };

  const close = () => {
    const el = flyer.current;
    if (!view || closing.current) return;
    closing.current = true;
    if (tilt.current) tilt.current.style.transform = "";
    const home = poseOf(n - 1);
    const top = [view.id, ...deck.filter((d) => d !== view.id)];
    const moved = deck[0] !== view.id;
    setDeck(top);
    if (moved) setShuffle(true);
    const done = () => {
      setView(null);
      setShuffle(false);
    };
    if (!el || still) {
      done();
      return;
    }
    const back = el.animate([{ transform: VIEW_AT }, { transform: home }], {
      duration: VIEW_OUT,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: "forwards",
    });
    back.onfinish = done;
  };

  useLayoutEffect(() => {
    const el = flyer.current;
    if (!view || !el) return;
    el.animate([{ transform: view.from }, { transform: VIEW_AT }], {
      duration: still ? 1 : VIEW_IN,
      easing: still ? "linear" : "cubic-bezier(0.25, 0.8, 0.25, 1)",
      fill: "both",
    });
  }, [view, still]);

  useEffect(() => {
    if (!view) return;
    const down = (e: PointerEvent) => {
      if (!e.isTrusted) return;
      if (flyer.current?.contains(e.target as Node)) return;
      close();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("pointerdown", down, true);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("keydown", key);
    };
  });

  const PAD = 14;
  const half = rad((arc / 2) * (1 + RAGGED * sc));
  const fanX = PIVOT * Math.sin(half) + (CARD_W * Math.cos(half) + CARD_H * Math.sin(half)) / 2;
  const fanTop = ABOVE - CARD_H / 2 - LIFT;
  const fanBottom =
    ABOVE + (CARD_W * Math.sin(half) + CARD_H * Math.cos(half)) / 2 + PIVOT * (1 - Math.cos(half));
  const fanPad = {
    left: STAGE_W / 2 - fanX - PAD,
    top: fanTop - PAD,
    width: (fanX + PAD) * 2,
    height: fanBottom - fanTop + PAD * 2,
  };

  const photoList = images.length > 0 ? images : DEFAULT_PHOTOS;

  const cardRadius = `${clamp(corner, 0, CARD_W / 2)}px`;
  const viewRadius = `${((clamp(corner, 0, CARD_W / 2) * VIEW_W) / CARD_W).toFixed(2)}px`;

  return (
    <div
      ref={root}
      className={cn("pointer-events-none relative select-none", className)}
      data-viewing={view ? "" : undefined}
      data-shuffle={shuffle ? "" : undefined}
      style={{
        width: STAGE_W,
        height: STAGE_H,
        ...style,
      }}
      onPointerOver={() => {
        if (!hover) setHover(true);
      }}
      onPointerOut={(e) => {
        const to = e.relatedTarget as Node | null;
        if (to && e.currentTarget.contains(to)) return;
        setHover(false);
        setNear(null);
      }}
      onPointerCancel={() => {
        setHover(false);
        setNear(null);
      }}
    >
      {/* Hit detection pad */}
      <span
        className="pointer-events-auto absolute"
        aria-hidden="true"
        onPointerOver={() => setNear(null)}
        style={
          on
            ? fanPad
            : {
                left: (STAGE_W - CARD_W) / 2 - 10,
                top: ABOVE - CARD_H / 2 - PILE - 10,
                width: CARD_W + 20,
                height: CARD_H + PILE + 20,
              }
        }
      />

      {Array.from({ length: n }, (_, i) => {
        const u = at[i] / 100;
        const back = n - 1 - i;
        const c = i - (n - 1) / 2;

        const openRot = c * step + SEED[i].rot * sc * RAGGED * step;
        const shutRot = c * step * REST + SEED[i].rot * sc * SHUT_ROT * 0.6;
        const shutX = SEED[i].dx * sc * SHUT_OFF;
        const shutY = -back * DEEP + SEED[i].dy * sc * SHUT_OFF;

        const id = deck[back];
        const lift = on && near === i && !view;
        const rot = mix(shutRot, openRot, u);
        const recede = 1 - back * SINK * (1 - u);

        return (
          <span
            key={id}
            className="pointer-events-auto absolute cursor-pointer transition-opacity duration-360 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              left: (STAGE_W - CARD_W) / 2,
              top: ABOVE - CARD_H / 2,
              width: CARD_W,
              height: CARD_H,
              transformOrigin: `50% ${CARD_H / 2 + PIVOT}px`,
              transform: `translate(${mix(shutX, 0, u).toFixed(2)}px, ${mix(shutY, 0, u).toFixed(
                2
              )}px) rotate(${rot.toFixed(3)}deg)`,
              visibility: view?.id === id ? "hidden" : undefined,
              zIndex: i,
            }}
            onPointerEnter={() => {
              if (near === i) return;
              setNear(i);
            }}
            onPointerDown={(e) => {
              if (e.button === 0) open(i);
            }}
          >
            <span
              ref={(el) => {
                faces.current[i] = el;
              }}
              className={cn(
                "bg-chroma-stack-face absolute inset-0 overflow-hidden transition-[translate,box-shadow]",
                lift
                  ? "-translate-y-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_0_0_1px_rgba(255,255,255,0.045),0_2px_5px_rgba(15,23,42,0.12),0_18px_32px_-10px_rgba(15,23,42,0.28)] duration-300 ease-[cubic-bezier(0.2,0.7,0.3,1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_0_0_1px_rgba(255,255,255,0.08),0_12px_28px_-6px_rgba(0,0,0,0.6)]"
                  : "translate-y-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),inset_0_0_0_1px_rgba(255,255,255,0.035),0_1px_2px_rgba(15,23,42,0.1),0_8px_18px_-6px_rgba(15,23,42,0.16)] duration-480 ease-[cubic-bezier(0.4,0,0.2,1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_0_0_1px_rgba(255,255,255,0.05),0_4px_12px_rgba(0,0,0,0.4)]"
              )}
              style={{
                borderRadius: cardRadius,
                scale: recede,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="pointer-events-none block h-full w-full object-cover select-none"
                src={photoList[id % photoList.length]}
                alt=""
                draggable={false}
              />
            </span>
          </span>
        );
      })}

      {view && (
        <span
          ref={flyer}
          className="pointer-events-auto absolute z-20 origin-center cursor-default will-change-transform [transform-style:preserve-3d]"
          role="img"
          aria-label="Card in view; click outside or press Escape to put it back"
          style={{
            left: (STAGE_W - VIEW_W) / 2,
            top: (STAGE_H - VIEW_H) / 2,
            width: VIEW_W,
            height: VIEW_H,
            transform: view.from,
          }}
          onPointerMove={(e) => {
            const t = tilt.current;
            if (!t || closing.current || still) return;
            const r = e.currentTarget.getBoundingClientRect();
            const nx = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
            const ny = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
            t.style.transform = `rotateX(${(ny * TILT).toFixed(2)}deg) rotateY(${(nx * TILT).toFixed(2)}deg)`;
          }}
          onPointerLeave={() => {
            if (tilt.current) tilt.current.style.transform = "";
          }}
        >
          <span
            ref={tilt}
            className="absolute inset-0 transition-transform duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] motion-reduce:transition-none"
          >
            <span
              className="bg-chroma-stack-face absolute inset-0 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_0_0_1px_rgba(255,255,255,0.045),0_4px_10px_rgba(15,23,42,0.12),0_28px_48px_-16px_rgba(15,23,42,0.32)] [backface-visibility:hidden] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_0_0_1px_rgba(255,255,255,0.07),0_16px_36px_-10px_rgba(0,0,0,0.7)]"
              style={{ borderRadius: viewRadius }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="pointer-events-none block h-full w-full object-cover select-none"
                src={photoList[view.id % photoList.length]}
                alt=""
                draggable={false}
              />
            </span>
            <span
              className="bg-chroma-stack-face absolute inset-0 [transform:rotateY(180deg)] overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_0_0_1px_rgba(255,255,255,0.045),0_4px_10px_rgba(15,23,42,0.12),0_28px_48px_-16px_rgba(15,23,42,0.32)] [backface-visibility:hidden] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_0_0_1px_rgba(255,255,255,0.07),0_16px_36px_-10px_rgba(0,0,0,0.7)]"
              style={{ borderRadius: viewRadius }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="pointer-events-none block h-full w-full object-cover select-none"
                src={photoList[view.id % photoList.length]}
                alt=""
                draggable={false}
              />
            </span>
          </span>
        </span>
      )}
    </div>
  );
}
