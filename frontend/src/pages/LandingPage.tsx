import { useNavigate } from '@tanstack/react-router';
import { Wrench, Briefcase, Zap, Shield, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
          <img
            src="/assets/generated/hero-banner.dim_1200x400.png"
            alt="Technical Tech Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent flex items-center">
            <div className="px-8 md:px-16 max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
                Professional <span className="text-primary">Technical</span> Services
              </h1>
              <p className="text-muted-foreground text-base md:text-lg mb-6">
                Expert electricians and technicians at your service. Fast, reliable, and professional.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate({ to: '/services' })} size="lg" className="gap-2">
                  <Wrench className="h-4 w-4" />
                  Book a Service
                </Button>
                <Button onClick={() => navigate({ to: '/jobs' })} variant="outline" size="lg" className="gap-2">
                  <Briefcase className="h-4 w-4" />
                  Find Work
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pills */}
      <section className="py-8 px-6 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-4">
          {[
            { icon: Zap, label: 'Fast Response' },
            { icon: Shield, label: 'Verified Experts' },
            { icon: Clock, label: '24/7 Available' },
            { icon: Star, label: 'Top Rated' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 text-sm font-medium">
              <Icon className="h-4 w-4 text-primary" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-3">Our Services</h2>
          <p className="text-muted-foreground text-center mb-10">
            Professional repair and maintenance services for your home and business
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TV / Electronics Card */}
            <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
              onClick={() => navigate({ to: '/services' })}>
              <div className="flex items-center gap-4 p-6">
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                  <img
                    src="/assets/generated/tv-services-icon.dim_256x256.png"
                    alt="Electronic Services"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    Electronic & Appliance Repair
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    TV, AC, fridge, and all home appliance repairs by certified technicians.
                  </p>
                </div>
              </div>
              <div className="px-6 pb-4">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary gap-1 p-0">
                  Book Now →
                </Button>
              </div>
            </div>

            {/* Worker Apply Card */}
            <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
              onClick={() => navigate({ to: '/jobs' })}>
              <div className="flex items-center gap-4 p-6">
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                  <img
                    src="/assets/generated/worker-apply-icon.dim_256x256.png"
                    alt="Apply for Work"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    Apply for Work Orders
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Browse open job listings and apply to work orders that match your skills.
                  </p>
                </div>
              </div>
              <div className="px-6 pb-4">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary gap-1 p-0">
                  Browse Jobs →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-card border-t border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Choose a Service', desc: 'Select the type of repair or technical service you need.' },
              { step: '02', title: 'Pick a Technician', desc: 'Browse available certified technicians and choose the best fit.' },
              { step: '03', title: 'Get It Done', desc: 'Your technician arrives and completes the job professionally.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="text-4xl font-display font-bold text-primary/30 mb-3">{step}</div>
                <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border bg-background">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Technical Tech. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
