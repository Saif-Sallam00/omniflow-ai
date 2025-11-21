import { Link } from 'wouter';
import { useI18n } from '@/lib/i18n';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-card border-t border-card-border">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div>
            <h3 className="text-2xl font-bold font-display mb-4 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              OmniflowAI
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('nav.services')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services/website-development">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="link-footer-website">
                    {t('service.main.title')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services/ai-agents">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="link-footer-ai">
                    {t('service.ai.title')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services/automation">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="link-footer-automation">
                    {t('service.automation.title')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services/digital-marketing">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="link-footer-marketing">
                    {t('service.marketing.title')}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('nav.about')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="link-footer-about">
                    {t('nav.about')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/portfolio">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="link-footer-portfolio">
                    {t('nav.portfolio')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="link-footer-contact">
                    {t('nav.contact')}
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-card-border text-center">
          <p className="text-sm text-muted-foreground">
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
