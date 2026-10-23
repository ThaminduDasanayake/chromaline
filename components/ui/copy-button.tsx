"use client";

import React from "react";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export interface CopyButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onCopy"> {
  /** The text or code string to copy to the clipboard */
  value: string;
  /** Label to display next to the icon in resting state (default: "Copy") */
  label?: React.ReactNode;
  /** Label to display next to the check icon when copied (default: "Copied") */
  copiedLabel?: React.ReactNode;
  /** Duration in milliseconds before resetting copied state (default: 2000) */
  timeout?: number;
  /** Render only the icon without text label */
  iconOnly?: boolean;
  /** Callback fired after successfully copying */
  onCopy?: (value: string) => void;
}

/**
 * CopyButton
 *
 * Interactive tactile button component that copies text to the clipboard
 * using the useCopyToClipboard hook with animated visual feedback.
 */
export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  timeout = 2000,
  iconOnly = false,
  className = "",
  title,
  onClick,
  onCopy,
  ...props
}: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard({ timeout, onCopy });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      copy(value);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={title || (copied ? "Copied to clipboard" : "Copy to clipboard")}
      aria-label={typeof label === "string" ? label : "Copy to clipboard"}
      className={`flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-slate-900 ${
        copied ? "border-emerald-200 bg-emerald-50/50 text-emerald-700" : ""
      } ${className}`}
      {...props}
    >
      {copied ? (
        <>
          <CheckIcon size={13} weight="bold" className="shrink-0 text-emerald-600" />
          {!iconOnly && copiedLabel && (
            <span className="font-semibold text-emerald-600">{copiedLabel}</span>
          )}
        </>
      ) : (
        <>
          <CopyIcon size={13} weight="bold" className="shrink-0" />
          {!iconOnly && label && <span>{label}</span>}
        </>
      )}
    </button>
  );
}
