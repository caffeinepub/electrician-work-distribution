import { Link } from '@tanstack/react-router';
import { Zap, Heart } from 'lucide-react';

export default function LandingPage() {
  const appId = encodeURIComponent(window.location.hostname || 'technical-tech');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded bg-primary">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground text-lg leading-tight tracking-wide">
              Technical Tech
            </h1>
            <p className="text-xs text-muted-foreground">Home Appliance Repair Services</p>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Technical Tech Hero"
          className="w-full object-cover max-h-64 md:max-h-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent flex items-center">
          <div className="px-8 md:px-16">
            <h2 className="text-2xl md:text-4xl font-extrabold text-foreground leading-tight animate-fade-in">
              Expert Repair Services
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-md animate-fade-in">
              TV, AC, Fridge, Ceiling Fan & Table Fan — fast, reliable, and affordable.
            </p>
          </div>
        </div>
      </section>

      {/* Main Navigation Cards */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <p className="text-center text-muted-foreground text-sm mb-8 uppercase tracking-widest font-medium">
          What would you like to do?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Request a Service Card */}
          <Link
            to="/services"
            className="group block rounded-2xl border border-border bg-card hover:border-primary hover:shadow-lg transition-all duration-300 overflow-hidden animate-slide-up"
          >
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src="/assets/generated/tv-services-icon.dim_256x256.png"
                alt="Request a Service"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                Request a Service
              </h3>
              <p className="text-sm text-muted-foreground">
                Book a repair for your TV, AC, fridge, or fan — quick and easy.
              </p>
            </div>
          </Link>

          {/* Worker Job Apply Card */}
          <Link
            to="/jobs"
            className="group block rounded-2xl border border-border bg-card hover:border-primary hover:shadow-lg transition-all duration-300 overflow-hidden animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src="/assets/generated/worker-apply-icon.dim_256x256.png"
                alt="Worker Job Apply"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                Worker Job Apply
              </h3>
              <p className="text-sm text-muted-foreground">
                Join our team of skilled technicians and grow your career.
              </p>
            </div>
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {['Television Repair', 'AC Repair', 'Fridge Repair', 'Ceiling Fan Repair', 'Table Fan Repair'].map((feat) => (
            <span
              key={feat}
              className="px-4 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground"
            >
              {feat}
            </span>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/60 py-5 px-4 text-center">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          Built with <Heart className="w-3 h-3 text-primary fill-primary" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
