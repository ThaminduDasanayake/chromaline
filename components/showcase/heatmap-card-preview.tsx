"use client";

import React, { useState } from "react";
import { Heatmap, HeatmapNode } from "@/components/ui/heatmap";

export function HeatmapCardPreview() {
  const [hoveredNode, setHoveredNode] = useState<HeatmapNode | null>(null);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="w-full max-w-[340px]">
        <Heatmap
          scheme="default"
          mode="dark"
          profile="thamindu"
          colorOnHover
          onHover={setHoveredNode}
        />
      </div>

      {/* Tactile Coordinate Badge */}
      <div className="mt-2 flex items-center gap-2 font-mono text-[11px] text-slate-500">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#56d364]" />
        {hoveredNode ? (
          <span>
            {hoveredNode.label} · {hoveredNode.count} commit{hoveredNode.count === 1 ? "" : "s"}
          </span>
        ) : (
          <span>Hover pillars to inspect GitHub activity</span>
        )}
      </div>
    </div>
  );
}
