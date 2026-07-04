import { useId } from "react";
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

// Split a real label into at most two lines at the space nearest the middle, so
// long capability labels never clip in a dense radial diagram.
function wrapLabel(label: string, maxChars: number): string[] {
  if (label.length <= maxChars) return [label];
  const words = label.split(" ");
  if (words.length < 2) return [label];
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const left = words.slice(0, i).join(" ").length;
    const right = words.slice(i).join(" ").length;
    const diff = Math.abs(left - right);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
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
  const baseR = nodeSize / 2;
  const glowId = `hub-glow-${useId().replace(/:/g, "")}`;

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
      <defs>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--brand-500))", stopOpacity: 0.3 }} />
          <stop offset="65%" style={{ stopColor: "hsl(var(--brand-500))", stopOpacity: 0.07 }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--brand-500))", stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      {/* edges under nodes (faint background lines drawn first, for depth) */}
      {[...edges]
        .sort((a, b) => Number(!!b.faint) - Number(!!a.faint))
        .map((e, i) => {
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
              accent={!!e.accent}
              faint={!!e.faint}
              pulse={doPulse}
            />
          );
        })}

      {/* nodes */}
      {nodes.map((n) => {
        const cx = mx(n.x);
        const cy = n.y;
        const scale = n.scale ?? 1;
        const r = baseR * scale;
        const accent = !!n.accent;
        const small = scale < 0.8;
        const Icon = n.icon;
        const fillOpacity = n.variant === "solid" ? 0.14 : n.variant === "ghost" ? 0.06 : 0;
        const nodeColor = accent ? "text-brand-500" : small ? "text-slate-700" : "text-slate-600";

        // Radial label: placed outward from the map centre so labels fan away from
        // the hub (never inward). Long real labels wrap to a second line.
        const font = Math.round(nodeSize * (small ? 0.26 : 0.34));
        const dxr = cx - width / 2;
        const dyr = cy - height / 2;
        const len = Math.hypot(dxr, dyr) || 1;
        const gap = r + font * 0.5 + 5;
        const lx = cx + (dxr / len) * gap;
        const ly = cy + (dyr / len) * gap;
        const anchor = dxr / len > 0.25 ? "start" : dxr / len < -0.25 ? "end" : "middle";
        const lines = n.label ? wrapLabel(n.label, small ? 14 : 12) : [];
        const lineH = font * 1.15;
        const firstDy = -((lines.length - 1) / 2) * lineH + font * 0.32;

        return (
          <g key={n.id} aria-hidden="true" className={nodeColor}>
            {n.halo && <circle cx={cx} cy={cy} r={r * 2.4} fill={`url(#${glowId})`} />}
            <path
              d={hexPath(cx, cy, r, "flat")}
              fill="currentColor"
              fillOpacity={fillOpacity}
              stroke="currentColor"
              strokeWidth={accent ? 2 : 1.5}
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
                x={lx}
                y={ly}
                textAnchor={anchor}
                className={accent ? "fill-brand-400" : small ? "fill-slate-500" : "fill-slate-400"}
                style={{ fontSize: font, fontWeight: 500 }}
              >
                {lines.map((ln, i) => (
                  <tspan key={i} x={lx} dy={i === 0 ? firstDy : lineH}>
                    {ln}
                  </tspan>
                ))}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
