"use client";

import React, { forwardRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircleIcon, CopyIcon } from "@phosphor-icons/react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

export interface CopyButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onCopy"
> {
  /** The text or code string to copy to the clipboard */
  value: string;
  /** Label to display next to the icon in resting state (default: "Copy") */
  label?: React.ReactNode;
  /** Optional label override when copied (by default remains the same label) */
  copiedLabel?: React.ReactNode;
  /** Duration in milliseconds before resetting copied state (default: 1200) */
  timeout?: number;
  /** Render only the icon without text label */
  iconOnly?: boolean;
  /** Callback fired after successfully copying */
  onCopy?: (value: string) => void;
}

const uiEaseOut = [0.23, 1, 0.32, 1] as const;

/**
 * ══ CopyButton ═════════════════════════════════════════════════
 * Tactile copy-to-clipboard button featuring mechanical click yield,
 * subtle surface elevation, and a directional popLayout checkmark icon
 * animation between CopyIcon and filled CheckCircleIcon.
 * ═════════════════════════════════════════════════════════════════
 */
export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(function CopyButton(
  {
    value,
    label = "Copy",
    copiedLabel,
    timeout = 1200,
    iconOnly = false,
    className,
    onClick,
    onCopy,
    children,
    title,
    disabled,
    ...props
  },
  ref
) {
  const { copied, copy } = useCopyToClipboard({ timeout, onCopy });
  const shouldReduceMotion = useReducedMotion();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented && !disabled) {
      copy(value);
    }
  };

  const displayText = children ?? (iconOnly ? null : copied && copiedLabel ? copiedLabel : label);

  const iconVisible = { opacity: 1, transform: "translateY(0px)" };
  const iconInitial = shouldReduceMotion
    ? { opacity: 0, transform: "translateY(0px)" }
    : { opacity: 0, transform: "translateY(8px)" };
  const iconExit = shouldReduceMotion
    ? { opacity: 0, transform: "translateY(0px)" }
    : { opacity: 0, transform: "translateY(-8px)" };
  const iconTransition = {
    duration: shouldReduceMotion ? 0.14 : 0.18,
    ease: uiEaseOut,
  };

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={handleClick}
      title={title || (copied ? "Copied to clipboard" : "Copy to clipboard")}
      aria-label={typeof displayText === "string" ? displayText : "Copy to clipboard"}
      className={cn(
        "group inline-flex h-7 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium shadow-2xs select-none",
        "transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
        "disabled:pointer-events-none disabled:opacity-40",
        copied
          ? "border-[#a7f3d0] bg-[#ecfdf5] text-[#047857] shadow-[0_1px_2px_rgba(16,185,129,0.06)]"
          : "border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900",
        className
      )}
      {...props}
    >
      {/* Animated PopLayout Icon */}
      <span className="relative inline-grid size-[14px] shrink-0 overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={copied ? "copied" : "copy"}
            animate={iconVisible}
            initial={iconInitial}
            exit={iconExit}
            transition={iconTransition}
            className="col-start-1 row-start-1 flex size-[14px] items-center justify-center"
          >
            {copied ? (
              <CheckCircleIcon
                aria-hidden="true"
                size={14}
                weight="fill"
                className="text-[#16a34a]"
              />
            ) : (
              <CopyIcon
                aria-hidden="true"
                size={14}
                weight="bold"
                className="text-slate-500 transition-colors group-hover:text-slate-900"
              />
            )}
          </motion.span>
        </AnimatePresence>
      </span>

      {/* Text Label (stays "Copy") */}
      {displayText ? <span>{displayText}</span> : null}
    </button>
  );
});
