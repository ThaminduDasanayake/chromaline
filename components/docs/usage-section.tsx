"use client";

import React from "react";
import { SelectBar, SelectBarItem } from "@/components/ui/select-bar";
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
  fileName?: string;
  codeText: string;
  codeLines?: CodeLine[];
  cssText?: string;
  cssLines?: CodeLine[];
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
  fileName = "App.tsx",
  codeText,
  codeLines,
  cssText,
  cssLines,
}: UsageSectionProps) {
  const [tab, setTab] = React.useState<"tsx" | "css">("tsx");
  const activeCodeText = tab === "tsx" ? codeText : cssText || "";
  const activeLines = tab === "tsx" ? codeLines : cssLines;

  const tabs: SelectBarItem<"tsx" | "css">[] = React.useMemo(
    () => [
      { key: "tsx", label: fileName },
      ...(cssText ? [{ key: "css" as const, label: "globals.css" }] : []),
    ],
    [fileName, cssText]
  );

  const computedLines = React.useMemo<CodeLine[]>(() => {
    if (activeLines && activeLines.length > 0) return activeLines;
    return activeCodeText.split("\n").map((text, idx) => ({
      num: idx + 1,
      parts: [{ text }] as CodeLinePart[],
    }));
  }, [activeLines, activeCodeText]);

  return (
    <section>
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">{description}</p>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-black/[0.08] bg-[#f7f7f6] shadow-2xs transition-colors duration-200 dark:border-white/10 dark:bg-[#0f0f0f]">
        {/* Top Header inside code container */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] bg-white/70 px-4 py-2.5 backdrop-blur-xs dark:border-white/10 dark:bg-[#181818]/70">
          {cssText ? (
            <SelectBar<"tsx" | "css"> size="xs" items={tabs} value={tab} onChange={setTab} />
          ) : (
            <span className="rounded-lg border border-black/[0.06] bg-black/[0.03] px-2.5 py-1 font-mono text-xs font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-300">
              {fileName}
            </span>
          )}

          <CopyButton
            value={activeCodeText}
            title={`Copy ${tab === "tsx" ? fileName : "globals.css"}`}
          />
        </div>

        {/* Code Content */}
        <div className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-slate-800 dark:text-zinc-200">
          <pre key={tab} className="m-0 p-0">
            <code className="table min-w-full">
              {computedLines.map((line) => (
                <div key={line.num} className="table-row">
                  <span className="table-cell pr-6 text-right text-slate-400 select-none dark:text-zinc-600">
                    {line.num}
                  </span>
                  <span className="table-cell whitespace-pre">
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
        </div>
      </div>
    </section>
  );
}
