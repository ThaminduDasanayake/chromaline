"use client";

import React from "react";

interface DocsSidebarProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
}

export function DocsSidebar({ activeSection, onSelectSection }: DocsSidebarProps) {
  return (
    <aside className="sticky top-20 hidden w-56 shrink-0 select-none lg:block">
      <nav aria-label="Component Library Navigation" className="space-y-6 pr-4">
        {/* Components */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="font-mono text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Components
            </h4>
            <span className="py-0.2 rounded bg-slate-100 px-1.5 font-mono text-[10px] font-semibold text-slate-600">
              1 Ready
            </span>
          </div>

          <ul className="space-y-1 border-l border-slate-200 pl-3 text-[13px] font-medium">
            <li>
              <button
                type="button"
                onClick={() => onSelectSection("folder-tray")}
                className={`flex w-full cursor-pointer items-center justify-between py-1.5 text-left transition-colors ${
                  activeSection === "folder-tray"
                    ? "font-bold text-slate-950"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Folder Tray</span>
                </div>
                <span className="py-0.2 rounded border border-emerald-200 bg-emerald-50 px-1.5 font-mono text-[10px] font-semibold text-emerald-700 uppercase">
                  v0.1
                </span>
              </button>
            </li>

            {["Vault Guard", "Rack Cabinet", "Commit Tree"].map((item) => (
              <li key={item}>
                <div className="flex w-full cursor-not-allowed items-center justify-between py-1 text-left text-slate-400">
                  <span>{item}</span>
                  <span className="py-0.2 rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[9px] text-slate-400 uppercase">
                    Soon
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Documentation Sections */}
        <div>
          <h4 className="mb-2 font-mono text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Documentation
          </h4>
          <ul className="space-y-1 border-l border-slate-200 pl-3 text-[13px] font-medium">
            {[
              { id: "installation", label: "Installation" },
              { id: "usage", label: "Usage" },
              { id: "props", label: "Props Reference" },
            ].map((sec) => (
              <li key={sec.id}>
                <button
                  type="button"
                  onClick={() => onSelectSection(sec.id)}
                  className={`flex w-full cursor-pointer items-center justify-between py-1 text-left transition-colors ${
                    activeSection === sec.id
                      ? "font-bold text-slate-950"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  <span>{sec.label}</span>
                  {activeSection === sec.id && (
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
