import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, TrendingUp, Layers, Calendar, ArrowRight, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from '@/lib/i18n';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { onImageError } from '@/lib/placeholder';

export default function ProjectDetail() {
  const [, params] = useRoute("/portfolio/:id");
  const id = params?.id;
  const { isRTL, t } = useI18n();

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  useDocumentTitle(project?.title);

  if (isLoading) return <ProjectSkeleton />;
  if (error || !project) return <div className="min-h-screen pt-32 bg-slate-950 text-white text-center">{t('projectDetail.notFound')}</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20">

      {/* HERO HEADER */}
      <section className="relative py-20 md:py-24 border-b border-slate-800/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <Link href="/portfolio">
            <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-orange-400 text-slate-500 transition-colors">
              <ArrowLeft className="w-4 h-4 me-2" /> {t('projectDetail.back')}
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-end">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="border-orange-500/30 text-orange-400 bg-orange-500/10">
                  {t(`category.${project.category}`)}
                </Badge>
                <span className="text-slate-400 font-medium border-l border-slate-800 pl-4">{project.client}</span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                {project.title}
              </h1>
              <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
                {project.description}
              </p>

              {/* MOBILE ONLY CTA */}
              <div className="block lg:hidden pt-4">
                <Link href="/contact">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold h-12 rounded-full">
                    {t('projectDetail.mobileCta')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {project.results.slice(0, 4).map((result, i) => (
                <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm">
                  <TrendingUp className="w-4 h-4 text-emerald-400 mb-2" />
                  <p className="font-bold text-white text-xs md:text-sm">{result}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN VISUAL */}
      <section className="relative -mt-8 md:-mt-12 z-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
          <img src={project.image} alt={project.title} loading="lazy" decoding="async" onError={onImageError} className="w-full h-auto object-cover max-h-[700px] opacity-90" />
        </div>
      </section>

      {/* CONTENT & SIDEBAR */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12 md:space-y-16">
              <div className="pl-6 border-l-2 border-orange-500">
                <h2 className="text-2xl font-bold text-white mb-4">{t('projectDetail.challenge')}</h2>
                <div className="prose prose-invert text-slate-400"><p>{project.challenge}</p></div>
              </div>
              <div className="pl-6 border-l-2 border-emerald-500">
                <h2 className="text-2xl font-bold text-white mb-4">{t('projectDetail.solution')}</h2>
                <div className="prose prose-invert text-slate-400"><p>{project.solution}</p></div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">{t('projectDetail.techStack')}</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.technologies.map(tech => (
                    <Badge key={tech} variant="secondary" className="bg-slate-800 text-slate-300">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <Link href="/contact">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold h-12 rounded-full">
                    {t('projectDetail.startProject')}
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

const ProjectSkeleton = () => (
  <div className="min-h-screen pt-32 px-6 bg-slate-950 text-white">
    <div className="max-w-7xl mx-auto space-y-8">
      <Skeleton className="h-12 w-3/4 bg-slate-800" />
      <Skeleton className="h-[400px] w-full rounded-2xl bg-slate-800" />
    </div>
  </div>
);