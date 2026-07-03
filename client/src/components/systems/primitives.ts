// =============================================================================
// Connected-systems visual language — shared geometry + types (no React).
// All SVG math lives here so components stay declarative. "Ember on gunmetal":
// flat-top hexagon nodes + thin flow lines, coordinates in a fixed viewBox.
// =============================================================================

export type Point = { x: number; y: number };
export type HexOrientation = "flat" | "pointy";

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * SVG path string for a regular hexagon centered at (cx,cy) with circumradius r.
 * Flat-top by default (a horizontal edge top & bottom; vertices left & right) —
 * the calmer, more "enterprise" orientation.
 */
export function hexPath(cx: number, cy: number, r: number, orientation: HexOrientation = "flat"): string {
  const base = orientation === "flat" ? 0 : 30;
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (base + 60 * i);
    pts.push(`${round(cx + r * Math.cos(a))},${round(cy + r * Math.sin(a))}`);
  }
  return `M${pts.join("L")}Z`;
}

/** Connector path between two points. */
export type EdgeVariant = "straight" | "elbow" | "curve";

export function edgePath(a: Point, b: Point, variant: EdgeVariant = "curve"): string {
  if (variant === "straight") return `M${round(a.x)},${round(a.y)}L${round(b.x)},${round(b.y)}`;
  if (variant === "elbow") {
    const mid = round((a.x + b.x) / 2);
    return `M${round(a.x)},${round(a.y)}L${mid},${round(a.y)}L${mid},${round(b.y)}L${round(b.x)},${round(b.y)}`;
  }
  // curve: a gentle quadratic bowed perpendicular to the a→b line, for organic flow.
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const off = Math.min(len * 0.18, 24);
  const nx = -dy / len;
  const ny = dx / len;
  const qx = round((a.x + b.x) / 2 + nx * off);
  const qy = round((a.y + b.y) / 2 + ny * off);
  return `M${round(a.x)},${round(a.y)}Q${qx},${qy} ${round(b.x)},${round(b.y)}`;
}

// --- Node / edge model consumed by SystemMap ---------------------------------

export type NodeVariant = "solid" | "outline" | "ghost";

export type SystemNode = {
  id: string;
  x: number;
  y: number;
  variant?: NodeVariant;
  /** Real label only (taxonomy / i18n) — never an invented string or metric. */
  label?: string;
  accent?: boolean;
};

export type SystemEdge = {
  from: string;
  to: string;
  variant?: EdgeVariant;
  pulse?: boolean;
};

// --- Default coordinate space + layout presets -------------------------------

export const MAP_W = 320;
export const MAP_H = 200;

type LayoutOpts = { w?: number; h?: number; radius?: number; pad?: number };

/** Hub-and-spoke: one accented center node, spokes evenly on a ring around it. */
export function hub(centerId: string, spokeIds: string[], opts: LayoutOpts = {}): SystemNode[] {
  const w = opts.w ?? MAP_W;
  const h = opts.h ?? MAP_H;
  const R = opts.radius ?? Math.min(w, h) * 0.34;
  const cx = w / 2;
  const cy = h / 2;
  const nodes: SystemNode[] = [{ id: centerId, x: cx, y: cy, variant: "solid", accent: true }];
  const n = spokeIds.length || 1;
  spokeIds.forEach((id, i) => {
    const a = (Math.PI / 180) * (-90 + (360 / n) * i);
    nodes.push({ id, x: round(cx + R * Math.cos(a)), y: round(cy + R * Math.sin(a)), variant: "outline" });
  });
  return nodes;
}

/** Horizontal pipeline: evenly spaced nodes on the center line. */
export function pipeline(ids: string[], opts: LayoutOpts = {}): SystemNode[] {
  const w = opts.w ?? MAP_W;
  const h = opts.h ?? MAP_H;
  const pad = opts.pad ?? w * 0.14;
  const n = ids.length;
  const span = w - pad * 2;
  return ids.map((id, i) => ({
    id,
    x: round(n === 1 ? w / 2 : pad + (span / (n - 1)) * i),
    y: h / 2,
    variant: "outline" as NodeVariant,
  }));
}

/** Ring/mesh: nodes evenly on a circle (no center). */
export function ring(ids: string[], opts: LayoutOpts = {}): SystemNode[] {
  const w = opts.w ?? MAP_W;
  const h = opts.h ?? MAP_H;
  const R = opts.radius ?? Math.min(w, h) * 0.36;
  const cx = w / 2;
  const cy = h / 2;
  const n = ids.length || 1;
  return ids.map((id, i) => {
    const a = (Math.PI / 180) * (-90 + (360 / n) * i);
    return { id, x: round(cx + R * Math.cos(a)), y: round(cy + R * Math.sin(a)), variant: "outline" as NodeVariant };
  });
}

export const layouts = { hub, pipeline, ring };

/** Default edges: every spoke → center (first optionally pulses). */
export function hubEdges(centerId: string, spokeIds: string[], pulseFirst = true): SystemEdge[] {
  return spokeIds.map((id, i) => ({ from: id, to: centerId, variant: "curve", pulse: pulseFirst && i === 0 }));
}

/** Default edges: consecutive nodes in a pipeline (first optionally pulses). */
export function pipelineEdges(ids: string[], pulseFirst = true): SystemEdge[] {
  const edges: SystemEdge[] = [];
  for (let i = 0; i < ids.length - 1; i++) {
    edges.push({ from: ids[i], to: ids[i + 1], variant: "curve", pulse: pulseFirst && i === 0 });
  }
  return edges;
}
