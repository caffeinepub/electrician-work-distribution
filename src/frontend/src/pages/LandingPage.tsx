import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  CalendarCheck,
  Heart,
  Refrigerator,
  ShieldCheck,
  Star,
  Tv,
  Wind,
  Zap,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const FEATURES = [
  {
    icon: Zap,
    label: "Electrician",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    icon: Wind,
    label: "AC Technician",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    icon: Refrigerator,
    label: "Fridge Repair",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: Tv,
    label: "Electronic Repair",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
];

const NAV_CARDS = [
  {
    title: "Browse Services",
    description: "Explore all available repair and electrical services.",
    href: "/services",
    icon: Zap,
    cta: "View Services",
  },
  {
    title: "Job Board",
    description: "Find open service requests and apply as a technician.",
    href: "/jobs",
    icon: Briefcase,
    cta: "Browse Jobs",
  },
  {
    title: "My Bookings",
    description: "Track your ongoing and past service requests.",
    href: "/my-bookings",
    icon: Star,
    cta: "View Bookings",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const handleBookService = () => {
    if (isAuthenticated) {
      navigate({ to: "/services" });
    } else {
      toast.info("Please log in to book a service.", {
        action: {
          label: "Log In",
          onClick: login,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <ShieldCheck className="w-4 h-4" />
            Trusted Home Services
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-4">
            Expert Repairs,
            <br />
            <span className="text-primary">Fixed Price</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Professional electricians and technicians at your doorstep. All
            services at a flat rate of{" "}
            <span className="text-primary font-bold">₹1200</span> — ₹1150
            service + ₹50 booking charge, no surprises.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {FEATURES.map(({ icon: Icon, label, color, bg }) => (
              <div
                key={label}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border border-border ${bg} text-sm font-medium text-foreground`}
              >
                <Icon className={`w-4 h-4 ${color}`} />
                {label}
              </div>
            ))}
          </div>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handleBookService}
              className="flex items-center gap-2 font-semibold px-8"
              data-ocid="landing.primary_button"
            >
              <CalendarCheck className="w-5 h-5" />
              Book a Service
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: "/jobs" })}
              className="flex items-center gap-2 font-semibold px-8"
              data-ocid="landing.secondary_button"
            >
              <Briefcase className="w-5 h-5" />
              Browse Jobs
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-foreground text-center mb-10">
          What would you like to do?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {NAV_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.href}
                type="button"
                onClick={() => navigate({ to: card.href })}
                className="group text-left p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:bg-card/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {card.description}
                </p>
                <div className="flex items-center gap-1 text-sm text-primary font-medium">
                  {card.cta}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-t border-border bg-card/30">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Why Technical Tech?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10">
            We connect you with verified, qualified technicians for all your
            home repair needs.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Verified Technicians",
                desc: "All workers are background-checked and qualified.",
              },
              {
                icon: Star,
                title: "Fixed ₹1200 Price",
                desc: "₹1150 service + ₹50 booking charge. Transparent pricing, no hidden fees.",
              },
              {
                icon: Zap,
                title: "Fast Response",
                desc: "Get a technician assigned within hours.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-xl border border-border bg-card"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Technical Tech. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with{" "}
            <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> using{" "}
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
