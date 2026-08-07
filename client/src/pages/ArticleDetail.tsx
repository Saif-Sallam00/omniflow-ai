import { useMemo } from 'react';
import { Link, useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { type Article, type Project } from '@shared/schema';
import { useI18n } from '@/lib/i18n';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { onImageError } from '@/lib/placeholder';
import { formatArticleDate } from '@/lib/article-date';

// =============================================================================
// ARTICLE PAGE — /articles/:slug
//
// Body is Markdown rendered through @tailwindcss/typography (`prose`), which
// was already a dependency. Only two things are customised: links, so internal
// ones route through wouter instead of reloading the SPA, and YouTube URLs,
// which become embeds.
//
// NOTE ON SEO: the <title> and meta/og tags for this route are written by the
// SERVER (server/index-prod.ts) because social crawlers do not run JavaScript.
// useDocumentTitle below only keeps the browser tab correct during client-side
// navigation — it is not what LinkedIn or Google read first.
// =============================================================================

const YOUTUBE = /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;

/** The end-of-article funnel hop, chosen per article in the admin. */
const SOLUTION_NAME_KEY: Record<string, string> = {
  foundation: 'solutions.foundation.name',
  'growth-engine': 'solutions.growth.name',
  'scale-infrastructure': 'solutions.scale.name',
  custom: 'solutions.custom.name',
};

export default function ArticleDetail() {
  const [, params] = useRoute('/articles/:slug');
  const { t, language } = useI18n();
  const slug = params?.slug || '';

  const { data: article, isLoading, isError } = useQuery<Article>({
    queryKey: ['/api/articles', slug],
    enabled: Boolean(slug),
  });

  useDocumentTitle(article?.title);

  // Only fetched when the article points at one. The list is already cached by
  // the portfolio pages, so this is usually free.
  const { data: projects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    enabled: Boolean(article?.relatedProjectId),
  });
  const relatedProject = projects?.find((p) => p.id === article?.relatedProjectId);

  const components = useMemo(
    () => ({
      a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
        const url = href || '';
        // Internal links go through wouter so the SPA doesn't full-reload —
        // this is the article → article → solutions → portfolio path.
        if (url.startsWith('/')) {
          return (
            <Link href={url}>
              <span className="cursor-pointer text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary">
                {children}
              </span>
            </Link>
          );
        }
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
          >
            {children}
          </a>
        );
      },
      img: ({ src, alt }: { src?: string; alt?: string }) => (
        <img
          src={src}
          alt={alt || ''}
          loading="lazy"
          decoding="async"
          onError={onImageError}
          className="w-full rounded-xl border border-slate-800"
        />
      ),
      // A YouTube link alone in a paragraph becomes an embed; anything else in
      // the paragraph is left as ordinary prose with a link in it.
      p: ({ children }: { children?: React.ReactNode }) => {
        const only = Array.isArray(children) ? children.filter((c) => c !== '\n') : [children];
        if (only.length === 1) {
          const node = only[0] as { props?: { href?: string; children?: unknown } };
          const href = node?.props?.href;
          const id = typeof href === 'string' ? YOUTUBE.exec(href)?.[1] : undefined;
          if (id) {
            return (
              <span className="not-prose my-6 block aspect-video w-full overflow-hidden rounded-xl border border-slate-800">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${id}`}
                  title="YouTube video"
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </span>
            );
          }
        }
        return <p>{children}</p>;
      },
    }),
    [],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20">
        <div className="mx-auto max-w-3xl px-6 py-20 md:px-8">
          <p className="text-sm text-slate-400">{t('articles.loading')}</p>
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 pt-20">
        <div className="px-6 text-center">
          <h1 className="mb-4 font-display text-3xl font-bold text-white">
            {t('articles.notFound.title')}
          </h1>
          <Link href="/articles">
            <span className="inline-block cursor-pointer rounded-lg border border-primary bg-primary px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-brand-400">
              {t('articles.notFound.button')}
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 text-slate-300">
      <article>
        {/* === HEADER === */}
        <header className="relative overflow-hidden py-12 md:py-16">
          <div className="pointer-events-none absolute -top-40 end-[-120px] h-[420px] w-[420px] rounded-full bg-primary/[0.10] blur-3xl" />
          <div className="relative mx-auto max-w-3xl px-6 md:px-8">
            <Link href="/articles">
              <span className="mb-8 inline-block cursor-pointer font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400 transition-colors hover:text-white">
                {t('articles.backAll')}
              </span>
            </Link>

            {!article.published && (
              <p className="mb-4 inline-block rounded-full border border-primary px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                {t('articles.draft')}
              </p>
            )}

            <h1 className="font-display text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl">
              {article.title}
            </h1>
            {article.publishedAt && (
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">
                {formatArticleDate(article.publishedAt, language)}
              </p>
            )}
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 md:px-8">
          <img
            src={article.coverImage}
            alt=""
            decoding="async"
            onError={onImageError}
            className="aspect-[16/9] w-full rounded-xl border border-slate-800 object-cover"
          />
        </div>

        {/* === BODY === */}
        {/* prose-invert supplies the dark-mode typography; the overrides below
            pull headings onto the display face and links onto the accent, so
            an article reads like the rest of the site. */}
        <div className="mx-auto max-w-3xl px-6 py-12 md:px-8 md:py-16">
          <div
            className="prose prose-invert max-w-none
              prose-headings:font-display prose-headings:tracking-tight prose-headings:text-white
              prose-p:leading-relaxed prose-p:text-slate-300
              prose-li:text-slate-300 prose-strong:text-white
              prose-blockquote:border-s-2 prose-blockquote:border-primary prose-blockquote:not-italic prose-blockquote:text-slate-300
              prose-hr:border-slate-800
              prose-code:text-brand-400 prose-code:before:content-none prose-code:after:content-none
              prose-pre:border prose-pre:border-slate-800 prose-pre:bg-slate-900/60"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
              {article.body}
            </ReactMarkdown>
          </div>
        </div>

        {/* === NEXT STEP === */}
        {/* The funnel hop out of the article, set per article in the admin.
            Renders nothing when the author chose neither. */}
        {(relatedProject || article.relatedSolution) && (
          <section className="border-y border-slate-800 bg-slate-900/30 py-12 md:py-16">
            <div className="mx-auto max-w-3xl px-6 md:px-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                {t('articles.next')}
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {relatedProject && (
                  <Link href={`/portfolio/${relatedProject.id}`}>
                    <div className="card-lift group h-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950/60 p-5 hover:border-slate-700">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
                        {t('articles.next.project')}
                      </p>
                      <p className="mt-2 font-display text-base font-semibold text-white transition-colors group-hover:text-primary">
                        {relatedProject.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {t(`category.${relatedProject.category}`)}
                      </p>
                    </div>
                  </Link>
                )}

                {article.relatedSolution && (
                  <Link href={`/services#${article.relatedSolution}`}>
                    <div className="card-lift group h-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950/60 p-5 hover:border-slate-700">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
                        {t('articles.next.solution')}
                      </p>
                      <p
                        dir="ltr"
                        className="mt-2 font-display text-base font-semibold text-white transition-colors group-hover:text-primary rtl:text-end"
                      >
                        {t(SOLUTION_NAME_KEY[article.relatedSolution])}
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        {/* === CTA === */}
        <section className="relative overflow-hidden py-16 text-center md:py-20">
          <div className="pointer-events-none absolute -bottom-52 left-1/2 h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-primary/[0.10] blur-3xl" />
          <div className="relative mx-auto max-w-2xl px-6 md:px-8">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {t('articles.cta.heading')}
            </h2>
            <p className="mx-auto mt-4 max-w-[52ch] leading-relaxed text-slate-400">
              {t('articles.cta.body')}
            </p>
            <Link href="/contact">
              <span className="mt-7 inline-block cursor-pointer rounded-lg border border-primary bg-primary px-7 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-brand-400">
                {t('common.cta.bookCall')}
              </span>
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
