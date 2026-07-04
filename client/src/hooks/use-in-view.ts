import { useEffect, useRef, useState } from "react";

// Lightweight scroll-reveal gate built on the native IntersectionObserver — no
// animation library (Phase 5). Returns a ref + `inView`, latched true the first
// time the element enters the viewport (reveal-once; we then stop observing).
//
// Accessibility / touch:
// - prefers-reduced-motion → `inView` initialises true, so content is shown in
//   its final state on first paint with no observer and no entrance motion.
// - No IntersectionObserver (or no window) → also initialises true (fail-open:
//   content is always visible, never hidden behind a missing API).
// - Scroll-driven, not hover-driven, so it works identically on touch.
export function useInView<T extends Element = HTMLDivElement>(options?: {
  rootMargin?: string;
  threshold?: number;
}): { ref: React.RefObject<T>; inView: boolean } {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    if (!("IntersectionObserver" in window)) return true;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  });

  useEffect(() => {
    if (inView) return; // already revealed (reduced-motion / no-IO / fail-open)
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      {
        rootMargin: options?.rootMargin ?? "0px 0px -12% 0px",
        threshold: options?.threshold ?? 0.15,
      },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}
