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

const ROLE_CARDS = [
  {
    role: "Admin",
    description: "Manage orders, verifications & payments",
    href: "/admin/dashboard",
    icon: ShieldCheck,
    gradient: "from-amber-500/20 to-amber-600/5",
    border: "border-amber-500/40 hover:border-amber-400",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    cta: "Open Portal",
    ocid: "landing.admin_button",
  },
  {
    role: "Customer",
    description: "Book a service at your doorstep",
    href: "/services",
    icon: CalendarCheck,
    gradient: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/40 hover:border-blue-400",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    badge: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    cta: "Book Now",
    ocid: "landing.customer_button",
  },
  {
    role: "Employee",
    description: "Apply for jobs & manage work",
    href: "/jobs",
    icon: Briefcase,
    gradient: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/40 hover:border-emerald-400",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    cta: "Find Jobs",
    ocid: "landing.employee_button",
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
      {/* ===== ROLE SELECTION — TOP SECTION ===== */}
      <section className="border-b border-border bg-gradient-to-b from-card/60 to-background">
        <div className="max-w-5xl mx-auto px-4 pt-12 pb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Technical Tech
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
            Who are you? <span className="text-primary">Choose your role</span>
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            Select your role to get started — admin, customer, or employee.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {ROLE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.role}
                  type="button"
                  onClick={() => navigate({ to: card.href })}
                  data-ocid={card.ocid}
                  className={`group relative text-left p-7 rounded-2xl border bg-gradient-to-br ${card.gradient} ${card.border} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0`}
                >
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl ${card.iconBg} flex items-center justify-center mb-5 transition-transform group-hover:scale-105`}
                  >
                    <Icon className={`w-8 h-8 ${card.iconColor}`} />
                  </div>

                  {/* Role label */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className={"text-2xl font-extrabold text-foreground"}>
                      {card.role}
                    </span>
                    <span
                      className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${card.badge}`}
                    >
                      {card.role}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    {card.description}
                  </p>

                  {/* CTA */}
                  <div
                    className={`flex items-center gap-1.5 text-sm font-semibold ${card.iconColor}`}
                  >
                    {card.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 py-16 text-center">
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
