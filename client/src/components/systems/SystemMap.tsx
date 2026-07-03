import { type LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { FlowLine } from "./FlowLine";
import { hexPath, MAP_W, MAP_H, type SystemNode, type SystemEdge } from "./primitives";

export interface SystemMapNode extends SystemNode {
  icon?: LucideIcon;
}

export interface SystemMapProps {
  nodes: SystemMapNode[];
  edges?: SystemEdge[];
  /** Required — the whole diagram is exposed as one image to AT. Use i18n copy. */
  ariaLabel: string;
  /** Allow ambient edge pulses (still capped, still reduced-motion gated). */
  animated?: boolean;
  /** Mirror the diagram horizontally under RTL (labels stay upright). */
  mirrorOnRTL?: boolean;
  width?: number;
  height?: number;
  nodeSize?: number;
  className?: string;
}

/**
 * Composes hexagon nodes + flow lines into a small architecture diagram
 * (hub-and-spoke / pipeline / mesh via the layout presets in primitives.ts).
 * The one place RTL mirroring lives: every x is passed through `mx()`, so nodes,
 * edges and centered labels mirror together while text stays legible.
 *
 * No fake data: node labels must come from real sources (taxonomy / i18n).
 */
export function SystemMap({
  nodes,
  edges = [],
  ariaLabel,
  animated = true,
  mirrorOnRTL = true,
  width = MAP_W,
  height = MAP_H,
  nodeSize = 34,
  className = "",
}: SystemMapProps) {
  const { isRTL } = useI18n();
  const mirror = mirrorOnRTL && isRTL;
  const mx = (x: number) => (mirror ? width - x : x);
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const r = nodeSize / 2;

  // Ration ambient motion to at most 2 concurrent pulses.
  let pulses = 0;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full h-auto ${className}`}
      role="img"
      aria-label={ariaLabel}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* edges under nodes */}
      {edges.map((e, i) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        if (!a || !b) return null;
        const doPulse = animated && !!e.pulse && pulses < 2;
        if (doPulse) pulses++;
        return (
          <FlowLine
            key={`edge-${i}`}
            from={{ x: mx(a.x), y: a.y }}
            to={{ x: mx(b.x), y: b.y }}
            variant={e.variant ?? "curve"}
            accent={!!(a.accent || b.accent)}
            pulse={doPulse}
          />
        );
      })}

      {/* nodes */}
      {nodes.map((n) => {
        const cx = mx(n.x);
        const cy = n.y;
        const accent = !!n.accent;
        const Icon = n.icon;
        const fillOpacity = n.variant === "solid" ? 0.12 : n.variant === "ghost" ? 0.06 : 0;
        return (
          <g key={n.id} aria-hidden="true" className={accent ? "text-brand-500" : "text-slate-600"}>
            <path
              d={hexPath(cx, cy, r, "flat")}
              fill="currentColor"
              fillOpacity={fillOpacity}
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
            {Icon && (
              <Icon
                x={cx - r * 0.5}
                y={cy - r * 0.5}
                width={r}
                height={r}
                className={accent ? "text-brand-400" : "text-slate-300"}
              />
            )}
            {n.label && (
              <text
                x={cx}
                y={cy + r + 12}
                textAnchor="middle"
                className={accent ? "fill-brand-400" : "fill-slate-400"}
                style={{ fontSize: 10, fontWeight: 500 }}
              >
                {n.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
