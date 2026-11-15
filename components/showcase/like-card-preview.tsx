"use client";

import React, { useState } from "react";
import { Like, LikeEffect } from "@/components/ui/like";
import { SelectBar } from "@/components/ui/select-bar";

export function LikeCardPreview({
  showControls = false,
  fill = "auto",
}: {
  showControls?: boolean;
  fill?: "light" | "dark" | "auto";
} = {}) {
  const [effect, setEffect] = useState<LikeEffect>("Bloom");

  return (
    <>
      <Like
        start={1300}
        effect={effect}
        burst={50}
        color="Red"
        corner={22}
        fill={fill}
      />

      {showControls && (
        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
          <SelectBar<LikeEffect>
            size="xs"
            items={[
              { key: "Bloom", label: "Bloom" },
              { key: "Firework", label: "Firework" },
            ]}
            value={effect}
            onChange={setEffect}
            ariaLabel="Select like effect"
          />
        </div>
      )}
    </>
  );
}
