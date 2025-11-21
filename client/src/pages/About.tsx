import { Shield, Users, Target, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n';
import teamImage from '@assets/generated_images/hero_workspace_collaboration_scene.png';

export default function About() {
  const { t } = useI18n();

  const values = [
    {
      icon: Shield,
      title: 'Excellence in Service',
      description: 'We are committed to delivering excellent post-sale service and ongoing support to ensure your success.',
    },
    {
      icon: Target,
      title: 'Performance-Driven',
      description: 'Every solution we build is designed with measurable results and business growth in mind.',
    },
    {
      icon: Users,
      title: 'Client-Focused',
      description: 'Your success is our success. We work closely with you to understand and achieve your business goals.',
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: 'High standards, modern technologies, and best practices in every project we undertake.',
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              {t('about.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('about.description')}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With years of experience in web development, AI integration, and digital transformation, we've helped hundreds of businesses achieve their online goals. From custom websites to intelligent automation solutions, we bring technical expertise and strategic thinking to every project.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our approach combines cutting-edge technology with proven business strategies to deliver solutions that not only look great but drive real, measurable results for your business.
              </p>
            </div>

            <div>
              <img
                src={teamImage}
                alt="OmniflowAI team"
                className="rounded-xl shadow-lg w-full"
                data-testid="img-team"
              />
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-12">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="hover-elevate transition-all duration-300" data-testid={`card-value-${index}`}>
                    <CardContent className="p-6 space-y-4 text-center">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold">{value.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="bg-card rounded-xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
              Why Choose OmniflowAI?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="text-5xl font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">Projects Delivered</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">98%</div>
                <p className="text-muted-foreground">Client Satisfaction</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">24/7</div>
                <p className="text-muted-foreground">Support Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
