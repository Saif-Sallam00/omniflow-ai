import { Link } from "wouter";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  MapPin, 
  ArrowRight,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-12 md:pt-24 pb-10 relative z-10">
        {/* MOBILE: grid-cols-3 (Brand spans 3, others span 1)
          TABLET: grid-cols-2 (2x2 layout)
          DESKTOP: grid-cols-4 (1x1x1x1 layout)
        */}
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 md:gap-12 mb-12 md:mb-16">

          {/* Column 1: Brand (Full width on mobile) */}
          <div className="col-span-3 md:col-span-1 space-y-4 md:space-y-6 text-center md:text-left">
            <Link href="/">
              <span className="text-2xl font-bold font-display text-white cursor-pointer flex items-center justify-center md:justify-start gap-2">
                OmniflowAI
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              We build digital ecosystems that scale. Bridging the gap between premium design and intelligent automation.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <SocialIcon href="#" icon={Twitter} />
              <SocialIcon href="#" icon={Github} />
              <SocialIcon href="#" icon={Linkedin} />
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="col-span-1">
            <h3 className="font-bold text-white mb-4 md:mb-6 text-xs md:text-base uppercase md:normal-case">Services</h3>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm">
              <FooterLink href="/services">Web Dev</FooterLink>
              <FooterLink href="/services">Automation</FooterLink>
              <FooterLink href="/services">AI Agents</FooterLink>
              <FooterLink href="/services">Marketing</FooterLink>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="col-span-1">
            <h3 className="font-bold text-white mb-4 md:mb-6 text-xs md:text-base uppercase md:normal-case">Company</h3>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/portfolio">Work</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/privacy">Privacy</FooterLink>
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div className="col-span-1 space-y-4 md:space-y-6">
            <h3 className="font-bold text-white mb-4 md:mb-6 text-xs md:text-base uppercase md:normal-case">
              <span className="md:hidden">Connect</span>
              <span className="hidden md:inline">Stay Connected</span>
            </h3>

            {/* Newsletter - Hidden on mobile to save space */}
            <div className="hidden md:block bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4">
              <p className="text-xs text-slate-400">
                Get the latest trends in AI and Web Dev delivered to your inbox.
              </p>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter your email" 
                  className="bg-slate-950 border-slate-800 text-white text-xs h-10 focus-visible:ring-amber-500" 
                />
                <Button size="icon" className="h-10 w-10 bg-amber-500 hover:bg-amber-600 text-slate-900">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Contact Links - Simplified for mobile */}
            <div className="space-y-3 pt-0 md:pt-2">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 text-xs md:text-sm text-slate-400">
                <Mail className="w-4 h-4 text-amber-500 hidden md:block" />
                <span className="break-all">hello@omniflow.ai</span>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 text-xs md:text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-amber-500 hidden md:block" />
                <span>Cairo, Egypt</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 text-center md:text-left">
          <p>© {currentYear} OmniflowAI Agency. All rights reserved.</p>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper Components
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href}>
        <span className="text-slate-400 hover:text-amber-500 transition-colors cursor-pointer flex items-center gap-2 group">
          <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 hidden md:block" />
          {children}
        </span>
      </Link>
    </li>
  );
}

function SocialIcon({ href, icon: Icon }: { href: string; icon: any }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-slate-900 transition-all duration-300 hover:scale-110"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}