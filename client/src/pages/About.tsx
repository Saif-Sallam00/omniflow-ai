import { Shield, Users, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { useDocumentTitle } from "@/hooks/use-document-title";
import TeamImage from "@/assets/team_images/omniflowai-team.webp";

export default function About() {
  const { t } = useI18n();
  useDocumentTitle("About");

  return (
    <div className="min-h-screen pt-20 bg-slate-950 text-white">

      {/* 1. HERO: Who we are */}
      <section className="py-20 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[60%] bg-gradient-to-bl from-orange-950/30 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge
              variant="outline"
              className="mb-6 px-4 py-1 border-brand-500/30 text-brand-400 tracking-widest uppercase text-xs font-semibold bg-brand-500/10"
            >
              {t("about.badge")}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
              {t("about.headline.lead")}{" "}
              <span className="text-brand-400">
                {t("about.headline.highlight")}
              </span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
              {t("about.sub")}
            </p>
          </div>
        </div>
      </section>

      {/* 2. STORY (company narrative) — founder attribution FROZEN */}
      <section className="py-20 md:py-24 bg-slate-900/30 border-y border-slate-800/30">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <div className="relative group">
              <div className="absolute inset-0 bg-brand-500 rounded-xl transform rotate-2 translate-x-2 translate-y-2 opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <img
                src={TeamImage}
                alt="The OmniflowAI team"
                loading="lazy"
                decoding="async"
                className="relative rounded-xl shadow-elevated w-full object-cover aspect-video grayscale group-hover:grayscale-0 transition-all duration-700 border border-slate-800"
              />
            </div>

            {/* Text Side */}
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                {t("about.story.heading")}
              </h2>
              <div className="prose prose-lg text-slate-400 space-y-6">
                <p>{t("about.story.p1")}</p>
                <p>{t("about.story.p2")}</p>
                <p>{t("about.story.p3")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VALUES */}
      <section className="py-20 md:py-24 bg-slate-900/30 border-y border-slate-800/30">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueCard icon={Shield} title={t("about.values.1.title")} desc={t("about.values.1.desc")} />
            <ValueCard icon={Target} title={t("about.values.2.title")} desc={t("about.values.2.desc")} />
            <ValueCard icon={Users} title={t("about.values.3.title")} desc={t("about.values.3.desc")} />
            <ValueCard icon={Award} title={t("about.values.4.title")} desc={t("about.values.4.desc")} />
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-24 md:py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl font-display font-bold text-white mb-6">
            {t("about.cta.title")}
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            {t("common.brandLine")}
          </p>
          <a href="/contact">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground text-lg px-8 py-6 rounded-full font-bold shadow-sm"
            >
              {t("common.cta.bookCall")}
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function ValueCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:bg-slate-900/60 hover:border-slate-700 transition-all duration-300 shadow-card">
      <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
