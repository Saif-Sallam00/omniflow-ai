import { type ReactNode } from "react";

// =============================================================================
// Hexagon line-art marks — the page-level iconography for the Solutions page
// and the three capability pages (spec §12.6: stroke only, no fill, no icon
// library, and nothing else on the page carries an icon).
//
// Extracted from Services.tsx so /services and /services/<pillar> mark the same
// three capabilities with the same glyph instead of drifting apart.
// =============================================================================

export type HexGlyphName =
  | "foundation"
  | "growth-engine"
  | "scale-infrastructure"
  | "marketing"
  | "tech"
  | "ai";

const MARKS: Record<HexGlyphName, ReactNode> = {
  // Foundation — a magnifier: diagnosis, not implementation.
  foundation: (
    <>
      <circle cx="17" cy="19" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M20.5 22.5 L25 27" stroke="currentColor" strokeWidth="1.4" />
    </>
  ),
  // Growth Engine — a rising line.
  "growth-engine": (
    <>
      <path d="M9 24 L15 17 L20 21 L26 13" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="26" cy="13" r="2" fill="currentColor" />
    </>
  ),
  // Scale Infrastructure — stacked connected layers.
  "scale-infrastructure": (
    <>
      <path d="M10 15 h14 M10 19 h14 M10 23 h14" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="10" cy="15" r="1.6" fill="currentColor" />
      <circle cx="24" cy="23" r="1.6" fill="currentColor" />
    </>
  ),
  marketing: <path d="M11 22 l5 -6 4 4 5 -7" stroke="currentColor" strokeWidth="1.5" />,
  tech: (
    <>
      <rect x="11" y="14" width="12" height="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 18 h12" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  ai: (
    <>
      <circle cx="17" cy="19" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 11 v3 M17 24 v3 M9 19 h3 M22 19 h3" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
};

export interface HexGlyphProps {
  glyph: HexGlyphName;
  size?: number;
  className?: string;
}

export function HexGlyph({ glyph, size = 34, className = "text-primary" }: HexGlyphProps) {
  return (
    <svg
      width={size}
      height={Math.round((size * 38) / 34)}
      viewBox="0 0 34 38"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M17 2 L31 10 v18 L17 36 L3 28 V10 z" stroke="currentColor" strokeWidth="1.4" />
      {MARKS[glyph]}
    </svg>
  );
}
