import { c as createLucideIcon, u as useNavigate, a as useInternetIdentity, j as jsxRuntimeExports, S as ShieldCheck, B as Briefcase, Z as Zap, b as Button, d as ue } from "./index-DT4hGqI0.js";
import { C as CalendarCheck } from "./calendar-check-CWHAr4Md.js";
import { A as ArrowRight } from "./arrow-right-XIcHwkfs.js";
import { W as Wind, R as Refrigerator, T as Tv } from "./wind-B3ykcsAz.js";
import { S as Star } from "./star-BHRSrfNz.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode);
const FEATURES = [
  {
    icon: Zap,
    label: "Electrician",
    color: "text-amber-400",
    bg: "bg-amber-400/10"
  },
  {
    icon: Wind,
    label: "AC Technician",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10"
  },
  {
    icon: Refrigerator,
    label: "Fridge Repair",
    color: "text-green-400",
    bg: "bg-green-400/10"
  },
  {
    icon: Tv,
    label: "Electronic Repair",
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  }
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
    ocid: "landing.admin_button"
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
    ocid: "landing.customer_button"
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
    ocid: "landing.employee_button"
  }
];
function LandingPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const handleBookService = () => {
    if (isAuthenticated) {
      navigate({ to: "/services" });
    } else {
      ue.info("Please log in to book a service.", {
        action: {
          label: "Log In",
          onClick: login
        }
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-gradient-to-b from-card/60 to-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 pt-12 pb-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2", children: "Technical Tech" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl sm:text-4xl font-extrabold text-foreground mb-2", children: [
        "Who are you? ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Choose your role" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-8", children: "Select your role to get started — admin, customer, or employee." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-5", children: ROLE_CARDS.map((card) => {
        const Icon = card.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => navigate({ to: card.href }),
            "data-ocid": card.ocid,
            className: `group relative text-left p-7 rounded-2xl border bg-gradient-to-br ${card.gradient} ${card.border} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-16 h-16 rounded-2xl ${card.iconBg} flex items-center justify-center mb-5 transition-transform group-hover:scale-105`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-8 h-8 ${card.iconColor}` })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-extrabold text-foreground", children: card.role }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `ml-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${card.badge}`,
                    children: card.role
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-5 leading-relaxed", children: card.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex items-center gap-1.5 text-sm font-semibold ${card.iconColor}`,
                  children: [
                    card.cta,
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-1 transition-transform" })
                  ]
                }
              )
            ]
          },
          card.role
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-5xl mx-auto px-4 py-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4" }),
          "Trusted Home Services"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-4", children: [
          "Expert Repairs,",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Fixed Price" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg text-muted-foreground max-w-xl mx-auto mb-8", children: [
          "Professional electricians and technicians at your doorstep. All services at a flat rate of",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold", children: "₹1200" }),
          " — ₹1150 service + ₹50 booking charge, no surprises."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-center gap-3 mb-10", children: FEATURES.map(({ icon: Icon, label, color, bg }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex items-center gap-2 px-4 py-2 rounded-full border border-border ${bg} text-sm font-medium text-foreground`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-4 h-4 ${color}` }),
              label
            ]
          },
          label
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "lg",
              onClick: handleBookService,
              className: "flex items-center gap-2 font-semibold px-8",
              "data-ocid": "landing.primary_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { className: "w-5 h-5" }),
                "Book a Service"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "lg",
              variant: "outline",
              onClick: () => navigate({ to: "/jobs" }),
              className: "flex items-center gap-2 font-semibold px-8",
              "data-ocid": "landing.secondary_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "w-5 h-5" }),
                "Browse Jobs",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-t border-border bg-card/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-foreground mb-4", children: "Why Technical Tech?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-xl mx-auto mb-10", children: "We connect you with verified, qualified technicians for all your home repair needs." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6", children: [
        {
          icon: ShieldCheck,
          title: "Verified Technicians",
          desc: "All workers are background-checked and qualified."
        },
        {
          icon: Star,
          title: "Fixed ₹1200 Price",
          desc: "₹1150 service + ₹50 booking charge. Transparent pricing, no hidden fees."
        },
        {
          icon: Zap,
          title: "Fast Response",
          desc: "Get a technician assigned within hours."
        }
      ].map(({ icon: Icon, title, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "p-6 rounded-xl border border-border bg-card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground mb-1", children: title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: desc })
          ]
        },
        title
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-border bg-card/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Technical Tech. All rights reserved."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1", children: [
        "Built with",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-3.5 h-3.5 text-primary fill-primary" }),
        " using",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: `https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-primary hover:underline",
            children: "caffeine.ai"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  LandingPage as default
};
