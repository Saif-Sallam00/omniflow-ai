import { Link } from 'wouter';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/i18n';
import dashboardImage from '@assets/generated_images/website_dashboard_mockup_showcase.png';
import aiImage from '@assets/generated_images/ai_automation_visual_concept.png';

export default function Portfolio() {
  const { t, isRTL } = useI18n();

  const projects = [
    {
      title: 'Luxury Real Estate Platform',
      client: 'Premium Properties Inc.',
      category: 'Website Development',
      description: 'A high-end real estate platform featuring advanced property search, virtual tours, and lead management system.',
      results: [
        '+250% increase in qualified leads',
        '3x faster property search',
        '45% reduction in bounce rate',
      ],
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AI Search'],
      image: dashboardImage,
    },
    {
      title: 'Beauty Center Booking System',
      client: 'Elegance Spa & Beauty',
      category: 'Website Development + Automation',
      description: 'Complete booking and management system with automated reminders, payment processing, and customer management.',
      results: [
        '+180% in online bookings',
        '90% reduction in no-shows',
        'Automated appointment reminders',
      ],
      technologies: ['React', 'Express', 'Stripe', 'SMS API'],
      image: dashboardImage,
    },
    {
      title: 'AI Customer Service Agent',
      client: 'TechCorp Solutions',
      category: 'AI Agents',
      description: 'Intelligent AI-powered customer service system handling inquiries, support tickets, and product recommendations.',
      results: [
        '24/7 automated customer support',
        '85% query resolution rate',
        '60% reduction in support costs',
      ],
      technologies: ['GPT-4', 'Node.js', 'WebSocket', 'NLP'],
      image: aiImage,
    },
    {
      title: 'E-commerce Automation Suite',
      client: 'Fashion Forward LLC',
      category: 'Automation + Marketing',
      description: 'Complete e-commerce automation including inventory management, order processing, and marketing automation.',
      results: [
        '75% time saved on operations',
        '+200% email conversion rate',
        'Real-time inventory sync',
      ],
      technologies: ['Python', 'APIs', 'Zapier', 'SEO Tools'],
      image: dashboardImage,
    },
    {
      title: 'Multi-Vendor Marketplace',
      client: 'LocalMarket Hub',
      category: 'Website Development',
      description: 'Scalable marketplace platform connecting local vendors with customers, featuring vendor dashboards and analytics.',
      results: [
        '150+ vendors onboarded',
        '+300% monthly transactions',
        'Advanced analytics dashboard',
      ],
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      image: dashboardImage,
    },
    {
      title: 'Marketing Analytics Dashboard',
      client: 'Digital Growth Agency',
      category: 'Digital Marketing',
      description: 'Comprehensive marketing analytics platform aggregating data from multiple sources with AI-powered insights.',
      results: [
        'Unified data from 15+ platforms',
        'AI-powered recommendations',
        '40% faster reporting',
      ],
      technologies: ['React', 'D3.js', 'Python', 'ML Models'],
      image: aiImage,
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">
              {t('portfolio.title')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              {t('portfolio.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-project-${index}`}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Badge variant="secondary" data-testid={`badge-category-${index}`}>
                      {project.category}
                    </Badge>
                    <h3 className="text-2xl font-bold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Key Results:</h4>
                    <ul className="space-y-2">
                      {project.results.map((result, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-chart-2 font-bold mt-1">✓</span>
                          <span className="text-sm text-muted-foreground">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center bg-card rounded-xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
              Want to See Your Project Here?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's build something amazing together. Get in touch today to discuss your project.
            </p>
            <Link href="/contact">
              <Button size="lg" data-testid="button-contact-cta">
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
