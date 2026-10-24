"use client";

/**
 * FolderTray
 *
 * An interactive 3D isometric tray of folders with kinematic spring lean physics.
 * Built on top of and inspired by Lucas Markes' hairline riffle engine:
 * https://github.com/lucasmarkes/hairline
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Riffle } from "@lucasmarkes/hairline/react";
export { Folder, type FolderProps } from "./folder";

export interface FolderItem<T = unknown> {
  id: string;
  name: string;
  /** Optional URL destination. If provided, clicking can navigate to this link. */
  href?: string;
  /** Target window/frame for navigation (e.g. "_blank", "_self") */
  target?: "_blank" | "_self" | string;
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
  /** Custom rich content, article, or notes to render when viewing this folder */
  content?: React.ReactNode;
  badge?: string;
  data?: T;
}

export interface FolderTrayProps<T = unknown> {
  /** Array of folder cards (1 to 8). Each folder defines bodyColor, darkOutline, and lightOutline. */
  folders: FolderItem<T>[];
  /** Visual theme variant: "color" for vibrant colored folders, "original" for clean monochrome white line-art (default: "color") */
  variant?: "color" | "original";
  /** Default body color (default: "#E461F5") */
  defaultBodyColor?: string;
  /** Default dark outline (default: "#232327") */
  defaultDarkOutline?: string;
  /** Default light outline (default: "#F9D8FD") */
  defaultLightOutline?: string;
  /** Callback triggered when a folder is clicked */
  onOpen?: (folder: FolderItem<T>) => void;
  /** Callback triggered when active folder selection changes */
  onSelect?: (folder: FolderItem<T>) => void;
  /** Callback triggered when a folder is hovered or scrubbed over */
  onHover?: (folder: FolderItem<T> | null) => void;
  /** Initial selected folder index */
  defaultSelected?: number;
  /** Spring intensity from 0 to 1 (default: 0.65) */
  intensity?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function FolderTray<T = unknown>({
  folders,
  variant = "color",
  defaultBodyColor = "#E461F5",
  defaultDarkOutline = "#232327",
  defaultLightOutline = "#F9D8FD",
  onOpen,
  onSelect,
  onHover,
  defaultSelected = 0,
  intensity = 0.65,
  className = "",
  style,
}: FolderTrayProps<T>) {
  const [selectedIndex, setSelectedIndex] = useState(defaultSelected);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastReportedCard = useRef<number | null>(null);

  const isOriginal = variant === "original";

  const getFolderItem = useCallback(
    (idx: number): FolderItem<T> | undefined => {
      const folder = folders[idx];
      if (!folder) return undefined;
      if (!isOriginal) return folder;
      return {
        ...folder,
        bodyColor: "#FFFFFF",
        darkOutline: "#232327",
        lightOutline: "#E0E0E4",
      };
    },
    [folders, isOriginal]
  );

  const activeFolder = getFolderItem(selectedIndex) || getFolderItem(0);
  const displayedFolder =
    hoverIndex !== null ? getFolderItem(hoverIndex) || activeFolder : activeFolder;

  const triggerCardAction = useCallback(
    (f: FolderItem<T>, e?: MouseEvent | React.MouseEvent) => {
      onSelect?.(f);
      if (onOpen) {
        onOpen(f);
      } else if (f.href) {
        const target = f.target || "_blank";
        if (target === "_blank" || e?.metaKey || e?.ctrlKey) {
          window.open(f.href, "_blank", "noopener,noreferrer");
        } else {
          window.location.href = f.href;
        }
      }
    },
    [onOpen, onSelect]
  );

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
        const item = folders[idx];
        const body = isOriginal
          ? "#FFFFFF"
          : item?.bodyColor || item?.fill || item?.color || defaultBodyColor;
        const dark = isOriginal
          ? "#232327"
          : item?.darkOutline || item?.outline || defaultDarkOutline;
        const light = isOriginal ? "#E0E0E4" : item?.lightOutline || defaultLightOutline;

        const grpEl = grp as HTMLElement;
        grpEl.setAttribute("data-card-index", String(idx));
        grpEl.style.cursor = "pointer";
        grpEl.style.setProperty("--folder-body", body);
        grpEl.style.setProperty("--folder-dark", dark);
        grpEl.style.setProperty("--folder-light", light);

        if (idx === selectedIndex) {
          grpEl.setAttribute("data-selected", "true");
        } else {
          grpEl.removeAttribute("data-selected");
        }

        // Attach click listener
        grpEl.onclick = (e) => {
          e.stopPropagation();
          setSelectedIndex(idx);
          const f = getFolderItem(idx);
          if (f) {
            triggerCardAction(f, e);
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
  }, [
    folders,
    getFolderItem,
    selectedIndex,
    triggerCardAction,
    isOriginal,
    defaultBodyColor,
    defaultDarkOutline,
    defaultLightOutline,
  ]);

  // Smooth throttled onRead: only update hover index when crossing between distinct folders
  const handleRead = useCallback(
    (label: string) => {
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
        const hovered = cardIdx !== null ? getFolderItem(cardIdx) || null : null;
        onHover?.(hovered);
      }
    },
    [getFolderItem, onHover]
  );

  const handleContainerClick = (e: React.MouseEvent) => {
    // Only open if clicking on an actual folder card
    if (lastReportedCard.current === null) {
      return;
    }

    const target = e.target as HTMLElement | SVGElement | null;
    const cardEl = target?.closest?.("[data-card-index]");
    if (!cardEl) {
      return;
    }

    const cardIndexAttr = cardEl.getAttribute("data-card-index");
    const targetIdx =
      cardIndexAttr !== null && cardIndexAttr !== undefined
        ? parseInt(cardIndexAttr, 10)
        : lastReportedCard.current;

    if (targetIdx !== null) {
      const f = getFolderItem(targetIdx);
      if (f) {
        setSelectedIndex(targetIdx);
        triggerCardAction(f, e);
      }
    }
  };

  const handleContainerLeave = () => {
    lastReportedCard.current = null;
    setHoverIndex(null);
    onHover?.(null);
  };

  // Build 3 distinct CSS color variables for each folder (body, dark outline, light outline)
  const cssColorVariables: Record<string, string> = {};
  folders.slice(0, 8).forEach((item, idx) => {
    const body = isOriginal
      ? "#FFFFFF"
      : item.bodyColor || item.fill || item.color || defaultBodyColor;
    const dark = isOriginal ? "#232327" : item.darkOutline || item.outline || defaultDarkOutline;
    const light = isOriginal ? "#E0E0E4" : item.lightOutline || defaultLightOutline;

    cssColorVariables[`--folder-body-${idx}`] = body;
    cssColorVariables[`--folder-dark-${idx}`] = dark;
    cssColorVariables[`--folder-light-${idx}`] = light;
  });

  return (
    <div
      className={`folder-tray relative aspect-[5/4] w-full max-w-[460px] select-none [&_[data-card-index]_circle.dot]:![fill:var(--folder-dark,#232327)] [&_[data-card-index]_circle.dot]:![stroke:none] [&_[data-card-index]_circle.dot.m]:![fill:var(--folder-dark,#232327)] [&_[data-card-index]_circle.dot.off]:![fill:var(--folder-light,#e0e0e4)] [&_[data-card-index]_path.lo:not(.nf)]:![fill:var(--folder-body,#fff)] [&_[data-card-index]_path.lo:not(.nf)]:![stroke:var(--folder-light,#e0e0e4)] [&_[data-card-index]_path.nf.lo]:![fill:none] [&_[data-card-index]_path.nf.lo]:![stroke:var(--folder-light,#e0e0e4)] [&_[data-card-index]_path.nf:not(.lo)]:![fill:none] [&_[data-card-index]_path.nf:not(.lo)]:![stroke:var(--folder-dark,#232327)] [&_[data-card-index]_path.sil]:![fill:var(--folder-body,#fff)] [&_[data-card-index]_path.sil]:![stroke:var(--folder-dark,#232327)] ${className}`}
      style={{ ...(style || {}), ...cssColorVariables } as React.CSSProperties}
    >
      {/* 3D Isometric Folder Tray Container */}
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        onMouseLeave={handleContainerLeave}
        className={`h-full w-full ${hoverIndex !== null ? "cursor-pointer" : "cursor-default"}`}
        title={
          hoverIndex !== null && displayedFolder
            ? displayedFolder.href
              ? `Open link: ${displayedFolder.name} ↗`
              : `View: ${displayedFolder.name}`
            : undefined
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
