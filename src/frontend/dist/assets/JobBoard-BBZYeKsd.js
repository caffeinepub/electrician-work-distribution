import { c as createLucideIcon, a as useInternetIdentity, g as useGetAllWorkOrders, h as useIsSubscribedToJobAlerts, i as useApplyToWorkOrder, k as useSubscribeToJobAlerts, r as reactExports, j as jsxRuntimeExports, b as Briefcase, B as Button, L as LoaderCircle, Z as Zap, U as Users, d as ue } from "./index-DuXxNtqE.js";
import { B as Badge } from "./badge-DLaFdFAq.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-CdMSN0Jv.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-N5mR9zOG.js";
import { P as PriorityBadge } from "./PriorityBadge-CnEiHtqt.js";
import { S as StatusBadge } from "./StatusBadge-CKQqFeYR.js";
import { C as CircleCheck } from "./circle-check-BzGhkgnG.js";
import { M as MapPin } from "./map-pin-DMiWtppM.js";
import { C as CircleAlert } from "./circle-alert-I-DdmSi8.js";
import { C as Clock } from "./clock-hLj-ctrn.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",
      key: "j76jl0"
    }
  ],
  ["path", { d: "M22 10v6", key: "1lu8f3" }],
  ["path", { d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5", key: "1r8lef" }]
];
const GraduationCap = createLucideIcon("graduation-cap", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M5.8 11.3 2 22l10.7-3.79", key: "gwxi1d" }],
  ["path", { d: "M4 3h.01", key: "1vcuye" }],
  ["path", { d: "M22 8h.01", key: "1mrtc2" }],
  ["path", { d: "M15 2h.01", key: "1cjtqr" }],
  ["path", { d: "M22 20h.01", key: "1mrys2" }],
  [
    "path",
    {
      d: "m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10",
      key: "hbicv8"
    }
  ],
  [
    "path",
    { d: "m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17", key: "1i94pl" }
  ],
  ["path", { d: "m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7", key: "1cofks" }],
  [
    "path",
    {
      d: "M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z",
      key: "4kbmks"
    }
  ]
];
const PartyPopper = createLucideIcon("party-popper", __iconNode);
function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}
function JobBoard() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: workOrders = [], isLoading: ordersLoading } = useGetAllWorkOrders();
  const { data: isSubscribed, isLoading: subLoading } = useIsSubscribedToJobAlerts();
  const applyMutation = useApplyToWorkOrder();
  const subscribeMutation = useSubscribeToJobAlerts();
  const [selectedWorkOrderId, setSelectedWorkOrderId] = reactExports.useState(
    null
  );
  const [applyDialogOpen, setApplyDialogOpen] = reactExports.useState(false);
  const [applicationConfirmed, setApplicationConfirmed] = reactExports.useState(false);
  const openJobs = workOrders.filter((wo) => wo.status === "open");
  const selectedOrder = workOrders.find((wo) => wo.id === selectedWorkOrderId);
  const handleApplyClick = (workOrderId) => {
    if (!isAuthenticated) {
      ue.error("Please log in to apply for jobs.");
      return;
    }
    setSelectedWorkOrderId(workOrderId);
    setApplicationConfirmed(false);
    setApplyDialogOpen(true);
  };
  const handleApplyConfirm = async () => {
    if (!selectedWorkOrderId) return;
    try {
      await applyMutation.mutateAsync({ workOrderId: selectedWorkOrderId });
      ue.success("Application Confirmed! You're on the waiting list.", {
        duration: 4e3,
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PartyPopper, { className: "w-4 h-4 text-green-500" })
      });
      setApplicationConfirmed(true);
    } catch (err) {
      ue.error((err == null ? void 0 : err.message) ?? "Failed to submit application.");
    }
  };
  const handleDialogClose = () => {
    setApplyDialogOpen(false);
    setSelectedWorkOrderId(null);
    setApplicationConfirmed(false);
  };
  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      ue.error("Please log in to subscribe to job alerts.");
      login();
      return;
    }
    try {
      await subscribeMutation.mutateAsync();
      ue.success("Successfully subscribed to job alerts!", {
        duration: 2e3,
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "text-green-500 w-4 h-4" })
      });
    } catch (err) {
      const msg = (err == null ? void 0 : err.message) ?? "Failed to subscribe to job alerts.";
      if (msg.includes("already subscribed")) {
        ue.info("You are already subscribed to job alerts.");
      } else {
        ue.error(msg, { duration: 2e3 });
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "w-8 h-8 text-primary" }),
          "Job Board"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Browse open service requests and apply to work on them." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 text-xs font-medium w-fit", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "w-3.5 h-3.5" }),
          "Any ITI Course Learning Accepted — All qualified workers welcome!"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: !subLoading && isSubscribed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-4 h-4" }),
        "Alerts Active"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: handleSubscribe,
          disabled: subscribeMutation.isPending || subLoading,
          className: "flex items-center gap-2",
          "data-ocid": "jobboard.subscribe.button",
          children: [
            subscribeMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-4 h-4" }),
            subscribeMutation.isPending ? "Subscribing..." : "Get Job Alerts"
          ]
        }
      ) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto px-4 py-8", children: ordersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center py-20",
        "data-ocid": "jobboard.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary" })
      }
    ) : openJobs.length === 0 ? (
      /* Empty State */
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-16 text-center",
          "data-ocid": "jobboard.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-10 h-10 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-foreground mb-2", children: "No Open Jobs Right Now" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-md mb-6", children: "There are no open service requests at the moment." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-md mb-4 p-4 rounded-xl border border-primary/30 bg-primary/5 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-5 h-5 text-primary mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: "Subscribe to Job Alerts" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Subscribe to job alerts so we can notify you the moment new jobs are posted. Be the first to know and grab the opportunity!" }),
                !isSubscribed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    onClick: handleSubscribe,
                    disabled: subscribeMutation.isPending,
                    className: "mt-3 flex items-center gap-2",
                    "data-ocid": "jobboard.subscribe.primary_button",
                    children: [
                      subscribeMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-3.5 h-3.5" }),
                      subscribeMutation.isPending ? "Subscribing..." : "Subscribe to Job Alerts"
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-3 text-green-600 dark:text-green-400 text-sm font-medium", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
                  "You're subscribed! We'll notify you of new jobs."
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-md p-4 rounded-xl border border-green-500/30 bg-green-500/5 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: "Already Applied? No Worries!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Your application is confirmed and you're on the waiting list. We'll alert you as soon as a job becomes available for you." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 w-fit", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 text-green-600 dark:text-green-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-green-700 dark:text-green-300", children: "Application Confirmed — Waiting List" })
                ] })
              ] })
            ] }) })
          ]
        }
      )
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: openJobs.length }),
        " ",
        "open ",
        openJobs.length === 1 ? "job" : "jobs",
        " available"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: openJobs.map((job, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        JobCard,
        {
          job,
          index: idx + 1,
          isAuthenticated,
          onApply: () => handleApplyClick(job.id)
        },
        job.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: applyDialogOpen, onOpenChange: handleDialogClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "data-ocid": "jobboard.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: applicationConfirmed ? "Application Confirmed!" : "Apply for Job" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: applicationConfirmed ? "You have been added to the workers waiting list." : "You are about to apply for the following service request." })
      ] }),
      applicationConfirmed ? (
        /* Success State */
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center py-4 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PartyPopper, { className: "w-8 h-8 text-green-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg text-foreground", children: "You're on the Waiting List!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs", children: "Your application is confirmed. You have been added to the workers waiting list. We will alert you when the job is assigned to you." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-green-500/5 border border-green-500/20 flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-4 h-4 text-green-500 shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Job Alert:" }),
              " You will receive an alert as soon as this job is assigned to you. No need to keep checking — we'll notify you!"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleDialogClose,
              className: "w-full",
              "data-ocid": "jobboard.confirm_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 mr-2" }),
                "Got it, I'm on the list!"
              ]
            }
          ) })
        ] })
      ) : (
        /* Apply State */
        /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          selectedOrder && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-lg bg-muted/50 border border-border space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: selectedOrder.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: selectedOrder.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5" }),
                selectedOrder.location
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PriorityBadge, { priority: selectedOrder.priority }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: selectedOrder.status })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3 rounded-lg bg-green-500/5 border border-green-500/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "w-4 h-4 text-green-600 shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Any ITI Course Accepted." }),
                " ",
                "All ITI course graduates are welcome to apply for this job."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-primary shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Your application will be reviewed. Once confirmed, you'll be added to the workers waiting list and alerted when assigned." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: handleDialogClose,
                disabled: applyMutation.isPending,
                "data-ocid": "jobboard.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleApplyConfirm,
                disabled: applyMutation.isPending,
                "data-ocid": "jobboard.submit_button",
                children: applyMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }),
                  "Submitting..."
                ] }) : "Confirm Application"
              }
            )
          ] })
        ] })
      )
    ] }) })
  ] });
}
function JobCard({ job, index, isAuthenticated, onApply }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "hover:border-primary/40 transition-colors",
      "data-ocid": `jobboard.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg leading-tight", children: job.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "mt-1 line-clamp-2", children: job.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-primary", children: "₹50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Fixed Price" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5" }),
              job.location
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
              formatDate(job.createdAt)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PriorityBadge, { priority: job.priority }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: job.status }),
              job.preferredEducation ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  variant: "outline",
                  className: "text-xs flex items-center gap-1 border-green-500/40 text-green-700 dark:text-green-400",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "w-3 h-3" }),
                    "Any ITI Course Accepted"
                  ]
                }
              ) : null
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                onClick: onApply,
                disabled: !isAuthenticated,
                className: "shrink-0 font-semibold",
                title: !isAuthenticated ? "Log in to apply" : "Apply for this job",
                "data-ocid": `jobboard.item.${index}`,
                children: "Apply Now"
              }
            )
          ] }),
          !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Please log in to apply for jobs." })
        ] })
      ]
    }
  );
}
export {
  JobBoard as default
};
