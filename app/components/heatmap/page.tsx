"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Heatmap,
  HeatmapSchemeKey,
  HeatmapRange,
  GITHUB_SCHEMES,
  RawContributionDay,
  transformContributionsToMatrix,
  generateProceduralMatrix,
} from "@/components/ui/heatmap";
import { SelectBar } from "@/components/ui/select-bar";
import { GitCommitIcon } from "@phosphor-icons/react";
import {
  DocsLayout,
  ComponentPreview,
  InstallationSection,
  UsageSection,
  PropsTable,
  PropItem,
  ThemeControl,
  useComponentTheme,
} from "@/components/docs";

const CODE_EXAMPLE_LINES = [
  {
    num: 1,
    parts: [
      { text: "import", cls: "text-[#f43f5e]" },
      { text: " { " },
      { text: "Heatmap", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/heatmap"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [
      { text: "export default function", cls: "text-[#f43f5e]" },
      { text: " ContributionDemo() {" },
    ],
  },
  { num: 4, parts: [{ text: "  return (" }] },
  {
    num: 5,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "Heatmap", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 6,
    parts: [
      { text: '      range="year"' },
      { text: ' // "year" (full 52w) | "14w"', cls: "text-slate-400" },
    ],
  },
  {
    num: 7,
    parts: [
      { text: '      scheme="default"' },
      { text: ' // "default" | "winter" | "halloween"', cls: "text-slate-400" },
    ],
  },
  {
    num: 8,
    parts: [
      { text: '      mode="light"' },
      { text: ' // "light" | "dark"', cls: "text-slate-400" },
    ],
  },
  {
    num: 9,
    parts: [{ text: "      colorOnHover" }],
  },
  {
    num: 10,
    parts: [{ text: "    />", cls: "text-slate-500" }],
  },
  { num: 11, parts: [{ text: "  );" }] },
  { num: 12, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { Heatmap } from "@/components/ui/heatmap";

export default function ContributionDemo() {
  return (
    <Heatmap
      range="year" // "year" (full 52w) | "14w"
      scheme="default" // "default" | "winter" | "halloween"
      mode="light" // "light" | "dark"
      colorOnHover
    />
  );
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "range",
    type: '"year" | "14w"',
    default: '"year"',
    desc: "Timeline range: 'year' (full 52-53 weeks / 365+ days) or '14w' (14 weeks).",
  },
  {
    name: "scheme",
    type: '"default" | "winter" | "halloween"',
    default: '"default"',
    desc: "Color scheme: Classic Green, Winter (Ice Blue), or Halloween (Pumpkin & Gold).",
  },
  {
    name: "mode",
    type: '"light" | "dark"',
    default: '"light"',
    desc: "Visual theme mode. In light mode, peaks saturate dark; in dark mode, peaks glow bright.",
  },
  {
    name: "data",
    type: "HeatmapNode[][]",
    default: "undefined",
    desc: "2D matrix of nodes: data[col][row]. If omitted, loads real GitHub contribution timeline.",
  },
  {
    name: "colorOnHover",
    type: "boolean",
    default: "true",
    desc: "Whether the pillar underneath the cursor highlights with 3D contour.",
  },
  {
    name: "intensity",
    type: "number",
    default: "0.6",
    desc: "Spring elevation radius and response intensity (0.2 subtle to 1.5 wide).",
  },
  {
    name: "onClick",
    type: "(node: HeatmapNode) => void",
    default: "undefined",
    desc: "Callback fired when a pillar is clicked. Also triggers a tactile shockwave.",
  },
  {
    name: "onHover",
    type: "(node: HeatmapNode | null) => void",
    default: "undefined",
    desc: "Callback fired with the currently hovered pillar coordinate, or null on leave.",
  },
];

export default function HeatmapDocumentationPage() {
  const [mode, setMode] = useComponentTheme<"light" | "dark">();
  const [range, setRange] = useState<HeatmapRange>("year");
  const [scheme, setScheme] = useState<HeatmapSchemeKey>("default");
  const [rawContributions, setRawContributions] = useState<RawContributionDay[] | null>(null);

  const activePalette = (GITHUB_SCHEMES[scheme] || GITHUB_SCHEMES.default)[mode];
  const isDark = mode === "dark";

  useEffect(() => {
    fetch("/api/contributions?username=ThaminduDasanayake")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.contributions && Array.isArray(data.contributions)) {
          setRawContributions(data.contributions);
        }
      })
      .catch(() => {
        // Fall back gracefully to procedural matrix
      });
  }, []);

  const { matrix } = useMemo(() => {
    if (rawContributions && rawContributions.length > 0) {
      return transformContributionsToMatrix(rawContributions, scheme, mode, range);
    }
    return generateProceduralMatrix(scheme, mode, range);
  }, [rawContributions, scheme, mode, range]);

  return (
    <DocsLayout
      title="Heatmap"
      description="An interactive 3D isometric contribution calendar on a plinth. Features full 52-week whole-year timelines, decoupled Dark & Light modes, official GitHub color schemes (Classic Green, Winter, and Halloween), and tactile kinematics."
      icon={<GitCommitIcon size={14} weight="bold" />}
    >
      {/* 1. Preview */}
      <ComponentPreview
        canvasClassName={`min-h-[460px] flex-col p-6 sm:p-8 transition-colors duration-300 ${
          isDark ? "bg-[#0d1117]" : "bg-[#F9FAFB]"
        }`}
        canvasStyle={{
          backgroundColor: isDark ? "#0d1117" : "#F9FAFB",
          transition: "background-color 300ms ease",
        }}
        controls={
          <div className="flex flex-col gap-6">
            {/* SelectBar Controls Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {/* Timeline Range SelectBar */}
              <div>
                <label className="text-xs font-semibold text-slate-900">Timeline</label>
                <div className="mt-2">
                  <SelectBar<HeatmapRange>
                    size="xs"
                    items={[
                      { key: "year", label: "Full Year (52w)" },
                      { key: "14w", label: "14 Weeks" },
                    ]}
                    value={range}
                    onChange={setRange}
                  />
                </div>
              </div>

              {/* Color Scheme SelectBar */}
              <div>
                <label className="text-xs font-semibold text-slate-900">Color Scheme</label>
                <div className="mt-2">
                  <SelectBar<HeatmapSchemeKey>
                    size="xs"
                    items={[
                      { key: "default", label: "Default" },
                      { key: "winter", label: "Winter" },
                      { key: "halloween", label: "Halloween" },
                    ]}
                    value={scheme}
                    onChange={setScheme}
                  />
                </div>
              </div>

              {/* Theme Mode SelectBar */}
              <ThemeControl
                layout="vertical"
                value={mode}
                onChange={setMode}
                ariaLabel="Select heatmap theme mode"
              />
            </div>

            {/* Bottom Scale Legend */}
            <div className="flex flex-wrap items-center justify-end gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400">Less</span>
                {([0, 1, 2, 3, 4] as const).map((tier) => (
                  <span
                    key={tier}
                    className="h-2.5 w-2.5 rounded-[2px] border border-black/10"
                    style={{ backgroundColor: activePalette.colors[tier] }}
                    title={`Tier ${tier}`}
                  />
                ))}
                <span className="text-[11px] text-slate-400">More</span>
              </div>
            </div>
          </div>
        }
      >
        <div className="w-full max-w-[840px] px-1 sm:px-2">
          <Heatmap data={matrix} scheme={scheme} mode={mode} range={range} colorOnHover />
        </div>
      </ComponentPreview>

      {/* 2. Installation */}
      <InstallationSection componentName="heatmap" />

      {/* 3. Usage */}
      <UsageSection codeText={CODE_EXAMPLE_TEXT} codeLines={CODE_EXAMPLE_LINES} />

      {/* 4. Props */}
      <PropsTable componentName="Heatmap" props={PROPS_DATA} />
    </DocsLayout>
  );
}
