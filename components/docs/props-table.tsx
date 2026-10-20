"use client";

import React from "react";

export interface PropItem {
  name: string;
  type: string;
  default: string;
  desc: string;
}

export interface PropsTableProps {
  componentName?: string;
  props: PropItem[];
}

export function PropsTable({ componentName, props }: PropsTableProps) {
  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Props</h2>
      <p className="mt-1 text-xs text-slate-500">
        TypeScript properties available on the{" "}
        {componentName ? <code className="font-mono">{componentName}</code> : "component"}.
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
            {props.map((p) => (
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
    </section>
  );
}
