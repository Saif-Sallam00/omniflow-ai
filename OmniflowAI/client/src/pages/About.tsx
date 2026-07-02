import { Shield, Users, Target, Award, Linkedin, Mail, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import FounderImage from "@/assets/team_images/founder.jpeg";
import DesignHeadImage from "@/assets/team_images/headofdesign.jpeg";
import SoftwareHeadImage from "@/assets/team_images/headofsoftware.jpeg";
import MarketingImage from "@/assets/team_images/headofmarketing.jpeg";

export default function About() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen pt-20 bg-slate-950 text-white">

      {/* 1. HERO: The Human Mission */}
      <section className="py-20 md:py-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[50%] h-[60%] bg-gradient-to-bl from-orange-950/30 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge
              variant="outline"
              className="mb-6 px-4 py-1 border-orange-500/30 text-orange-400 tracking-widest uppercase text-xs font-semibold bg-orange-500/10"
            >
              Our DNA
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
              We are engineers who speak{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                Business.
              </span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
              OmniflowAI wasn't founded by salespeople. It was founded by senior
              developers tired of seeing businesses overpay for "pretty" websites
              that break under pressure.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FOUNDER STORY (The "Why") */}
      <section className="py-20 md:py-24 bg-slate-900/30 border-y border-slate-800/30">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <div className="relative group">
              <div className="absolute inset-0 bg-orange-500 rounded-2xl transform rotate-2 translate-x-2 translate-y-2 opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <img
                src={FounderImage}
                alt="Founder of OmniflowAI"
                className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/5] grayscale group-hover:grayscale-0 transition-all duration-700 border border-slate-800"
              />
            </div>

            {/* Text Side */}
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                "I built this to fix the agency model."
              </h2>
              <div className="prose prose-lg text-slate-400 space-y-6">
                <p>
                  For 20 years, I worked in enterprise software. I saw a massive
                  gap: Small and mid-sized businesses were getting trapped.
                  Agencies would sell them a "custom site" that was really just
                  a cheap template, or worse, hold their code hostage with
                  monthly fees.
                </p>
                <p>
                  I started OmniflowAI with one rule:{" "}
                  <strong className="text-white">Transparency.</strong>
                </p>
                <p>
                  We don't hide behind jargon. We build robust, scalable systems
                  using the same technology used by tech giants—and then we hand
                  you the keys. No lock-in. No secrets. Just engineering
                  excellence that drives your bottom line.
                </p>
              </div>

              {/* Founder info */}
              <div className="pt-6 border-t border-slate-800">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-lg font-bold text-white">
                      Mosatafa Hekal
                    </p>
                    <p className="text-orange-400 text-sm">Founder & Technical Lead</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE TEAM GRID */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
              Meet the Builders
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              No outsourcing. No juniors learning on your dime. Just senior
              talent dedicated to your growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TeamCard
              image={DesignHeadImage}
              name="Roaa Mohamed"
              role="Head of Design"
              bio="Ex-Shopify designer obsessed with conversion rates and user psychology."
            />
            <TeamCard
              image={SoftwareHeadImage}
              name="Saif Sallam"
              role="Lead Systems Architect"
              bio="Specialist in ERPNext and high-scale database automation."
            />
            <TeamCard
              image={MarketingImage}
              name="Faris Sallam"
              role="Growth Strategist"
              bio="Direct-response marketer who turns traffic into qualified B2B leads."
            />
          </div>
        </div>
      </section>

      {/* 4. VALUES */}
      <section className="py-20 md:py-24 bg-slate-900/30 border-y border-slate-800/30">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueCard
              icon={Shield}
              title="Code Ownership"
              desc="You pay for it, you own it. We transfer full IP and source code upon completion."
            />
            <ValueCard
              icon={Target}
              title="Revenue First"
              desc="We don't care about 'likes.' We care about leads, sales, and automation ROI."
            />
            <ValueCard
              icon={Users}
              title="Direct Access"
              desc="You talk to the engineers building your product, not an account manager."
            />
            <ValueCard
              icon={Award}
              title="Zero Bloat"
              desc="We use lean, modern tech stacks. No heavy plugins. No slow loading times."
            />
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-24 md:py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl font-display font-bold text-white mb-6">
            Ready to work with adults?
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Stop gambling on freelancers and templates. Partner with a team that
            builds assets, not liabilities.
          </p>
          <a href="/contact">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-lg px-8 py-6 rounded-full font-bold shadow-lg shadow-orange-900/20"
            >
              Book a Strategy Call
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function TeamCard({
  image,
  name,
  role,
  bio,
}: {
  image: string;
  name: string;
  role: string;
  bio: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-orange-500/30 transition-all duration-300">
      <div className="aspect-[4/3] overflow-hidden bg-slate-800">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p className="text-orange-400 text-sm font-medium mb-4">{role}</p>
        <p className="text-slate-400 text-sm leading-relaxed">{bio}</p>
        <div className="mt-6 flex gap-4 opacity-50 group-hover:opacity-100 transition-opacity">
          <Linkedin className="w-5 h-5 text-slate-300 cursor-pointer hover:text-orange-400 transition-colors" />
          <Mail className="w-5 h-5 text-slate-300 cursor-pointer hover:text-orange-400 transition-colors" />
        </div>
      </div>
    </div>
  );
}

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
    <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:bg-slate-900/60 hover:border-slate-700 transition-all duration-300">
      <div className="w-12 h-12 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}