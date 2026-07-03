import { type LucideIcon } from "lucide-react";
import { hexPath, type HexOrientation, type NodeVariant } from "./primitives";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface HexNodeProps {
  /** px size of the square SVG box. */
  size?: number;
  variant?: NodeVariant;
  /** Tint with brand orange instead of neutral slate. */
  accent?: boolean;
  /** Optional centered glyph (lucide). Inherits node color. */
  icon?: LucideIcon;
  orientation?: HexOrientation;
  /** Ambient "breathing" pulse — only runs when motion is allowed. */
  pulse?: boolean;
  /** Optional caption below the node — real label only (taxonomy / i18n). */
  label?: string;
  /** If provided, the node is exposed to AT as an image; otherwise decorative. */
  ariaLabel?: string;
  className?: string;
}

/**
 * A single flat-top hexagon node — the atomic unit of the connected-systems
 * language (abstracted from the logo glyph). Standalone use (e.g. a hint on a
 * pillar card); `SystemMap` draws its own nodes from the shared geometry.
 */
export function HexNode({
  size = 40,
  variant = "outline",
  accent = false,
  icon: Icon,
  orientation = "flat",
  pulse = false,
  label,
  ariaLabel,
  className = "",
}: HexNodeProps) {
  const reduced = useReducedMotion();
  const animate = pulse && !reduced;
  const semantic = !!ariaLabel;
  const r = size / 2 - 1.5; // inset so the 1.5px stroke isn't clipped
  const color = accent ? "text-brand-500" : "text-slate-600";
  const fillOpacity = variant === "solid" ? 0.12 : variant === "ghost" ? 0.06 : 0;
  const strokeOpacity = variant === "ghost" ? 0.5 : 1;

  return (
    <span className={`inline-flex flex-col items-center gap-1 ${className}`}>
      <span className="relative inline-flex" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={color}
          role={semantic ? "img" : undefined}
          aria-label={semantic ? ariaLabel : undefined}
          aria-hidden={semantic ? undefined : true}
          style={animate ? { animation: "hex-pulse 4s ease-in-out infinite" } : undefined}
        >
          <path
            d={hexPath(size / 2, size / 2, r, orientation)}
            fill="currentColor"
            fillOpacity={fillOpacity}
            stroke="currentColor"
            strokeOpacity={strokeOpacity}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </svg>
        {Icon && (
          <span
            className={`absolute inset-0 flex items-center justify-center ${accent ? "text-brand-400" : "text-slate-300"}`}
            aria-hidden="true"
          >
            <Icon width={size * 0.42} height={size * 0.42} />
          </span>
        )}
      </span>
      {label && <span className="text-[10px] font-medium tracking-wide text-slate-400">{label}</span>}
    </span>
  );
}
