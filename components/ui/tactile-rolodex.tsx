"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Riffle } from "@lucasmarkes/hairline/react";
export { TactileSingleFolder, type TactileSingleFolderProps } from "./tactile-folder";

export interface TactileFolder<T = unknown> {
  id: string;
  name: string;
  /** Fill / background color for the body of the folder (e.g. "#FFFFFF", "#FFF7ED") */
  bodyColor?: string;
  /** Dark outline color for silhouette, tab headline, and active punch dot (e.g. "#232327", "#E54F10") */
  darkOutline?: string;
  /** Light outline color for 5 ruled lines, back face, and inactive punch dots (e.g. "#E0E0E4", "#FDBA74") */
  lightOutline?: string;

  /** Alias for bodyColor */
  color?: string;
  /** Alias for bodyColor */
  fill?: string;
  /** Alias for darkOutline */
  outline?: string;

  category?: string;
  description?: string;
  badge?: string;
  data?: T;
}

export interface TactileRolodexProps<T = unknown> {
  /** Array of folder cards (1 to 8). Each folder defines bodyColor, darkOutline, and lightOutline. */
  folders: TactileFolder<T>[];
  /** Default body color (default: "#E54F10") */
  defaultBodyColor?: string;
  /** Default dark outline (default: "#7C2D12") */
  defaultDarkOutline?: string;
  /** Default light outline (default: "#FED7AA") */
  defaultLightOutline?: string;
  /** Callback triggered when a folder is clicked */
  onOpen?: (folder: TactileFolder<T>) => void;
  /** Callback triggered when active folder selection changes */
  onSelect?: (folder: TactileFolder<T>) => void;
  /** Initial selected folder index */
  defaultSelected?: number;
  /** Spring intensity from 0 to 1 (default: 0.65) */
  intensity?: number;
  className?: string;
}

export function TactileRolodex<T = unknown>({
  folders,
  defaultBodyColor = "#E54F10",
  defaultDarkOutline = "#7C2D12",
  defaultLightOutline = "#FED7AA",
  onOpen,
  onSelect,
  defaultSelected = 0,
  intensity = 0.65,
  className = "",
}: TactileRolodexProps<T>) {
  const [selectedIndex, setSelectedIndex] = useState(defaultSelected);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastReportedCard = useRef<number | null>(null);

  const activeFolder = folders[selectedIndex] || folders[0];
  const displayedFolder = hoverIndex !== null ? folders[hoverIndex] || activeFolder : activeFolder;

  // Set card indexes and attach click listeners to the SVG card groups
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let observer: MutationObserver | null = null;
    let cancelled = false;

    const setupCards = () => {
      if (cancelled) return false;
      const stage = container.querySelector('[data-hairline="riffle"]');
      if (!stage) return false;

      // Filter specifically for card groups containing path.sil (excludes the tray reflection ghost)
      const allGroups = stage.querySelectorAll("svg > g > g");
      const cardGroups = Array.from(allGroups).filter((g) => g.querySelector("path.sil"));
      if (cardGroups.length === 0) return false;

      cardGroups.forEach((grp, idx) => {
        grp.setAttribute("data-card-index", String(idx));
        (grp as HTMLElement).style.cursor = "pointer";

        if (idx === selectedIndex) {
          grp.setAttribute("data-selected", "true");
        } else {
          grp.removeAttribute("data-selected");
        }

        // Attach click listener
        (grp as HTMLElement).onclick = (e) => {
          e.stopPropagation();
          setSelectedIndex(idx);
          if (folders[idx]) {
            onSelect?.(folders[idx]);
            onOpen?.(folders[idx]);
          }
        };
      });

      return cardGroups.length >= 8;
    };

    // Try immediately
    if (!setupCards()) {
      observer = new MutationObserver(() => {
        if (setupCards() && observer) {
          observer.disconnect();
          observer = null;
        }
      });
      observer.observe(container, { childList: true, subtree: true });

      const t1 = setTimeout(setupCards, 30);
      const t2 = setTimeout(setupCards, 80);
      const t3 = setTimeout(setupCards, 200);
      const t4 = setTimeout(setupCards, 500);

      return () => {
        cancelled = true;
        observer?.disconnect();
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [folders, onOpen, onSelect, selectedIndex]);

  // Smooth throttled onRead: only update hover index when crossing between distinct folders
  const handleRead = useCallback((label: string) => {
    let cardIdx: number | null = null;
    if (label && label !== "rest") {
      const punchNum = parseInt(label, 10);
      if (!isNaN(punchNum) && punchNum >= 1 && punchNum <= 8) {
        cardIdx = 8 - punchNum;
      }
    }

    if (lastReportedCard.current !== cardIdx) {
      lastReportedCard.current = cardIdx;
      setHoverIndex(cardIdx);
    }
  }, []);

  const handleContainerClick = () => {
    const targetIdx = lastReportedCard.current !== null ? lastReportedCard.current : selectedIndex;
    if (folders[targetIdx]) {
      setSelectedIndex(targetIdx);
      onSelect?.(folders[targetIdx]);
      onOpen?.(folders[targetIdx]);
    }
  };

  const handleContainerLeave = () => {
    lastReportedCard.current = null;
    setHoverIndex(null);
  };

  // Build 3 distinct CSS color variables for each folder (body, dark outline, light outline)
  const cssColorVariables: Record<string, string> = {};
  folders.slice(0, 8).forEach((item, idx) => {
    const body = item.bodyColor || item.fill || item.color || defaultBodyColor;
    const dark = item.darkOutline || item.outline || defaultDarkOutline;
    const light = item.lightOutline || defaultLightOutline;

    cssColorVariables[`--folder-body-${idx}`] = body;
    cssColorVariables[`--folder-dark-${idx}`] = dark;
    cssColorVariables[`--folder-light-${idx}`] = light;
  });

  return (
    <div
      className={`tactile-rolodex relative aspect-[5/4] w-full max-w-[460px] select-none ${className}`}
      style={cssColorVariables as React.CSSProperties}
    >
      {/* 3-Color hairline riffle architecture: body of folder, dark outline, and light outline */}
      <style jsx global>{`
        /* Folder 1 */
        .tactile-rolodex [data-card-index="0"] path.sil {
          fill: var(--folder-body-0, #fff) !important;
          stroke: var(--folder-dark-0, #232327) !important;
        }
        .tactile-rolodex [data-card-index="0"] path.lo:not(.nf) {
          fill: var(--folder-body-0, #fff) !important;
          stroke: var(--folder-light-0, #e0e0e4) !important;
        }
        .tactile-rolodex [data-card-index="0"] path.nf:not(.lo) {
          fill: none !important;
          stroke: var(--folder-dark-0, #232327) !important;
        }
        .tactile-rolodex [data-card-index="0"] path.nf.lo {
          fill: none !important;
          stroke: var(--folder-light-0, #e0e0e4) !important;
        }
        .tactile-rolodex [data-card-index="0"] circle.dot {
          fill: var(--folder-dark-0, #232327) !important;
          stroke: none !important;
        }
        .tactile-rolodex [data-card-index="0"] circle.dot.off {
          fill: var(--folder-light-0, #e0e0e4) !important;
          stroke: none !important;
        }
        .tactile-rolodex [data-card-index="0"] circle.dot.m {
          fill: var(--folder-dark-0, #232327) !important;
          stroke: none !important;
        }

        /* Folder 2 */
        .tactile-rolodex [data-card-index="1"] path.sil {
          fill: var(--folder-body-1, #fff) !important;
          stroke: var(--folder-dark-1, #232327) !important;
        }
        .tactile-rolodex [data-card-index="1"] path.lo:not(.nf) {
          fill: var(--folder-body-1, #fff) !important;
          stroke: var(--folder-light-1, #e0e0e4) !important;
        }
        .tactile-rolodex [data-card-index="1"] path.nf:not(.lo) {
          fill: none !important;
          stroke: var(--folder-dark-1, #232327) !important;
        }
        .tactile-rolodex [data-card-index="1"] path.nf.lo {
          fill: none !important;
          stroke: var(--folder-light-1, #e0e0e4) !important;
        }
        .tactile-rolodex [data-card-index="1"] circle.dot {
          fill: var(--folder-dark-1, #232327) !important;
          stroke: none !important;
        }
        .tactile-rolodex [data-card-index="1"] circle.dot.off {
          fill: var(--folder-light-1, #e0e0e4) !important;
          stroke: none !important;
        }
        .tactile-rolodex [data-card-index="1"] circle.dot.m {
          fill: var(--folder-dark-1, #232327) !important;
          stroke: none !important;
        }

        /* Folder 3 */
        .tactile-rolodex [data-card-index="2"] path.sil {
          fill: var(--folder-body-2, #fff) !important;
          stroke: var(--folder-dark-2, #232327) !important;
        }
        .tactile-rolodex [data-card-index="2"] path.lo:not(.nf) {
          fill: var(--folder-body-2, #fff) !important;
          stroke: var(--folder-light-2, #e0e0e4) !important;
        }
        .tactile-rolodex [data-card-index="2"] path.nf:not(.lo) {
          fill: none !important;
          stroke: var(--folder-dark-2, #232327) !important;
        }
        .tactile-rolodex [data-card-index="2"] path.nf.lo {
          fill: none !important;
          stroke: var(--folder-light-2, #e0e0e4) !important;
        }
        .tactile-rolodex [data-card-index="2"] circle.dot {
          fill: var(--folder-dark-2, #232327) !important;
          stroke: none !important;
        }
        .tactile-rolodex [data-card-index="2"] circle.dot.off {
          fill: var(--folder-light-2, #e0e0e4) !important;
          stroke: none !important;
        }
        .tactile-rolodex [data-card-index="2"] circle.dot.m {
          fill: var(--folder-dark-2, #232327) !important;
          stroke: none !important;
        }

        /* Folder 4 */
        .tactile-rolodex [data-card-index="3"] path.sil {
          fill: var(--folder-body-3, #fff) !important;
          stroke: var(--folder-dark-3, #232327) !important;
        }
        .tactile-rolodex [data-card-index="3"] path.lo:not(.nf) {
          fill: var(--folder-body-3, #fff) !important;
          stroke: var(--folder-light-3, #e0e0e4) !important;
        }
        .tactile-rolodex [data-card-index="3"] path.nf:not(.lo) {
          fill: none !important;
          stroke: var(--folder-dark-3, #232327) !important;
        }
        .tactile-rolodex [data-card-index="3"] path.nf.lo {
          fill: none !important;
          stroke: var(--folder-light-3, #e0e0e4) !important;
        }
        .tactile-rolodex [data-card-index="3"] circle.dot {
          fill: var(--folder-dark-3, #232327) !important;
          stroke: none !important;
        }
        .tactile-rolodex [data-card-index="3"] circle.dot.off {
          fill: var(--folder-light-3, #e0e0e4) !important;
          stroke: none !important;
        }
        .tactile-rolodex [data-card-index="3"] circle.dot.m {
          fill: var(--folder-dark-3, #232327) !important;
          stroke: none !important;
        }

        /* Folder 5 */
        .tactile-rolodex [data-card-index="4"] path.sil {
          fill: var(--folder-body-4, #fff) !important;
          stroke: var(--folder-dark-4, #232327) !important;
        }
        .tactile-rolodex [data-card-index="4"] path.lo:not(.nf) {
          fill: var(--folder-body-4, #fff) !important;
          stroke: var(--folder-light-4, #e0e0e4) !important;
        }
        .tactile-rolodex [data-card-index="4"] path.nf:not(.lo) {
          fill: none !important;
          stroke: var(--folder-dark-4, #232327) !important;
        }
        .tactile-rolodex [data-card-index="4"] path.nf.lo {
          fill: none !important;
          stroke: var(--folder-light-4, #e0e0e4) !important;
        }
        .tactile-rolodex [data-card-index="4"] circle.dot {
          fill: var(--folder-dark-4, #232327) !important;
          stroke: none !important;
        }
        .tactile-rolodex [data-card-index="4"] circle.dot.off {
          fill: var(--folder-light-4, #e0e0e4) !important;
          stroke: none !important;
        }
        .tactile-rolodex [data-card-index="4"] circle.dot.m {
          fill: var(--folder-dark-4, #232327) !important;
          stroke: none !important;
        }

        /* Folder 6 */
        .tactile-rolodex [data-card-index="5"] path.sil {
          fill: var(--folder-body-5, #fff) !important;
          stroke: var(--folder-dark-5, #232327) !important;
        }
        .tactile-rolodex [data-card-index="5"] path.lo:not(.nf) {
          fill: var(--folder-body-5, #fff) !important;
          stroke: var(--folder-light-5, #e0e0e4) !important;
        }
        .tactile-rolodex [data-card-index="5"] path.nf:not(.lo) {
          fill: none !important;
          stroke: var(--folder-dark-5, #232327) !important;
        }
        .tactile-rolodex [data-card-index="5"] path.nf.lo {
          fill: none !important;
          stroke: var(--folder-light-5, #e0e0e4) !important;
        }
        .tactile-rolodex [data-card-index="5"] circle.dot {
          fill: var(--folder-dark-5, #232327) !important;
          stroke: none !important;
        }
        .tactile-rolodex [data-card-index="5"] circle.dot.off {
          fill: var(--folder-light-5, #e0e0e4) !important;
          stroke: none !important;
        }
        .tactile-rolodex [data-card-index="5"] circle.dot.m {
          fill: var(--folder-dark-5, #232327) !important;
          stroke: none !important;
        }

        /* Folder 7 */
        .tactile-rolodex [data-card-index="6"] path.sil {
          fill: var(--folder-body-6, #fff) !important;
          stroke: var(--folder-dark-6, #232327) !important;
        }
        .tactile-rolodex [data-card-index="6"] path.lo:not(.nf) {
          fill: var(--folder-body-6, #fff) !important;
          stroke: var(--folder-light-6, #e0e0e4) !important;
        }
        .tactile-rolodex [data-card-index="6"] path.nf:not(.lo) {
          fill: none !important;
          stroke: var(--folder-dark-6, #232327) !important;
        }
        .tactile-rolodex [data-card-index="6"] path.nf.lo {
          fill: none !important;
          stroke: var(--folder-light-6, #e0e0e4) !important;
        }
        .tactile-rolodex [data-card-index="6"] circle.dot {
          fill: var(--folder-dark-6, #232327) !important;
          stroke: none !important;
        }
        .tactile-rolodex [data-card-index="6"] circle.dot.off {
          fill: var(--folder-light-6, #e0e0e4) !important;
          stroke: none !important;
        }
        .tactile-rolodex [data-card-index="6"] circle.dot.m {
          fill: var(--folder-dark-6, #232327) !important;
          stroke: none !important;
        }

        /* Folder 8 */
        .tactile-rolodex [data-card-index="7"] path.sil {
          fill: var(--folder-body-7, #fff) !important;
          stroke: var(--folder-dark-7, #232327) !important;
        }
        .tactile-rolodex [data-card-index="7"] path.lo:not(.nf) {
          fill: var(--folder-body-7, #fff) !important;
          stroke: var(--folder-light-7, #e0e0e4) !important;
        }
        .tactile-rolodex [data-card-index="7"] path.nf:not(.lo) {
          fill: none !important;
          stroke: var(--folder-dark-7, #232327) !important;
        }
        .tactile-rolodex [data-card-index="7"] path.nf.lo {
          fill: none !important;
          stroke: var(--folder-light-7, #e0e0e4) !important;
        }
        .tactile-rolodex [data-card-index="7"] circle.dot {
          fill: var(--folder-dark-7, #232327) !important;
          stroke: none !important;
        }
        .tactile-rolodex [data-card-index="7"] circle.dot.off {
          fill: var(--folder-light-7, #e0e0e4) !important;
          stroke: none !important;
        }
        .tactile-rolodex [data-card-index="7"] circle.dot.m {
          fill: var(--folder-dark-7, #232327) !important;
          stroke: none !important;
        }
      `}</style>

      {/* 3D Isometric Folder Tray Container */}
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        onMouseLeave={handleContainerLeave}
        className={`h-full w-full ${hoverIndex !== null ? "cursor-pointer" : "cursor-default"}`}
        title={
          hoverIndex !== null
            ? `Click to open ${displayedFolder?.name}`
            : "Hover and click any folder"
        }
      >
        <Riffle
          intensity={intensity}
          theme="light"
          onRead={handleRead}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
