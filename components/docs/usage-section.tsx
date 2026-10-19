"use client";

import React, { useState } from "react";
import { CopyIcon, CheckIcon } from "@phosphor-icons/react";

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

export function UsageSection({
  title = "Usage",
  description = "Import and use the component in your React application.",
  codeText,
  codeLines,
}: UsageSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {title}
          </h2>
          {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900"
          title="Copy code"
        >
          {copied ? (
            <>
              <CheckIcon size={13} weight="bold" className="text-emerald-600" />
              <span className="font-semibold text-emerald-600">Copied</span>
            </>
          ) : (
            <>
              <CopyIcon size={13} weight="bold" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/90 bg-[#F9FAFB] shadow-2xs">
        <div className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-slate-800">
          {codeLines ? (
            <pre className="m-0 p-0">
              <code>
                {codeLines.map((line) => (
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
