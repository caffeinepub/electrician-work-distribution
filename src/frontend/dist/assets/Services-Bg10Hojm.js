import { c as createLucideIcon, a as useInternetIdentity, e as useCreateFixedPriceWorkOrder, r as reactExports, E as ElectricianQualification, j as jsxRuntimeExports, f as Separator, B as Button, Z as Zap, L as LoaderCircle, d as ue } from "./index-DuXxNtqE.js";
import { B as Badge } from "./badge-DLaFdFAq.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle, d as CardDescription } from "./card-CdMSN0Jv.js";
import { I as Input } from "./input-BiWaAhCE.js";
import { L as Label } from "./label-u8LAFSpM.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-j5e_CqrF.js";
import { T as Textarea } from "./textarea-BpkjpKyk.js";
import { C as CircleCheck } from "./circle-check-BzGhkgnG.js";
import { C as CalendarCheck } from "./calendar-check-CtMZkNr2.js";
import { T as Tv, W as Wind, R as Refrigerator } from "./wind-D2WrP7vC.js";
import { I as IndianRupee } from "./indian-rupee-Clxg2B10.js";
import "./index-CCnJQYgY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
];
const ArrowDown = createLucideIcon("arrow-down", __iconNode);
const SERVICE_TYPES = [
  {
    id: "electronicRepair",
    label: "Electronic Repair",
    description: "TV, washing machine, and other electronic appliances",
    icon: Tv,
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  },
  {
    id: "acTechnician",
    label: "AC Technician",
    description: "Air conditioner installation, repair, and servicing",
    icon: Wind,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10"
  },
  {
    id: "fridgeRepairWork",
    label: "Fridge Repair",
    description: "Refrigerator repair and maintenance",
    icon: Refrigerator,
    color: "text-green-400",
    bg: "bg-green-400/10"
  },
  {
    id: "electrician",
    label: "Electrician",
    description: "Wiring, switches, sockets, and electrical faults",
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-400/10"
  }
];
const PRIORITY_OPTIONS = [
  { value: "low", label: "Low — Within a week" },
  { value: "medium", label: "Medium — Within 2–3 days" },
  { value: "high", label: "High — Within 24 hours" },
  { value: "urgent", label: "Urgent — ASAP" }
];
const QUALIFICATION_OPTIONS = [
  { value: ElectricianQualification.itiElectrician, label: "ITI Electrician" },
  {
    value: ElectricianQualification.electronicElectricalEngineering,
    label: "Electronic Electrical Engineering"
  },
  { value: ElectricianQualification.eeeDiploma, label: "EEE Diploma" }
];
const SERVICE_COST = 1150;
const BOOKING_CHARGE = 50;
const TOTAL_PRICE = SERVICE_COST + BOOKING_CHARGE;
const UPI_ID = "8015393383@fam";
function Services() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const createMutation = useCreateFixedPriceWorkOrder();
  const bookingFormRef = reactExports.useRef(null);
  const [selectedService, setSelectedService] = reactExports.useState("");
  const [form, setForm] = reactExports.useState({
    description: "",
    location: "",
    priority: "medium",
    customerEmail: "",
    customerAddress: "",
    customerContactNumber: "",
    paymentMethod: "upi",
    preferredEducation: ElectricianQualification.itiElectrician
  });
  const [submitted, setSubmitted] = reactExports.useState(false);
  const handleBookService = () => {
    var _a;
    if (!isAuthenticated) {
      ue.error("Please log in to book a service.");
      login();
      return;
    }
    (_a = bookingFormRef.current) == null ? void 0 : _a.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
  const handleSubmit = async (e) => {
    var _a;
    e.preventDefault();
    if (!isAuthenticated) {
      ue.error("Please log in to book a service.");
      return;
    }
    if (!selectedService) {
      ue.error("Please select a service type.");
      return;
    }
    const serviceLabel = ((_a = SERVICE_TYPES.find((s) => s.id === selectedService)) == null ? void 0 : _a.label) ?? selectedService;
    try {
      await createMutation.mutateAsync({
        title: serviceLabel,
        description: form.description,
        location: form.location,
        priority: form.priority,
        customerEmail: form.customerEmail,
        customerAddress: form.customerAddress,
        customerContactNumber: form.customerContactNumber,
        paymentMethod: form.paymentMethod,
        preferredEducation: form.preferredEducation
      });
      setSubmitted(true);
      ue.success("Service booked successfully!");
    } catch (err) {
      ue.error((err == null ? void 0 : err.message) ?? "Failed to book service.");
    }
  };
  if (submitted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-md w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-10 h-10 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-foreground mb-2", children: "Booking Confirmed!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Your service request has been submitted. An admin will review and assign a technician shortly." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-lg bg-primary/5 border border-primary/20 mb-6 text-left space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-2", children: "Price Breakdown" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Service Cost" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
            "₹",
            SERVICE_COST
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Booking Charge (online)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
            "₹",
            BOOKING_CHARGE
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xl font-bold text-primary", children: [
            "₹",
            TOTAL_PRICE
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground pt-1", children: [
          "Booking charge ₹",
          BOOKING_CHARGE,
          " to be paid online via UPI:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: UPI_ID })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setSubmitted(false), children: "Book Another Service" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Our Services" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-1 max-w-lg", children: [
          "Professional home appliance repair and electrical services at a flat rate of",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-semibold", children: [
            "₹",
            TOTAL_PRICE
          ] }),
          " ",
          "(₹",
          SERVICE_COST,
          " service + ₹",
          BOOKING_CHARGE,
          " booking charge)."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "lg",
          onClick: handleBookService,
          className: "flex items-center gap-2 shrink-0 font-semibold",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { className: "w-5 h-5" }),
            "Book a Service"
          ]
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 py-10 space-y-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-foreground mb-6", children: "Available Services" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: SERVICE_TYPES.map((service) => {
          const Icon = service.icon;
          const isSelected = selectedService === service.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                var _a;
                setSelectedService(service.id);
                if (isAuthenticated) {
                  (_a = bookingFormRef.current) == null ? void 0 : _a.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                  });
                }
              },
              className: `relative text-left p-5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 ${isSelected ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card hover:border-primary/40 hover:bg-card/80"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 right-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-primary/10 text-primary border-primary/30 font-bold text-sm px-2 py-0.5", children: [
                  "₹",
                  TOTAL_PRICE
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-10 h-10 rounded-lg ${service.bg} flex items-center justify-center mb-3`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-5 h-5 ${service.color}` })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-sm mb-1", children: service.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: service.description }),
                isSelected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-1 text-xs text-primary font-medium", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
                  "Selected"
                ] })
              ]
            },
            service.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { ref: bookingFormRef, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-foreground", children: "Book a Service" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "w-4 h-4 text-muted-foreground" })
        ] }),
        !isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-dashed", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { className: "w-7 h-7 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground mb-2", children: "Login Required" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4 max-w-xs", children: "Please log in to book a service. It only takes a moment." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: login, children: "Log In to Book" })
        ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Service Booking Form" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
              "Fill in the details below to request a service. Total:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-bold", children: [
                "₹",
                TOTAL_PRICE
              ] }),
              " ",
              "(₹",
              SERVICE_COST,
              " service + ₹",
              BOOKING_CHARGE,
              " booking charge)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Service Type *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: selectedService,
                  onValueChange: setSelectedService,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "service.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a service type" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: SERVICE_TYPES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.label }, s.id)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", children: "Problem Description *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "description",
                  "data-ocid": "service.textarea",
                  placeholder: "Describe the issue in detail...",
                  value: form.description,
                  onChange: (e) => setForm({ ...form, description: e.target.value }),
                  required: true,
                  rows: 3
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "location", children: "Service Location *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "location",
                  "data-ocid": "service.input",
                  placeholder: "City / Area",
                  value: form.location,
                  onChange: (e) => setForm({ ...form, location: e.target.value }),
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Priority" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.priority,
                  onValueChange: (v) => setForm({ ...form, priority: v }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: PRIORITY_OPTIONS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.value, children: p.label }, p.value)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Your Email *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "email",
                  type: "email",
                  placeholder: "you@example.com",
                  value: form.customerEmail,
                  onChange: (e) => setForm({ ...form, customerEmail: e.target.value }),
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "address", children: "Your Address *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "address",
                  placeholder: "Full address for the technician",
                  value: form.customerAddress,
                  onChange: (e) => setForm({ ...form, customerAddress: e.target.value }),
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "contact", children: "Contact Number *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "contact",
                  type: "tel",
                  placeholder: "+91 XXXXX XXXXX",
                  value: form.customerContactNumber,
                  onChange: (e) => setForm({
                    ...form,
                    customerContactNumber: e.target.value
                  }),
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Preferred Technician Qualification" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.preferredEducation,
                  onValueChange: (v) => setForm({
                    ...form,
                    preferredEducation: v
                  }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: QUALIFICATION_OPTIONS.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: q.value, children: q.label }, q.value)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Payment Method" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.paymentMethod,
                  onValueChange: (v) => setForm({ ...form, paymentMethod: v }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cash", children: "Cash" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "upi", children: "UPI" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "card", children: "Card" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "netbanking", children: "Net Banking" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Price Breakdown" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Service Cost" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 font-medium text-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-3.5 h-3.5" }),
                  SERVICE_COST
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Booking Charge (online)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 font-medium text-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-3.5 h-3.5" }),
                  BOOKING_CHARGE
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-2xl font-bold text-primary", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-5 h-5" }),
                  TOTAL_PRICE
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Booking charge ₹",
                BOOKING_CHARGE,
                " to be paid online via UPI:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: UPI_ID })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                "data-ocid": "service.submit_button",
                className: "w-full font-semibold",
                disabled: createMutation.isPending,
                size: "lg",
                children: createMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }),
                  "Booking..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { className: "w-4 h-4 mr-2" }),
                  "Book Service — ₹",
                  TOTAL_PRICE
                ] })
              }
            )
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Services as default
};
