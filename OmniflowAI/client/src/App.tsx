import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
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
import { MessageCircle } from 'lucide-react';

// Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Portfolio from "@/pages/Portfolio";
import ProjectDetail from "@/pages/ProjectDetail";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/admin/Auth";
import Dashboard from "@/pages/admin/Dashboard";

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
        <Switch>
          {/* Public Routes */}
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          <Route path="/services/:slug" component={ServiceDetail} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/portfolio/:id" component={ProjectDetail} />
          <Route path="/contact" component={Contact} />

          {/* Admin Routes */}
          <Route path="/admin/auth" component={AuthPage} />
          <ProtectedRoute path="/admin/dashboard" component={Dashboard} />

          {/* Fallback */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />

      {/* Floating WhatsApp CTA */}
      <a 
        href="https://wa.me/201092849400" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 group"
      >
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75 group-hover:opacity-100"></div>
        <div className="relative bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2">
          <MessageCircle className="w-8 h-8" />
          <span className="hidden group-hover:block font-bold pr-2 whitespace-nowrap transition-all">
            Chat on WhatsApp
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