import { useState } from "react";
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
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@shared/taxonomy";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";

const SOCIAL_ICONS = { twitter: Twitter, github: Github, linkedin: Linkedin } as const;

export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  // Only render icons for platforms with a real URL configured (all empty by
  // default → no dead "#" links). Fill SOCIAL_LINKS to make them appear.
  const socials = (Object.entries(SOCIAL_LINKS) as [keyof typeof SOCIAL_LINKS, string][])
    .filter(([, url]) => url.trim() !== "");

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-700/5 rounded-full blur-[60px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-12 md:pt-24 pb-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 md:gap-12 mb-12 md:mb-16">

          {/* Column 1: Brand (Full width on mobile) */}
          <div className="col-span-2 md:col-span-1 space-y-4 md:space-y-6 text-center md:text-start">
            <Link href="/">
              <span className="text-2xl font-bold font-display text-white cursor-pointer flex items-center justify-center md:justify-start gap-2">
                OmniflowAI
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              {t("footer.tagline")}
            </p>
            {socials.length > 0 && (
              <div className="flex items-center justify-center md:justify-start gap-4">
                {socials.map(([key, url]) => (
                  <SocialIcon key={key} href={url} icon={SOCIAL_ICONS[key]} />
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Services */}
          <div className="col-span-1">
            <h3 className="font-bold text-white mb-4 md:mb-6 text-xs md:text-base uppercase md:normal-case">{t("footer.services")}</h3>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm">
              <FooterLink href="/services/ai-training">{t("footer.link.aiTraining")}</FooterLink>
              <FooterLink href="/services/digital-marketing">{t("footer.link.digitalMarketing")}</FooterLink>
              <FooterLink href="/services/software">{t("footer.link.software")}</FooterLink>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="col-span-1">
            <h3 className="font-bold text-white mb-4 md:mb-6 text-xs md:text-base uppercase md:normal-case">{t("footer.company")}</h3>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm">
              <FooterLink href="/about">{t("footer.link.about")}</FooterLink>
              <FooterLink href="/portfolio">{t("footer.link.work")}</FooterLink>
              <FooterLink href="/articles">{t("nav.articles")}</FooterLink>
              <FooterLink href="/contact">{t("footer.link.contact")}</FooterLink>
              {/* TODO(legal-final): add real privacy/terms pages before/after launch */}
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div className="col-span-2 md:col-span-1 space-y-4 md:space-y-6">
            <h3 className="font-bold text-white mb-4 md:mb-6 text-xs md:text-base uppercase md:normal-case">
              <span className="md:hidden">{t("footer.connectShort")}</span>
              <span className="hidden md:inline">{t("footer.stayConnected")}</span>
            </h3>

            {/* Newsletter — renders at every width. It is a lead capture
                element; hiding it on mobile lost that traffic entirely. */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
              <p className="text-xs text-slate-400">
                {t("footer.newsletter.text")}
              </p>
              <NewsletterForm />
            </div>

            {/* Contact links — full row at every width, icons included. */}
            <div className="space-y-3 pt-0 md:pt-2">
              <div className="flex items-center gap-3 text-xs md:text-sm text-slate-400">
                <Mail className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span className="break-all">{CONTACT_EMAIL}</span>
              </div>
              <div className="flex items-center gap-3 text-xs md:text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span>{t("footer.location")}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 text-center md:text-start">
          <p>© {currentYear} {t("footer.copyright")}</p>
          {/* TODO(legal-final): add real privacy/terms/sitemap pages, then link them here */}
        </div>
      </div>
    </footer>
  );
}

// Helper Components
function NewsletterForm() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await apiRequest("POST", "/api/subscribe", { email });
      toast({ title: t("footer.toast.subscribed") });
      setEmail("");
    } catch {
      toast({ title: t("footer.toast.error"), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("footer.newsletter.placeholder")}
        className="bg-slate-950 border-slate-800 text-white text-xs h-10 focus-visible:ring-brand-500"
      />
      <Button
        type="submit"
        size="icon"
        disabled={submitting}
        aria-label={t("footer.newsletter.placeholder")}
        className="h-10 w-10 bg-primary text-primary-foreground"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href}>
        <span className="text-slate-400 hover:text-brand-400 transition-colors cursor-pointer flex items-center gap-2 group">
          <ArrowRight className="w-3 h-3 opacity-0 -ms-5 group-hover:opacity-100 group-hover:ms-0 transition-all duration-300 hidden md:block" />
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
      className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-500 hover:text-slate-900 transition-all duration-300"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}
