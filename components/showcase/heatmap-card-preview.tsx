"use client";

import React, { useState } from "react";
import { Heatmap, HeatmapNode } from "@/components/ui/heatmap";

export function HeatmapCardPreview() {
  const [hoveredNode, setHoveredNode] = useState<HeatmapNode | null>(null);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="w-full max-w-[340px]">
        <Heatmap scheme="default" mode="light" range="14w" colorOnHover onHover={setHoveredNode} />
      </div>

      {/* Tactile Coordinate Badge */}
      <div
        className={`mt-2 flex h-4 items-center gap-2 font-mono text-[11px] text-slate-500 transition-opacity duration-150 ${
          hoveredNode ? "opacity-100" : "opacity-0"
        }`}
      >
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: hoveredNode?.color || "#216e39" }}
        />
        <span>
          {hoveredNode?.label} · {hoveredNode?.count} commit{hoveredNode?.count === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}
