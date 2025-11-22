import { Link } from 'wouter';
import { ArrowRight, Check, Sparkles, Zap, Shield, TrendingUp, Code, Bot, BarChart3, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n';
// Import the new background image. 
// Note: Ensure the file is actually named 'background.png.png' in your assets folder. 
// If it is just 'background.png', remove the second .png
import heroBg from '@/assets/background.png.png'; 
import dashboardImage from '@assets/generated_images/website_dashboard_mockup_showcase.png';
import aiImage from '@assets/generated_images/ai_automation_visual_concept.png';

export default function Home() {
  const { t, isRTL } = useI18n();

  const valueProps = [
    {
      icon: Sparkles,
      title: t('value.custom.title'),
      description: t('value.custom.description'),
    },
    {
      icon: TrendingUp,
      title: t('value.performance.title'),
      description: t('value.performance.description'),
    },
    {
      icon: Shield,
      title: t('value.support.title'),
      description: t('value.support.description'),
    },
  ];

  const services = [
    {
      icon: Code,
      title: t('service.ai.title'),
      description: t('service.ai.description'),
      href: '/services/ai-agents',
    },
    {
      icon: Bot,
      title: t('service.automation.title'),
      description: t('service.automation.description'),
      href: '/services/automation',
    },
    {
      icon: BarChart3,
      title: t('service.marketing.title'),
      description: t('service.marketing.description'),
      href: '/services/digital-marketing',
    },
    {
      icon: Zap,
      title: t('service.other.title'),
      description: t('service.other.description'),
      href: '/contact',
    },
  ];

  const portfolioProjects = [
    {
      title: 'Luxury Real Estate Platform',
      client: 'Premium Properties Inc.',
      result: '+250% lead generation',
      image: dashboardImage,
    },
    {
      title: 'Beauty Center Booking System',
      client: 'Elegance Spa & Beauty',
      result: '+180% online bookings',
      image: dashboardImage,
    },
    {
      title: 'AI-Powered Customer Service',
      client: 'TechCorp Solutions',
      result: '24/7 automated support',
      image: aiImage,
    },
  ];

  const testimonials = [
    {
      quote: 'OmniflowAI transformed our online presence. Our website now drives 3x more leads than before.',
      author: 'Sarah Johnson',
      role: 'CEO, Elite Realty',
      rating: 5,
    },
    {
      quote: 'The AI automation they built saves us 20 hours per week. Incredible ROI!',
      author: 'Michael Chen',
      role: 'Owner, TechStart Solutions',
      rating: 5,
    },
    {
      quote: 'Professional, responsive, and delivered exactly what we needed. Highly recommended!',
      author: 'Fatima Al-Said',
      role: 'Marketing Director, Fusion Labs',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* HERO SECTION START - Updated with new Background Image */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-20 bg-background">

        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Content: Headline & CTA */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.1] tracking-tight">
                  {t('hero.title')}
                  <span className="block text-primary mt-2">
                    {t('hero.subtitle')}
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl leading-relaxed">
                  {t('hero.description')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" className="text-lg px-8 py-6 h-auto shadow-xl shadow-primary/20" data-testid="button-hero-cta">
                    {t('hero.cta')}
                    <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 h-auto bg-background/60 backdrop-blur-sm border-primary/20 hover:bg-primary/5"
                    data-testid="button-hero-secondary"
                  >
                    {t('hero.cta.secondary')}
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-4 pt-4 text-sm font-medium text-muted-foreground">
                <div className="flex -space-x-2">
                   {/* Simulated user avatars for social proof */}
                   <div className="w-8 h-8 rounded-full border-2 border-background bg-slate-300"></div>
                   <div className="w-8 h-8 rounded-full border-2 border-background bg-slate-400"></div>
                   <div className="w-8 h-8 rounded-full border-2 border-background bg-slate-500"></div>
                </div>
                <p className="flex items-center gap-2">
                  <span className="text-primary">★★★★★</span>
                  {t('hero.trust')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* HERO SECTION END */}

      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
              {t('value.title')}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {t('value.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueProps.map((prop, index) => {
              const Icon = prop.icon;
              return (
                <Card key={index} className="hover-elevate transition-all duration-300">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{prop.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {prop.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`order-2 lg:order-1 ${isRTL ? 'lg:order-2' : ''}`}>
              <img
                src={dashboardImage}
                alt="Website dashboard"
                className="rounded-xl shadow-lg w-full"
                data-testid="img-service-spotlight"
              />
            </div>

            <div className={`order-1 lg:order-2 space-y-6 ${isRTL ? 'lg:order-1' : ''}`}>
              <h2 className="text-4xl md:text-5xl font-bold font-display">
                {t('service.main.title')}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t('service.main.subtitle')}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('service.main.description')}
              </p>

              <ul className="space-y-3">
                {['Custom dashboards', 'SEO optimization', 'Mobile responsive', 'Fast loading times'].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-chart-2 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/services/website-development">
                <Button size="lg" className="mt-4" data-testid="button-service-main-cta">
                  {t('service.main.cta')}
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
              {t('service.secondary.title')}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t('service.secondary.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link key={index} href={service.href}>
                  <Card className="h-full hover-elevate transition-all duration-300 cursor-pointer" data-testid={`card-service-${index}`}>
                    <CardContent className="p-6 space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold">{service.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                      <div className="flex items-center text-primary text-sm font-medium">
                        Learn More
                        <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              {t('portfolio.title')}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t('portfolio.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {portfolioProjects.map((project, index) => (
              <Card key={index} className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-portfolio-${index}`}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6 space-y-2">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.client}</p>
                  <p className="text-lg font-semibold text-chart-2">{project.result}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/portfolio">
              <Button variant="outline" size="lg" data-testid="button-portfolio-cta">
                {t('portfolio.cta')}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              {t('testimonials.title')}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t('testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} data-testid={`card-testimonial-${index}`}>
                <CardContent className="p-8 space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-primary/10 via-chart-2/10 to-primary/10">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold font-display">
            {t('cta.final.title')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            {t('cta.final.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8 py-6" data-testid="button-final-cta">
                {t('cta.final.button')}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" data-testid="button-final-secondary">
                {t('portfolio.cta')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}