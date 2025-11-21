import { Link } from 'wouter';
import { ArrowRight, Code, Bot, Zap, BarChart3, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n';

export default function Services() {
  const { t, isRTL } = useI18n();

  const services = [
    {
      icon: Code,
      title: 'Website Development',
      description: 'Custom websites built for growth with performance-driven results and intuitive dashboards.',
      features: [
        'Custom design tailored to your brand',
        'SEO optimization included',
        'Mobile-first responsive design',
        'Fast loading times',
        'Easy-to-use dashboard',
        'Ongoing maintenance packages',
      ],
      href: '/services/website-development',
    },
    {
      icon: Bot,
      title: t('service.ai.title'),
      description: t('service.ai.description'),
      features: [
        '24/7 automated customer support',
        'Natural language processing',
        'Multi-language support',
        'Custom training on your data',
        'Seamless integration',
        'Analytics and insights',
      ],
      href: '/services/ai-agents',
    },
    {
      icon: Zap,
      title: t('service.automation.title'),
      description: t('service.automation.description'),
      features: [
        'Workflow automation',
        'Data synchronization',
        'Email and SMS automation',
        'Payment processing automation',
        'Inventory management',
        'Custom integrations',
      ],
      href: '/services/automation',
    },
    {
      icon: BarChart3,
      title: t('service.marketing.title'),
      description: t('service.marketing.description'),
      features: [
        'SEO optimization',
        'Performance marketing',
        'Content strategy',
        'Analytics and tracking',
        'Conversion optimization',
        'Social media integration',
      ],
      href: '/services/digital-marketing',
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">
              {t('nav.services')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Comprehensive digital solutions to transform your business
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="hover-elevate transition-all duration-300" data-testid={`card-service-${index}`}>
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
                        <p className="text-muted-foreground">{service.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm">What's Included:</h3>
                      <ul className="space-y-2">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-chart-2 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link href={service.href}>
                      <Button className="w-full" data-testid={`button-learn-more-${index}`}>
                        Learn More
                        <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-16 text-center bg-gradient-to-r from-primary/10 via-chart-2/10 to-primary/10 rounded-xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
              Not Sure Which Service You Need?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss your project and find the perfect solution for your business goals.
            </p>
            <Link href="/contact">
              <Button size="lg" data-testid="button-contact">
                {t('cta.final.button')}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
