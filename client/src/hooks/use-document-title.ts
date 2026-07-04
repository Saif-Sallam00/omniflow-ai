import { useEffect } from "react";

// Per-route browser-tab titles without a head-management library (react-helmet
// etc.). Pass a short page name → "<name> — OmniflowAI"; pass nothing for the
// site-wide default. Tab titles are English by design (see index.html <title>).
// Restores the default on unmount so a route without a title never leaks the
// previous page's title.
const SITE_TITLE = "OmniflowAI — Your Digital Transformation Partner";

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — OmniflowAI` : SITE_TITLE;
    return () => {
      document.title = SITE_TITLE;
    };
  }, [title]);
}
