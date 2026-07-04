import { useEffect, useState } from "react";

// JS gate for motion decisions in the connected-systems visuals. Complements the
// global `@media (prefers-reduced-motion: reduce)` block in index.css: that zeroes
// any stray animation; this lets components avoid *mounting* infinite animations
// at all. Defaults to `true` (no motion) until measured, so motion-sensitive users
// never see a flash of animation on first paint.
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
