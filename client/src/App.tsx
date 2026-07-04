import { useEffect, lazy, Suspense } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { initGA } from "@/lib/analytics";
import { useAnalytics } from "@/hooks/use-analytics";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useI18n } from "@/lib/i18n";
import { MessageCircle, Loader2 } from 'lucide-react';

// Pages — route-based code-splitting (React.lazy) so each page ships in its own
// chunk instead of one large main bundle.
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const ServiceDetail = lazy(() => import("@/pages/ServiceDetail"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/not-found"));
const AuthPage = lazy(() => import("@/pages/admin/Auth"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Leads = lazy(() => import("@/pages/admin/Leads"));

// Lightweight fallback shown while a route chunk loads.
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
    </div>
  );
}

// Helper to scroll to top on route change
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

// Router Component
function Router() {
  const { t } = useI18n();
  // Safe Analytics Hook
  try {
    useAnalytics();
  } catch (e) {
    console.warn("Analytics failed to load:", e);
  }

  return (
    <>
      <ScrollToTop />
      <Navigation />
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
        <Switch>
          {/* Public Routes */}
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />

          {/* Legacy service-slug redirects (Layer 1 structural migration).
              Old slugs now fold into the three pillars so no link dies. */}
          <Route path="/services/website-development">
            {() => <Redirect to="/services/software" />}
          </Route>
          <Route path="/services/automation">
            {() => <Redirect to="/services/software" />}
          </Route>
          <Route path="/services/ai-agents">
            {() => <Redirect to="/services/software" />}
          </Route>

          <Route path="/services/:slug" component={ServiceDetail} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/portfolio/:id" component={ProjectDetail} />
          <Route path="/contact" component={Contact} />

          {/* Admin Routes */}
          <Route path="/admin/auth" component={AuthPage} />
          <ProtectedRoute path="/admin/dashboard" component={Dashboard} />
          <ProtectedRoute path="/admin/leads" component={Leads} />

          {/* Fallback */}
          <Route component={NotFound} />
        </Switch>
        </Suspense>
      </main>
      <Footer />

      {/* Floating WhatsApp CTA */}
      <a 
        href="https://wa.me/201092849400" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 group"
      >
        <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75 group-hover:opacity-100"></div>
        <div className="relative bg-primary text-primary-foreground p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2">
          <MessageCircle className="w-8 h-8" />
          <span className="hidden group-hover:block font-bold pr-2 whitespace-nowrap transition-all">
            {t("whatsapp.chat")}
          </span>
        </div>
      </a>
    </>
  );
}

// Main App Component
function App() {
  useEffect(() => {
    // Initialize GA safely
    try {
      if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
        initGA();
      }
    } catch (e) {
      console.warn("GA Init Failed:", e);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen bg-slate-950">
            <Router />
          </div>
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;