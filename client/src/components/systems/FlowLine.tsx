import { edgePath, type EdgeVariant, type Point } from "./primitives";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface FlowLineProps {
  from: Point;
  to: Point;
  variant?: EdgeVariant;
  /** brand-tinted vs neutral slate. */
  accent?: boolean;
  /** Faint background line (thinner + lower opacity) for depth layering. */
  faint?: boolean;
  dashed?: boolean;
  /** Mount the travelling "comet" — only when motion is allowed. */
  pulse?: boolean;
  strokeWidth?: number;
  durationMs?: number;
}

/**
 * A thin connector between two points, optionally carrying a slow travelling
 * pulse. Renders an SVG `<g>` fragment — it must live inside an `<svg>` (e.g.
 * `SystemMap`), whose coordinate space `from`/`to` refer to. Always decorative
 * (`aria-hidden`); meaning is conveyed by the parent map's label.
 */
export function FlowLine({
  from,
  to,
  variant = "curve",
  accent = false,
  faint = false,
  dashed = false,
  pulse = false,
  strokeWidth = 1.5,
  durationMs = 4000,
}: FlowLineProps) {
  const reduced = useReducedMotion();
  const d = edgePath(from, to, variant);
  const baseOpacity = faint ? 0.28 : accent ? 0.6 : 0.85;
  const baseWidth = faint ? strokeWidth * 0.7 : strokeWidth;

  return (
    <g aria-hidden="true" className={accent ? "text-brand-500" : "text-slate-700"}>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeOpacity={baseOpacity}
        strokeWidth={baseWidth}
        strokeDasharray={dashed ? "3 4" : undefined}
        strokeLinecap="round"
      />
      {pulse && !reduced && (
        <path
          d={d}
          fill="none"
          className="text-brand-400"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray="6 240"
          style={{ animation: `flow-travel ${durationMs}ms linear infinite` }}
        />
      )}
    </g>
  );
}
