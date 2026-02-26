import { Link } from '@tanstack/react-router';
import { Zap, Shield, Clock, Star, Wrench, Wind, Fan } from 'lucide-react';

export default function LandingPage() {
  const appId = encodeURIComponent(window.location.hostname || 'technical-tech');

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-banner.dim_1200x400.png"
            alt="Hero Banner"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
        <div className="relative container mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-primary w-6 h-6" />
              <span className="text-primary font-semibold text-sm uppercase tracking-widest">Technical Tech</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Expert Electrical Services at Your Fingertips
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with qualified electricians for all your electrical needs. Fast, reliable, and professional service.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-sm hover:bg-primary/90 transition-colors"
              >
                <Wrench className="w-5 h-5" />
                Request Service
              </Link>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 px-8 py-3 border border-border text-foreground font-semibold rounded-sm hover:bg-accent transition-colors"
              >
                Apply as Worker
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pills */}
      <section className="py-8 border-y border-border bg-card/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: <Wrench className="w-4 h-4" />, label: 'Electronic Repair' },
              { icon: <Wind className="w-4 h-4" />, label: 'AC Technician' },
              { icon: <Wrench className="w-4 h-4" />, label: 'Fridge Repair' },
              { icon: <Fan className="w-4 h-4" />, label: 'Ceiling Fan' },
              { icon: <Fan className="w-4 h-4" />, label: 'Table Fan' },
            ].map((pill) => (
              <span
                key={pill.label}
                className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-muted-foreground"
              >
                {pill.icon}
                {pill.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Request a Service Card */}
            <Link
              to="/services"
              className="group relative overflow-hidden rounded-sm border border-border bg-card hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src="/assets/generated/tv-services-icon.dim_256x256.png"
                  alt="Request a Service"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Request a Service
                </h3>
                <p className="text-muted-foreground text-sm">
                  Book a qualified technician for TV, AC, fridge, fan repairs and more.
                </p>
              </div>
            </Link>

            {/* Worker Job Apply Card */}
            <Link
              to="/jobs"
              className="group relative overflow-hidden rounded-sm border border-border bg-card hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src="/assets/generated/worker-apply-icon.dim_256x256.png"
                  alt="Worker Job Apply"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Worker Job Apply
                </h3>
                <p className="text-muted-foreground text-sm">
                  Join our network of skilled technicians and find work opportunities.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-primary" />,
                title: 'Verified Professionals',
                desc: 'All our technicians are background-checked and certified.',
              },
              {
                icon: <Clock className="w-8 h-8 text-primary" />,
                title: 'Fast Response',
                desc: 'Get a technician at your door within hours of booking.',
              },
              {
                icon: <Star className="w-8 h-8 text-primary" />,
                title: 'Rated & Reviewed',
                desc: 'Read real reviews from customers before you book.',
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center p-6">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Technical Tech. Built with{' '}
            <span className="text-red-500">♥</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
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
