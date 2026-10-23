import React from "react";

export type ButtonVariant = "default" | "dark" | "orange" | "emerald";
export type ButtonSize = "sm" | "default" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  depth?: string;
  radius?: string;
  faceColor?: string;
  faceHighlight?: string;
  contentColor?: string;
  baseColor?: string;
  baseShadow?: string;
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

const VARIANTS = {
  default: {
    face: "#4a4a46",
    highlight: "#64645e",
    content: "#eeeeec",
    base: "#292926",
    shadow: "#141412",
  },
  dark: {
    face: "#1e2024",
    highlight: "#353840",
    content: "#ffffff",
    base: "#111215",
    shadow: "#09090b",
  },
  orange: {
    face: "#e54f10",
    highlight: "#fb713b",
    content: "#ffffff",
    base: "#9a3412",
    shadow: "#7c2d12",
  },
  emerald: {
    face: "#059669",
    highlight: "#10b981",
    content: "#ffffff",
    base: "#047857",
    shadow: "#064e3b",
  },
};

const SIZES = {
  sm: {
    depth: "4px",
    radius: "0.5rem",
    inner: "h-7 gap-1 px-2.5 text-[11px]",
  },
  default: {
    depth: "6px",
    radius: "0.75rem",
    inner: "h-8 gap-1.5 px-3 text-xs",
  },
  lg: {
    depth: "7px",
    radius: "0.875rem",
    inner: "h-10 gap-2 px-4 text-sm",
  },
};

export const Button = React.forwardRef<HTMLButtonElement & HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = "default",
      size = "default",
      depth,
      radius,
      faceColor,
      faceHighlight,
      contentColor,
      baseColor,
      baseShadow,
      href,
      target,
      rel,
      children,
      className = "",
      style,
      disabled,
      ...props
    },
    ref
  ) => {
    const v = VARIANTS[variant] || VARIANTS.default;
    const s = SIZES[size] || SIZES.default;

    const actualDepth = depth || s.depth;
    const actualRadius = radius || s.radius;

    const customStyles: Record<string, string> = {
      "--tactile-depth": actualDepth,
      "--tactile-radius": actualRadius,
      "--tactile-face": faceColor || v.face,
      "--tactile-face-highlight": faceHighlight || v.highlight,
      "--tactile-content": contentColor || v.content,
      "--tactile-base": baseColor || v.base,
      "--tactile-base-shadow": baseShadow || v.shadow,
    };

    const combinedStyle = {
      ...customStyles,
      ...style,
    } as React.CSSProperties;

    const baseClasses = `group/tactile relative inline-grid w-max shrink-0 cursor-pointer select-none border-0 bg-transparent p-0 pb-[var(--tactile-depth)] font-inherit leading-none focus-visible:rounded-[var(--tactile-radius)] focus-visible:outline-2 focus-visible:outline-slate-700 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45 ${className}`;

    const innerContent = (
      <>
        {/* 3D Base extrusion shadow */}
        <span className="absolute inset-x-0 top-(--tactile-depth) bottom-0 rounded-(--tactile-radius) bg-(--tactile-base) shadow-[inset_0_-1px_0_var(--tactile-base-shadow)]" />

        {/* 3D Surface Face with mechanical push kinematics */}
        <span
          className={`relative flex items-center justify-center rounded-(--tactile-radius) bg-(--tactile-face) font-medium text-(--tactile-content) shadow-[inset_0_1px_0_var(--tactile-face-highlight)] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-active/tactile:translate-y-(--tactile-depth) motion-reduce:transform-none motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/tactile:translate-y-0.5 ${s.inner}`}
        >
          {children}
        </span>
      </>
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={target === "_blank" ? rel || "noopener noreferrer" : rel}
          style={combinedStyle}
          className={baseClasses}
          aria-disabled={disabled}
        >
          {innerContent}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        style={combinedStyle}
        className={baseClasses}
        disabled={disabled}
        {...props}
      >
        {innerContent}
      </button>
    );
  }
);

Button.displayName = "Button";
