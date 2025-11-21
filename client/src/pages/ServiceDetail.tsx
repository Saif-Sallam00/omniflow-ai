import { Link, useRoute } from 'wouter';
import { ArrowRight, Check, Code, Bot, Zap, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n';
import dashboardImage from '@assets/generated_images/website_dashboard_mockup_showcase.png';
import aiImage from '@assets/generated_images/ai_automation_visual_concept.png';

export default function ServiceDetail() {
  const [, params] = useRoute('/services/:slug');
  const { t, isRTL } = useI18n();

  const services = {
    'website-development': {
      icon: Code,
      title: 'Custom Website Development',
      subtitle: 'Performance-driven websites built to drive sales and growth',
      description: 'We build custom websites for service-based businesses that are designed to convert visitors into customers. From real estate brokers to beauty centers, our websites combine stunning design with powerful functionality.',
      image: dashboardImage,
      features: [
        'Custom design tailored to your brand identity',
        'Intuitive A-to-Z dashboard for easy management',
        'SEO optimization for maximum visibility',
        'Mobile-first responsive design',
        'Fast loading times for better user experience',
        'Secure hosting and SSL certificates',
        'Ongoing maintenance and support packages',
        'Integration with third-party tools and APIs',
      ],
      process: [
        { step: '1', title: 'Discovery', description: 'We learn about your business, goals, and target audience.' },
        { step: '2', title: 'Design', description: 'Custom design mockups aligned with your brand.' },
        { step: '3', title: 'Development', description: 'Build your website with modern technologies.' },
        { step: '4', title: 'Launch & Support', description: 'Deploy and provide ongoing maintenance.' },
      ],
    },
    'ai-agents': {
      icon: Bot,
      title: 'AI Agents Development',
      subtitle: 'Intelligent AI-powered solutions that work 24/7',
      description: 'Our AI agents provide intelligent customer service, automate repetitive tasks, and deliver personalized experiences to your customers around the clock.',
      image: aiImage,
      features: [
        '24/7 automated customer support',
        'Natural language processing for human-like conversations',
        'Multi-language support for global reach',
        'Custom training on your specific data and use cases',
        'Seamless integration with existing systems',
        'Analytics dashboard for performance insights',
        'Continuous learning and improvement',
        'Cost-effective scalability',
      ],
      process: [
        { step: '1', title: 'Analysis', description: 'Understand your customer service needs and pain points.' },
        { step: '2', title: 'Training', description: 'Train AI models on your data and use cases.' },
        { step: '3', title: 'Integration', description: 'Integrate with your existing platforms and workflows.' },
        { step: '4', title: 'Optimization', description: 'Monitor, analyze, and continuously improve performance.' },
      ],
    },
    'automation': {
      icon: Zap,
      title: 'Business Automation',
      subtitle: 'Streamline operations and save valuable time',
      description: 'Automate repetitive business processes, sync data across platforms, and free up your team to focus on what matters most - growing your business.',
      image: aiImage,
      features: [
        'Workflow automation for repetitive tasks',
        'Data synchronization across platforms',
        'Automated email and SMS campaigns',
        'Payment processing automation',
        'Inventory and order management',
        'Custom API integrations',
        'Scheduled reports and notifications',
        'Error handling and monitoring',
      ],
      process: [
        { step: '1', title: 'Audit', description: 'Identify manual processes that can be automated.' },
        { step: '2', title: 'Design', description: 'Design automation workflows and integrations.' },
        { step: '3', title: 'Implementation', description: 'Build and test automation solutions.' },
        { step: '4', title: 'Monitor', description: 'Track performance and optimize as needed.' },
      ],
    },
    'digital-marketing': {
      icon: BarChart3,
      title: 'Digital Marketing',
      subtitle: 'Drive traffic, engagement, and conversions',
      description: 'Our digital marketing strategies combine SEO, performance marketing, and data-driven insights to help your business reach the right audience and achieve measurable results.',
      image: dashboardImage,
      features: [
        'Comprehensive SEO optimization',
        'Performance marketing campaigns',
        'Content strategy and creation',
        'Advanced analytics and tracking',
        'Conversion rate optimization',
        'Social media integration',
        'Email marketing automation',
        'Competitor analysis and insights',
      ],
      process: [
        { step: '1', title: 'Research', description: 'Analyze your market, competitors, and opportunities.' },
        { step: '2', title: 'Strategy', description: 'Develop a comprehensive marketing strategy.' },
        { step: '3', title: 'Execute', description: 'Launch campaigns and optimize for performance.' },
        { step: '4', title: 'Report', description: 'Track results and provide detailed analytics.' },
      ],
    },
  };

  const service = params?.slug ? services[params.slug as keyof typeof services] : null;

  if (!service) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
          <Link href="/services">
            <Button>View All Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <div className="min-h-screen pt-20">
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold font-display">
                {service.title}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                {service.subtitle}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {service.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/contact">
                  <Button size="lg" data-testid="button-get-started">
                    Get Started
                    <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </Button>
                </Link>
                <Link href="/portfolio">
                  <Button size="lg" variant="outline" data-testid="button-view-work">
                    View Our Work
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <img
                src={service.image}
                alt={service.title}
                className="rounded-xl shadow-lg w-full"
                data-testid="img-service-detail"
              />
            </div>
          </div>

          <div className="mb-24">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-12 text-center">
              What's Included
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {service.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg hover-elevate transition-all">
                  <Check className="w-5 h-5 text-chart-2 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-24">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-12 text-center">
              Our Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {service.process.map((item, index) => (
                <Card key={index} className="text-center" data-testid={`card-process-${index}`}>
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 via-chart-2/10 to-primary/10 rounded-xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss your project and create a custom solution for your business.
            </p>
            <Link href="/contact">
              <Button size="lg" data-testid="button-cta-bottom">
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
