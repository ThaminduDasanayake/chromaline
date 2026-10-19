"use client";

import React, { useState } from "react";
import { Terrain, TerrainNode } from "@/components/ui/terrain";

export function TerrainCardPreview() {
  const [selectedNode, setSelectedNode] = useState<TerrainNode | null>({
    row: 4,
    col: 4,
    height: 38,
  });

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="w-[240px] sm:w-[270px]">
        <Terrain
          gridSize={9}
          intensity={0.65}
          play={true}
          selected={selectedNode}
          onClick={(node) => setSelectedNode(node)}
          accentColor="#E54F10"
        />
      </div>

      {/* Tactile Coordinate Badge */}
      <div className="mt-2 flex items-center gap-2 font-mono text-[11px] text-slate-500">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#E54F10]" />
        {selectedNode ? (
          <span>
            Pillar [{selectedNode.row}, {selectedNode.col}] · Selected
          </span>
        ) : (
          <span>Click any pillar to select</span>
        )}
      </div>
    </div>
  );
}
