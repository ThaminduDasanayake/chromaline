"use client";

import React, { useState } from "react";
import { Terrain, TerrainNode } from "@/components/ui/terrain";
import { SelectBar } from "@/components/ui/select-bar";
import { SiteHeader, SiteFooter } from "@/components/layout";
import { InstallCommandTabs, BackLink } from "@/components/docs";
import { CopyIcon, CheckIcon, CubeIcon } from "@phosphor-icons/react";

const CODE_EXAMPLE_LINES = [
  {
    num: 1,
    parts: [
      { text: "import", cls: "text-[#f43f5e]" },
      { text: " { " },
      { text: "Terrain", cls: "text-slate-900 font-semibold" },
      { text: " } " },
      { text: "from", cls: "text-[#f43f5e]" },
      { text: ' "@/components/ui/terrain"', cls: "text-[#0284c7]" },
    ],
  },
  { num: 2, parts: [{ text: "" }] },
  {
    num: 3,
    parts: [
      { text: "export default function", cls: "text-[#f43f5e]" },
      { text: " MatrixDemo() {" },
    ],
  },
  {
    num: 4,
    parts: [
      { text: "  const [selected, setSelected] = useState(" },
      { text: "{ row: 4, col: 4 }", cls: "text-[#0284c7]" },
      { text: ");" },
    ],
  },
  { num: 5, parts: [{ text: "" }] },
  { num: 6, parts: [{ text: "  return (" }] },
  {
    num: 7,
    parts: [
      { text: "    <", cls: "text-slate-500" },
      { text: "Terrain", cls: "text-[#16a34a] font-semibold" },
    ],
  },
  {
    num: 8,
    parts: [
      { text: "      gridSize={9}" },
      { text: " // 9x9 = 81 pillars (supports 7, 9, 11, 13, 15)", cls: "text-slate-400" },
    ],
  },
  {
    num: 9,
    parts: [
      { text: "      intensity={0.65}" },
    ],
  },
  {
    num: 10,
    parts: [
      { text: "      selected={selected}" },
    ],
  },
  {
    num: 11,
    parts: [
      { text: "      onClick={(node) => setSelected(node)}" },
    ],
  },
  {
    num: 12,
    parts: [
      { text: '      accentColor="#E54F10"' },
    ],
  },
  {
    num: 13,
    parts: [
      { text: "    />", cls: "text-slate-500" },
    ],
  },
  { num: 14, parts: [{ text: "  );" }] },
  { num: 15, parts: [{ text: "}" }] },
];

const CODE_EXAMPLE_TEXT = `import { useState } from "react";
import { Terrain } from "@/components/ui/terrain";

export default function MatrixDemo() {
  const [selected, setSelected] = useState({ row: 4, col: 4 });

  return (
    <Terrain
      gridSize={9} // 9x9 = 81 pillars (or 7, 11, 13, 15)
      intensity={0.65}
      selected={selected}
      onClick={(node) => setSelected(node)}
      accentColor="#E54F10"
    />
  );
}`;

const PROPS_DATA = [
  {
    name: "gridSize",
    type: "number",
    default: "9",
    desc: "Number of pillars per axis. e.g. 7 (49 nodes), 9 (81 nodes), 11 (121 nodes), 13 (169 nodes).",
  },
  {
    name: "intensity",
    type: "number",
    default: "0.6",
    desc: "Spring elevation radius and response intensity (0.2 subtle to 1.5 wide).",
  },
  {
    name: "play",
    type: "boolean",
    default: "true",
    desc: "Whether the terrain animates with an autonomous breathing wave when idle.",
  },
  {
    name: "selected",
    type: "{ row: number; col: number } | null",
    default: "null",
    desc: "Currently selected/pinned node coordinate.",
  },
  {
    name: "onClick",
    type: "(node: TerrainNode) => void",
    default: "undefined",
    desc: "Callback fired when a pillar is clicked. Also triggers a tactile shockwave.",
  },
  {
    name: "onHover",
    type: "(node: TerrainNode | null) => void",
    default: "undefined",
    desc: "Callback fired with the currently hovered pillar coordinate, or null on leave.",
  },
  {
    name: "accentColor",
    type: "string",
    default: '"#E54F10"',
    desc: "Highlight fill color for the selected node and its beacon dot.",
  },
];

const ACCENT_SWATCHES = [
  { key: "orange", label: "Orange", color: "#E54F10", darkOutline: "#7C2D12" },
  { key: "blue", label: "Blue", color: "#0A90D2", darkOutline: "#075985" },
  { key: "emerald", label: "Emerald", color: "#059669", darkOutline: "#047857" },
  { key: "violet", label: "Violet", color: "#8B5CF6", darkOutline: "#4C1D95" },
];

export default function TerrainDocumentationPage() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copiedCode, setCopiedCode] = useState(false);

  // Playground state
  const [gridSize, setGridSize] = useState<number>(9);
  const [intensity, setIntensity] = useState<number>(0.65);
  const [play, setPlay] = useState<boolean>(true);
  const [accentKey, setAccentKey] = useState<string>("orange");
  const [selectedNode, setSelectedNode] = useState<TerrainNode | null>({
    row: 4,
    col: 4,
    height: 38,
  });

  const activeColor =
    ACCENT_SWATCHES.find((s) => s.key === accentKey)?.color || "#E54F10";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLE_TEXT);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-sans text-slate-900 selection:bg-slate-200">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 md:px-8">
        <BackLink />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <CubeIcon size={14} weight="bold" />
            <span>Components</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Terrain
          </h1>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            An interactive 3D isometric topographic pillar matrix on a plinth. Features
            configurable grid density (49 to 169+ nodes), ray-unprojected click resolution,
            spring elevation kinematics, and shockwave impulse waves.
          </p>
        </div>

        {/* Installation Section */}
        <div className="mb-10">
          <InstallCommandTabs componentName="terrain" />
        </div>

        {/* Interactive Playground Canvas */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
          {/* Canvas Tabs */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === "preview"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("code")}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === "code"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Code
              </button>
            </div>

            {activeTab === "code" && (
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                {copiedCode ? (
                  <>
                    <CheckIcon size={13} weight="bold" className="text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <CopyIcon size={13} weight="bold" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Interactive Preview Canvas */}
          {activeTab === "preview" ? (
            <div className="relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden bg-[#F9FAFB] p-8">
              <div className="w-[280px] sm:w-[320px] md:w-[360px]">
                <Terrain
                  gridSize={gridSize}
                  intensity={intensity}
                  play={play}
                  selected={selectedNode}
                  onClick={(node) => setSelectedNode(node)}
                  accentColor={activeColor}
                />
              </div>

              {/* Status Readout Badge */}
              <div className="mt-4 flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white px-3.5 py-1.5 font-mono text-xs text-slate-600 shadow-2xs">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: activeColor }}
                />
                {selectedNode ? (
                  <span>
                    Selected: Node [{selectedNode.row}, {selectedNode.col}] · Elevation{" "}
                    {selectedNode.height.toFixed(1)}px
                  </span>
                ) : (
                  <span>Click any pillar to select & trigger shockwave</span>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto bg-[#F9FAFB] p-6 font-mono text-xs leading-relaxed text-slate-800">
              <pre className="m-0 p-0">
                <code>
                  {CODE_EXAMPLE_LINES.map((line) => (
                    <div key={line.num} className="table-row">
                      <span className="table-cell select-none pr-6 text-right text-slate-400">
                        {line.num}
                      </span>
                      <span className="table-cell">
                        {line.parts.map((p, idx) => (
                          <span key={idx} className={p.cls || "text-slate-800"}>
                            {p.text}
                          </span>
                        ))}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          )}

          {/* Playground Controls Footer */}
          <div className="grid grid-cols-1 gap-6 border-t border-slate-100 bg-white p-5 sm:grid-cols-2 md:grid-cols-4 sm:p-6">
            {/* Grid Size Control */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-900">Grid Size</label>
                <span className="font-mono text-xs text-slate-500">
                  {gridSize}×{gridSize} ({gridSize * gridSize})
                </span>
              </div>
              <div className="mt-2.5">
                <SelectBar<string>
                  size="xs"
                  items={[
                    { key: "7", label: "7×7" },
                    { key: "9", label: "9×9" },
                    { key: "11", label: "11×11" },
                    { key: "13", label: "13×13" },
                  ]}
                  value={String(gridSize)}
                  onChange={(v) => {
                    const next = Number(v);
                    setGridSize(next);
                    setSelectedNode({ row: Math.floor(next / 2), col: Math.floor(next / 2), height: 35 });
                  }}
                />
              </div>
            </div>

            {/* Accent Color Swatches */}
            <div>
              <label className="text-xs font-semibold text-slate-900">Accent Color</label>
              <div className="mt-2.5">
                <SelectBar
                  size="xs"
                  items={ACCENT_SWATCHES}
                  value={accentKey}
                  onChange={setAccentKey}
                />
              </div>
            </div>

            {/* Intensity Slider */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-900">Spring Spread</label>
                <span className="font-mono text-xs text-slate-500">
                  {Math.round(intensity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.3"
                max="1.2"
                step="0.05"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="isocraft-slider mt-3.5"
              />
            </div>

            {/* Idle Animation Toggle */}
            <div>
              <label className="text-xs font-semibold text-slate-900">Idle Wave</label>
              <div className="mt-2.5">
                <SelectBar<string>
                  size="xs"
                  items={[
                    { key: "on", label: "Wave On" },
                    { key: "off", label: "Static" },
                  ]}
                  value={play ? "on" : "off"}
                  onChange={(v) => setPlay(v === "on")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Props Reference Table */}
        <div className="mb-16">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Props</h2>
          <p className="mt-1 text-xs text-slate-500">
            TypeScript properties available on the <code className="font-mono">Terrain</code> component.
          </p>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-5 py-3 font-semibold text-slate-900">Prop</th>
                  <th className="px-5 py-3 font-semibold text-slate-900">Type</th>
                  <th className="px-5 py-3 font-semibold text-slate-900">Default</th>
                  <th className="px-5 py-3 font-semibold text-slate-900">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PROPS_DATA.map((p) => (
                  <tr key={p.name} className="hover:bg-slate-50/40">
                    <td className="px-5 py-3 font-mono font-medium text-slate-900">{p.name}</td>
                    <td className="px-5 py-3 font-mono text-purple-700">{p.type}</td>
                    <td className="px-5 py-3 font-mono text-slate-500">{p.default}</td>
                    <td className="px-5 py-3 leading-relaxed text-slate-600">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
