import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { Project } from '@shared/schema';
import { PORTFOLIO_TAB_ORDER, type Category } from '@shared/taxonomy';
import { onImageError } from '@/lib/placeholder';
import { useI18n } from '@/lib/i18n';
import { useDocumentTitle } from '@/hooks/use-document-title';

export default function Portfolio() {
  const { t } = useI18n();
  useDocumentTitle("Portfolio");
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Base query: ALL projects — used to decide which category tabs to show.
  const { data: allProjects, isLoading: allLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Display query: hits /api/projects?category=<slug> when a specific tab is active.
  const { data: filteredData, isLoading: filterLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects', 'filter', activeFilter],
    queryFn: async () => {
      const url =
        activeFilter === 'all'
          ? '/api/projects'
          : `/api/projects?category=${activeFilter}`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load projects');
      return res.json();
    },
  });

  const isLoading = allLoading || filterLoading;
  const filteredProjects = filteredData || [];

  // Only surface a category tab if at least one project currently has it.
  // "All" is always shown. No empty tabs.
  const presentCategories = new Set((allProjects || []).map((p) => p.category));
  const visibleTabs: string[] = [
    'all',
    ...PORTFOLIO_TAB_ORDER.filter((c) => presentCategories.has(c)),
  ];

  const tabLabel = (tab: string) =>
    tab === 'all' ? t('common.all') : t(`category.${tab}`);

  if (isLoading) return <PortfolioSkeleton />;

  return (
    <div className="min-h-screen pt-20 bg-slate-950 text-white">

      {/* 1. Minimal Header */}
      <section className="py-20 md:py-24 bg-slate-950/50 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            {t('portfolio.title')}
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-normal">
            {t('portfolio.sub')}
          </p>
        </div>
      </section>

      {/* 2. Filter Tabs */}
      <section className="sticky top-16 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-center">
          <Tabs defaultValue="all" className="w-full max-w-3xl" onValueChange={setActiveFilter}>
            <TabsList className="w-full flex-wrap bg-slate-900 border border-slate-800 rounded-full p-1">
              {visibleTabs.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all flex-1"
                >
                  {tabLabel(tab)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* 3. The Gallery Grid */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">

          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500">{t('portfolio.empty')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {filteredProjects.map((project) => (
                <Link key={project.id} href={`/portfolio/${project.id}`}>
                  <div className="group cursor-pointer flex flex-col gap-4" data-testid={`card-project-${project.id}`}>

                    {/* Image Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-slate-900 aspect-[4/3] shadow-sm border border-slate-800 group-hover:border-orange-500/30 transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 z-10" />
                      <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 z-10 transition-colors duration-500" />

                      {/* Hover Overlay Button */}
                      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                          <ArrowUpRight className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        onError={onImageError}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>

                    {/* Minimal Text Info */}
                    <div className="space-y-1 px-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                          {project.title}
                        </h3>
                        <Badge variant="outline" className="border-slate-800 text-slate-500 text-[10px] uppercase tracking-wider bg-slate-900">
                          {t(`category.${project.category}`)}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">
                        {project.client}
                      </p>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}

const PortfolioSkeleton = () => (
  <div className="min-h-screen pt-32 bg-slate-950 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <div className="h-10 w-64 bg-slate-800 rounded-full mx-auto animate-pulse"></div>
        <div className="h-4 w-96 bg-slate-800 rounded-full mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="space-y-4">
            <div className="w-full aspect-[4/3] bg-slate-900 rounded-2xl animate-pulse"></div>
            <div className="h-6 w-3/4 bg-slate-900 rounded animate-pulse"></div>
            <div className="h-4 w-1/4 bg-slate-900 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
