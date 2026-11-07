"use client";

import React from "react";
import { CopyButton } from "@/components/ui/copy-button";

export interface CodeLinePart {
  text: string;
  cls?: string;
}

export interface CodeLine {
  num: number;
  parts: CodeLinePart[];
}

export interface UsageSectionProps {
  title?: string;
  description?: string;
  codeText: string;
  codeLines?: CodeLine[];
}

function getCodeTokenClass(cls?: string): string {
  if (!cls) return "text-slate-800 dark:text-zinc-200";

  // If a dark text color is already explicitly specified, preserve it
  if (cls.includes("dark:text-")) {
    return cls;
  }

  const additions: string[] = [];

  // Identifiers / main keywords (e.g. `LabelInput`, `Folder`, `Continue`)
  if (cls.includes("text-slate-900")) {
    additions.push("dark:text-zinc-100");
  }
  // String literals / booleans (e.g. ` "@/components/ui/..." `, `""`, `"#232327"`)
  if (cls.includes("text-[#0284c7]")) {
    additions.push("dark:text-sky-300");
  }
  // JSX Props (e.g. `field`, `corner`, `onChange`, `className`)
  if (cls.includes("text-purple-600")) {
    additions.push("dark:text-purple-300");
  }
  // Component names / JSX tags (e.g. `<LabelInput`, `<SelectBar`)
  if (cls.includes("text-[#16a34a]")) {
    additions.push("dark:text-emerald-400");
  }
  // Flow keywords (e.g. `import`, `export default function`, `from`, `const`)
  if (cls.includes("text-[#f43f5e]")) {
    additions.push("dark:text-rose-400");
  }
  // Brackets / JSX symbols (e.g. `<`, `/>`, `</`, `>`)
  if (cls.includes("text-slate-500")) {
    additions.push("dark:text-zinc-400");
  }
  // Comments (e.g. `// "default" | "winter"`)
  if (cls.includes("text-slate-400")) {
    additions.push("dark:text-zinc-500");
  }

  return additions.length > 0 ? `${cls} ${additions.join(" ")}` : cls;
}

export function UsageSection({
  title = "Usage",
  description = "Import and use the component in your React application.",
  codeText,
  codeLines,
}: UsageSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">{description}</p>
          )}
        </div>

        <CopyButton value={codeText} title="Copy code" />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-black/[0.08] bg-[#f7f7f6] shadow-2xs transition-colors duration-200 dark:border-white/10 dark:bg-[#0f0f0f]">
        <div className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-slate-800 dark:text-zinc-200">
          {codeLines ? (
            <pre className="m-0 p-0">
              <code>
                {codeLines.map((line) => (
                  <div key={line.num} className="table-row">
                    <span className="table-cell pr-6 text-right text-slate-400 select-none dark:text-zinc-600">
                      {line.num}
                    </span>
                    <span className="table-cell">
                      {line.parts.map((p, idx) => (
                        <span key={idx} className={getCodeTokenClass(p.cls)}>
                          {p.text}
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          ) : (
            <pre className="m-0 p-0">
              <code>{codeText}</code>
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}
