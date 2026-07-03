import { type ReactNode } from "react";
import { onImageError } from "@/lib/placeholder";

export interface ProductFrameProps {
  /** Real image only. `alt` is required when set. */
  src?: string;
  alt?: string;
  /** Alternative to `src` — a real embed/child. */
  children?: ReactNode;
  /** minimal = clean frame (chrome bar only if a label is given). */
  chrome?: "minimal" | "dots" | "none";
  /** Real chrome caption (project / client name) — never invented. */
  label?: string;
  /** CSS aspect-ratio, e.g. "16 / 10". */
  aspect?: string;
  /** Shown when there is no real media — a neutral placeholder, never fake UI. */
  emptyState?: ReactNode;
  className?: string;
}

/**
 * A minimal "app window" chrome around REAL product/portfolio media so
 * screenshots read as intentional product shots. Frames real content only — if
 * none is supplied it renders a neutral empty state, never a fabricated
 * dashboard, chart, or metric. Pure CSS + one lazy image; RTL-safe (logical
 * spacing, content not mirrored).
 */
export function ProductFrame({
  src,
  alt,
  children,
  chrome = "minimal",
  label,
  aspect = "16 / 10",
  emptyState,
  className = "",
}: ProductFrameProps) {
  const hasContent = !!src || !!children;
  const showBar = chrome === "dots" || (chrome === "minimal" && !!label);

  return (
    <div className={`overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-elevated ${className}`}>
      {showBar && (
        <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-950/60 px-4 py-2.5">
          {chrome === "dots" && (
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-slate-700" />
              <span className="h-2 w-2 rounded-full bg-slate-700" />
              <span className="h-2 w-2 rounded-full bg-slate-700" />
            </div>
          )}
          {label && <span className="ms-1 truncate text-xs font-medium text-slate-400">{label}</span>}
        </div>
      )}

      <div className="relative bg-slate-950" style={{ aspectRatio: aspect }}>
        {hasContent ? (
          src ? (
            <img
              src={src}
              alt={alt ?? ""}
              loading="lazy"
              decoding="async"
              onError={onImageError}
              className="h-full w-full object-cover"
            />
          ) : (
            children
          )
        ) : (
          emptyState ?? <div className="h-full w-full animate-pulse bg-slate-900" />
        )}
      </div>
    </div>
  );
}
