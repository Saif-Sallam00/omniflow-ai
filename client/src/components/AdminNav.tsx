import { Link } from "wouter";

// Admin CMS tab bar. Extracted from Leads.tsx when Articles became the third
// admin page: Dashboard and Articles had each grown their own inline copy, so
// adding a page meant editing three places — and the Articles tab was missed in
// two of them. One list, one place.
//
// Admin pages are intentionally English-only (internal tooling), so these
// labels are not in the i18n dictionary.

const TABS = [
  { id: "portfolio", href: "/admin/dashboard", label: "Portfolio" },
  { id: "articles", href: "/admin/articles", label: "Articles" },
  { id: "leads", href: "/admin/leads", label: "Leads" },
] as const;

export type AdminTab = (typeof TABS)[number]["id"];

export function AdminNav({ active }: { active: AdminTab }) {
  return (
    <nav className="ml-4 hidden items-center gap-1 sm:flex">
      {TABS.map((tab) => (
        <Link key={tab.id} href={tab.href}>
          <span
            className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium ${
              active === tab.id ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
