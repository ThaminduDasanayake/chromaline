"use client";

import React, { useMemo, useState } from "react";
import {
  Heatmap,
  HeatmapSchemeKey,
  HeatmapMode,
  HeatmapProfile,
  HeatmapNode,
  GITHUB_SCHEMES,
  generateHeatmapMatrix,
  generateThaminduMatrix,
} from "@/components/ui/heatmap";
import { SelectBar } from "@/components/ui/select-bar";
import { GitCommitIcon, CalendarBlankIcon } from "@phosphor-icons/react";
import {
  DocsLayout,
  ComponentPreview,
  InstallationSection,
  UsageSection,
  PropsTable,
  PropItem,
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
      { text: '      scheme="default"' },
      { text: ' // "default" | "winter" | "halloween"', cls: "text-slate-400" },
    ],
  },
  {
    num: 7,
    parts: [
      { text: '      mode="dark"' },
      { text: ' // "dark" | "light"', cls: "text-slate-400" },
    ],
  },
  {
    num: 8,
    parts: [
      { text: '      profile="thamindu"' },
      { text: ' // "thamindu" | "maintainer" | "weekend" | "sprint"', cls: "text-slate-400" },
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
      scheme="default" // "default" | "winter" | "halloween"
      mode="dark" // "dark" | "light"
      profile="thamindu" // "thamindu" | "maintainer" | "weekend" | "sprint"
      colorOnHover
    />
  );
}`;

const PROPS_DATA: PropItem[] = [
  {
    name: "scheme",
    type: '"default" | "winter" | "halloween"',
    default: '"default"',
    desc: "Color scheme: Classic Green, Winter (Ice Blue), or Halloween (Pumpkin & Gold).",
  },
  {
    name: "mode",
    type: '"dark" | "light"',
    default: '"dark"',
    desc: "Visual theme mode. In dark mode, peaks glow bright; in light mode, peaks saturate dark.",
  },
  {
    name: "profile",
    type: '"thamindu" | "maintainer" | "weekend" | "sprint"',
    default: '"thamindu"',
    desc: "Activity profile preset. 'thamindu' loads real 1,016 GitHub commits; others synthesize patterns.",
  },
  {
    name: "data",
    type: "HeatmapNode[][]",
    default: "undefined",
    desc: "2D matrix of nodes: data[col][row]. If omitted, generates realistic 14-week timeline.",
  },
  {
    name: "colorOnHover",
    type: "boolean",
    default: "true",
    desc: "Whether the pillar directly underneath the cursor highlights with accentColor.",
  },
  {
    name: "accentColor",
    type: "string",
    default: "palette.accent",
    desc: "Highlight fill color override for hovered node and beacon dot.",
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
  const [scheme, setScheme] = useState<HeatmapSchemeKey>("default");
  const [mode, setMode] = useState<HeatmapMode>("dark");
  const [profile, setProfile] = useState<HeatmapProfile>("thamindu");
  const [hoveredNode, setHoveredNode] = useState<HeatmapNode | null>(null);

  const activePalette = (GITHUB_SCHEMES[scheme] || GITHUB_SCHEMES.default)[mode];
  const isDark = mode === "dark";

  const { matrix, totalContributions } = useMemo(() => {
    if (profile === "thamindu") {
      return generateThaminduMatrix(scheme, mode);
    }
    return generateHeatmapMatrix(profile, scheme, mode);
  }, [profile, scheme, mode]);

  return (
    <DocsLayout
      title="Heatmap"
      description="An interactive 3D isometric contribution calendar on a plinth. Features decoupled Dark & Light modes, official GitHub color schemes (Classic Green, Winter, and Halloween), and tactile kinematics."
      icon={<GitCommitIcon size={14} weight="bold" />}
    >
      {/* 1. Preview */}
      <ComponentPreview
        canvasClassName={`min-h-[400px] flex-col p-6 sm:p-8 transition-colors duration-300 ${activePalette.canvasBg}`}
        controls={
          <div className="flex flex-col gap-6">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                  <GitCommitIcon size={13} weight="bold" />
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  {profile === "thamindu" ? (
                    <>
                      <a
                        href="https://github.com/ThaminduDasanayake"
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 underline underline-offset-2 hover:text-emerald-700"
                      >
                        github.com/ThaminduDasanayake
                      </a>
                      <span className="ml-1.5 font-normal text-slate-500">
                        · Real 14-Week Skyline
                      </span>
                    </>
                  ) : (
                    "14-Week Activity Timeline"
                  )}
                </span>
              </div>
              <span className="font-mono text-xs text-slate-500">
                <strong className="text-slate-900">{totalContributions.toLocaleString()}</strong> contributions
              </span>
            </div>

            {/* SelectBar Controls Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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
              <div>
                <label className="text-xs font-semibold text-slate-900">Theme Mode</label>
                <div className="mt-2">
                  <SelectBar<HeatmapMode>
                    size="xs"
                    items={[
                      { key: "dark", label: "Dark" },
                      { key: "light", label: "Light" },
                    ]}
                    value={mode}
                    onChange={setMode}
                  />
                </div>
              </div>

              {/* Activity Profile SelectBar */}
              <div>
                <label className="text-xs font-semibold text-slate-900">Pattern</label>
                <div className="mt-2">
                  <SelectBar<HeatmapProfile>
                    size="xs"
                    items={[
                      { key: "thamindu", label: "@Thamindu" },
                      { key: "maintainer", label: "Maintainer" },
                      { key: "weekend", label: "Weekend" },
                      { key: "sprint", label: "Sprint" },
                    ]}
                    value={profile}
                    onChange={setProfile}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Scale Legend */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CalendarBlankIcon size={14} weight="bold" className="text-slate-400" />
                <span>$X$: 14 Weeks · $Y$: Mon–Sun (7 Days) · $Z$: Commit Volume</span>
              </div>

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
        <div className="w-full max-w-[580px]">
          <Heatmap
            data={matrix}
            scheme={scheme}
            mode={mode}
            colorOnHover
            onHover={setHoveredNode}
          />
        </div>

        {/* Live Hover Inspector Badge */}
        <div
          className={`mt-4 flex items-center gap-2.5 rounded-full px-4 py-1.5 font-mono text-xs shadow-2xs transition-all ${
            isDark
              ? "border border-white/10 bg-[#161b22]/90 text-slate-200 backdrop-blur-md"
              : "border border-slate-200/90 bg-white/95 text-slate-700 backdrop-blur-md"
          }`}
        >
          {hoveredNode ? (
            <>
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: hoveredNode.color || activePalette.accent }}
              />
              <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                {hoveredNode.label}:
              </span>
              <span>
                {hoveredNode.count === 0
                  ? "No contributions"
                  : `${hoveredNode.count} contribution${
                      hoveredNode.count === 1 ? "" : "s"
                    }`}
              </span>
            </>
          ) : (
            <span className="text-slate-400">
              Hover over any pillar to inspect date and commit volume
            </span>
          )}
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
