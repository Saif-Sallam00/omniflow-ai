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

      {/* 1. HERO: Who we are */}
      <section className="py-20 md:py-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[50%] h-[60%] bg-gradient-to-bl from-orange-950/30 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge
              variant="outline"
              className="mb-6 px-4 py-1 border-orange-500/30 text-orange-400 tracking-widest uppercase text-xs font-semibold bg-orange-500/10"
            >
              Who we are
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
              Engineers who understand{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                business.
              </span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
              OmniflowAI is a digital transformation partner built around one belief:
              most companies don't need more tools — they need the right systems,
              built well and connected properly.
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
              <div className="absolute inset-0 bg-orange-500 rounded-2xl transform rotate-2 translate-x-2 translate-y-2 opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <img
                src={FounderImage}
                alt="Founder of OmniflowAI"
                loading="lazy"
                decoding="async"
                className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/5] grayscale group-hover:grayscale-0 transition-all duration-700 border border-slate-800"
              />
            </div>

            {/* Text Side */}
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                We started OmniflowAI to close a gap.
              </h2>
              <div className="prose prose-lg text-slate-400 space-y-6">
                <p>
                  Too many businesses are sold disconnected pieces — a website here,
                  an ad campaign there, a tool nobody integrates — and left to stitch
                  them together themselves. The result is expensive fragmentation:
                  software that doesn't talk, marketing that doesn't convert, and no
                  clear view of what's working.
                </p>
                <p>
                  We do the opposite. We start from how your business actually
                  operates, then design and build the systems that fit it — software,
                  marketing, and automation that work as one. You own everything we
                  build. No lock-in, no dependency, no black boxes.
                </p>
                <p>
                  We work like engineers, not order-takers: we care about outcomes you
                  can measure, systems that outlast the engagement, and giving you the
                  keys at the end.
                </p>
              </div>

              {/* Founder info — FROZEN */}
              {/* TODO(team-final) */}
              <div className="pt-6 border-t border-slate-800">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-lg font-bold text-white">
                      [TODO(team-final)]
                    </p>
                    <p className="text-orange-400 text-sm">[TODO(team-final)]</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE TEAM GRID — FROZEN */}
      {/* TODO(team-final) */}
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
              name="[TODO(team-final)]"
              role="[TODO(team-final)]"
              bio="[TODO(team-final)]"
            />
            <TeamCard
              image={SoftwareHeadImage}
              name="[TODO(team-final)]"
              role="[TODO(team-final)]"
              bio="[TODO(team-final)]"
            />
            <TeamCard
              image={MarketingImage}
              name="[TODO(team-final)]"
              role="[TODO(team-final)]"
              bio="[TODO(team-final)]"
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
              title="Systems over services"
              desc="We don't sell isolated deliverables. Everything we build is designed to connect and compound."
            />
            <ValueCard
              icon={Target}
              title="You own it"
              desc="Full source code and IP transfer on every build. What you pay for is yours."
            />
            <ValueCard
              icon={Users}
              title="Engineering-led"
              desc="You work directly with the people building your systems, not an account manager relaying messages."
            />
            <ValueCard
              icon={Award}
              title="Measured by outcomes"
              desc="We tie our work to business results — revenue, efficiency, acquisition — not hours logged or assets shipped."
            />
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-24 md:py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl font-display font-bold text-white mb-6">
            Let's map your systems
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            We don't hand over deliverables and walk away. We build systems that
            keep working after we're gone.
          </p>
          <a href="/contact">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-lg px-8 py-6 rounded-full font-bold shadow-lg shadow-orange-900/20"
            >
              Book a strategy call
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
          loading="lazy"
          decoding="async"
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
