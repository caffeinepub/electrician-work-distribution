import { j as jsxRuntimeExports, l as getApplicationStatusLabel, m as getApplicationStatusClass, n as useGetCurrentUserWorkOrders, o as useSubmitWorkerRating, r as reactExports, L as LoaderCircle, B as Button, d as ue } from "./index-DuXxNtqE.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-CdMSN0Jv.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-N5mR9zOG.js";
import { L as Label } from "./label-u8LAFSpM.js";
import { T as Textarea } from "./textarea-BpkjpKyk.js";
import { S as StatusBadge } from "./StatusBadge-CKQqFeYR.js";
import { C as CalendarCheck } from "./calendar-check-CtMZkNr2.js";
import { C as Clock } from "./clock-hLj-ctrn.js";
import { C as CircleCheck } from "./circle-check-BzGhkgnG.js";
import { S as Star } from "./star-BLHjtetm.js";
function ApplicationStatusBadge({
  status
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge ${getApplicationStatusClass(status)}`, children: getApplicationStatusLabel(status) });
}
function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}
function MyBookings() {
  const { data: workOrders = [], isLoading } = useGetCurrentUserWorkOrders();
  const submitRatingMutation = useSubmitWorkerRating();
  const [ratingDialog, setRatingDialog] = reactExports.useState({ open: false, orderId: null });
  const [ratingValue, setRatingValue] = reactExports.useState(5);
  const [ratingComment, setRatingComment] = reactExports.useState("");
  const ongoingOrders = workOrders.filter(
    (wo) => wo.status === "open" || wo.status === "inProgress"
  );
  const pastOrders = workOrders.filter(
    (wo) => wo.status === "completed" || wo.status === "cancelled"
  );
  const handleSubmitRating = async () => {
    if (!ratingDialog.orderId) return;
    try {
      await submitRatingMutation.mutateAsync({
        orderId: ratingDialog.orderId,
        rating: ratingValue,
        comment: ratingComment
      });
      ue.success("Rating submitted!");
      setRatingDialog({ open: false, orderId: null });
      setRatingValue(5);
      setRatingComment("");
    } catch (err) {
      ue.error((err == null ? void 0 : err.message) ?? "Failed to submit rating.");
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { className: "w-8 h-8 text-primary" }),
        "My Bookings"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Track your service requests." })
    ] }),
    workOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { className: "w-8 h-8 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-foreground mb-2", children: "No Bookings Yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "You haven't booked any services yet. Browse our services to get started." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
      ongoingOrders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold text-foreground mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-5 h-5 text-amber-400" }),
          "Ongoing Requests (",
          ongoingOrders.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: ongoingOrders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          BookingCard,
          {
            order,
            onRate: () => setRatingDialog({ open: true, orderId: order.id })
          },
          order.id
        )) })
      ] }),
      pastOrders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold text-foreground mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-green-400" }),
          "Past Requests (",
          pastOrders.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: pastOrders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          BookingCard,
          {
            order,
            onRate: () => setRatingDialog({ open: true, orderId: order.id })
          },
          order.id
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: ratingDialog.open,
        onOpenChange: (open) => setRatingDialog({ open, orderId: null }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Rate the Service" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "How was your experience with the technician?" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Rating" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setRatingValue(star),
                  className: "focus:outline-none",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Star,
                    {
                      className: `w-7 h-7 transition-colors ${star <= ratingValue ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`
                    }
                  )
                },
                star
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Comment (optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  value: ratingComment,
                  onChange: (e) => setRatingComment(e.target.value),
                  placeholder: "Share your experience...",
                  rows: 3
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setRatingDialog({ open: false, orderId: null }),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: handleSubmitRating,
                disabled: submitRatingMutation.isPending,
                children: [
                  submitRatingMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : null,
                  "Submit Rating"
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function BookingCard({ order, onRate }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "hover:border-primary/30 transition-colors", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base", children: [
          "#",
          order.id,
          " — ",
          order.title
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: order.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 flex flex-col items-end gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: order.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ApplicationStatusBadge, { status: order.applicationStatus })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(order.createdAt) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-primary", children: [
          "₹",
          order.paymentAmount
        ] })
      ] }),
      order.status === "completed" && !order.workerRating && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          variant: "outline",
          className: "mt-3 w-full",
          onClick: onRate,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3.5 h-3.5 mr-1" }),
            "Rate this Service"
          ]
        }
      ),
      order.status === "completed" && order.workerRating && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-1 text-sm text-amber-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3.5 h-3.5 fill-amber-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "You rated this service ",
          order.workerRating.rating,
          "/5"
        ] })
      ] })
    ] })
  ] });
}
export {
  MyBookings as default
};
