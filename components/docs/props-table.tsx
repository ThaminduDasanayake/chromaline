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
      <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
        Props
      </h2>
      <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
        TypeScript properties available on the{" "}
        {componentName ? (
          <code className="font-mono text-slate-900 dark:text-white">{componentName}</code>
        ) : (
          "component"
        )}
        .
      </p>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-2xs dark:border-white/10 dark:bg-[#121214]">
        <table className="w-full text-left font-sans text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 dark:border-white/10 dark:bg-white/5">
              <th className="px-5 py-3 font-semibold text-slate-900 dark:text-white">Prop</th>
              <th className="px-5 py-3 font-semibold text-slate-900 dark:text-white">Type</th>
              <th className="px-5 py-3 font-semibold text-slate-900 dark:text-white">Default</th>
              <th className="px-5 py-3 font-semibold text-slate-900 dark:text-white">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/10">
            {props.map((p) => (
              <tr key={p.name} className="hover:bg-slate-50/40 dark:hover:bg-white/5">
                <td className="px-5 py-3 font-mono font-medium text-slate-900 dark:text-white">
                  {p.name}
                </td>
                <td className="px-5 py-3 font-mono text-purple-700 dark:text-purple-400">
                  {p.type}
                </td>
                <td className="px-5 py-3 font-mono text-slate-500 dark:text-zinc-400">
                  {p.default}
                </td>
                <td className="px-5 py-3 leading-relaxed text-slate-600 dark:text-zinc-300">
                  {p.desc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
