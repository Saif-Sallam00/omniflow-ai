import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { type ArticleCard } from '@shared/schema';
import { useI18n } from '@/lib/i18n';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { onImageError } from '@/lib/placeholder';
import { formatArticleDate } from '@/lib/article-date';

// =============================================================================
// ARTICLES INDEX — /articles
//
// Published articles only (the API filters; drafts are a 404 to the public).
// Filtered to the reader's language: the GTM splits content between Egypt- and
// Saudi-facing posts, so an Arabic reader should not be handed English cards.
// Empty is a legitimate state and says so plainly rather than rendering an
// empty grid.
// =============================================================================

export default function Articles() {
  const { t, language } = useI18n();
  useDocumentTitle(t('articles.title'));

  const { data, isLoading } = useQuery<ArticleCard[]>({ queryKey: ['/api/articles'] });
  const articles = (data || []).filter((a) => a.language === language);

  return (
    <div className="min-h-screen bg-slate-950 pt-20 text-slate-300">
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="pointer-events-none absolute -top-40 end-[-120px] h-[420px] w-[420px] rounded-full bg-primary/[0.10] blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 md:px-8">
          <span className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
            {t('articles.eyebrow')}
            <span aria-hidden="true" className="h-px flex-1 bg-slate-800" />
          </span>
          <h1 className="max-w-[20ch] font-display text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
            {t('articles.heading')}
          </h1>
          <p className="mt-5 max-w-[62ch] leading-relaxed text-slate-400">
            {t('articles.sub')}
          </p>
        </div>
      </section>

      <section className="border-t border-slate-800/40 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          {isLoading ? (
            <p className="text-sm text-slate-400">{t('articles.loading')}</p>
          ) : articles.length === 0 ? (
            <p className="max-w-[52ch] leading-relaxed text-slate-400">
              {t('articles.empty')}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <article className="group cursor-pointer">
                    <div className="card-lift relative mb-4 aspect-[16/9] overflow-hidden rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700">
                      <img
                        src={article.coverImage}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        onError={onImageError}
                        className="h-full w-full transform object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    {article.publishedAt && (
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">
                        {formatArticleDate(article.publishedAt, language)}
                      </p>
                    )}
                    <h2 className="mt-2 font-display text-lg font-semibold leading-snug tracking-tight text-white transition-colors group-hover:text-primary">
                      {article.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {article.excerpt}
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
