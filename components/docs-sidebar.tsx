"use client";

import React from "react";

interface DocsSidebarProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
}

export function DocsSidebar({ activeSection, onSelectSection }: DocsSidebarProps) {
  return (
    <aside className="w-56 shrink-0 hidden lg:block sticky top-20 select-none">
      <nav aria-label="Component Library Navigation" className="space-y-6 pr-4">
        {/* Components */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
              Components
            </h4>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">
              1 Ready
            </span>
          </div>

          <ul className="space-y-1 text-[13px] border-l border-slate-200 pl-3 font-medium">
            <li>
              <button
                type="button"
                onClick={() => onSelectSection("rolodex")}
                className={`cursor-pointer w-full text-left py-1.5 transition-colors flex items-center justify-between ${
                  activeSection === "rolodex"
                    ? "text-slate-950 font-bold"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Rolodex</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  v0.1
                </span>
              </button>
            </li>

            {["Vault Guard", "Rack Cabinet", "Commit Tree"].map((item) => (
              <li key={item}>
                <div className="w-full text-left py-1 text-slate-400 flex items-center justify-between cursor-not-allowed">
                  <span>{item}</span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-50 text-slate-400 border border-slate-200">
                    Soon
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Documentation Sections */}
        <div>
          <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Documentation
          </h4>
          <ul className="space-y-1 text-[13px] border-l border-slate-200 pl-3 font-medium">
            {[
              { id: "installation", label: "Installation" },
              { id: "usage", label: "Usage" },
              { id: "props", label: "Props Reference" },
            ].map((sec) => (
              <li key={sec.id}>
                <button
                  type="button"
                  onClick={() => onSelectSection(sec.id)}
                  className={`cursor-pointer w-full text-left py-1 transition-colors flex items-center justify-between ${
                    activeSection === sec.id
                      ? "text-slate-950 font-bold"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  <span>{sec.label}</span>
                  {activeSection === sec.id && <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
