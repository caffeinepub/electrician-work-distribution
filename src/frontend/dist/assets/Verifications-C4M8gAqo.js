import { r as reactExports, j as jsxRuntimeExports, S as ShieldCheck, C as ClipboardList, U as Users, d as ue, L as Label, I as Input, b as Button, f as LoaderCircle, R as React, M as Mail } from "./index-DT4hGqI0.js";
import { B as Badge } from "./badge-B6MCZdEA.js";
import { v as usePendingWorkOrders, w as usePendingElectricians, x as usePendingJobApplications, y as usePendingPayments, z as useApproveWorkOrder, A as useRejectWorkOrder, B as useApproveElectrician, D as useRejectElectrician, E as useRejectJobApplication, F as usePendingJobApplicationsFull, G as useApproveJobApplicationFull, H as useRejectJobApplicationFull, I as useApprovePayment, J as useFlagPayment, C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./useQueries-DkbzSMcZ.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BQjGPYfq.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent, P as PaymentStatusBadge } from "./PaymentStatusBadge-CNLdkHJt.js";
import { S as StatusBadge } from "./StatusBadge-ByNQaAKR.js";
import { d as getSpecialityLabel, e as getQualificationLabel } from "./helpers-BNKG4l1e.js";
import { I as IndianRupee } from "./indian-rupee-Bjder2c0.js";
import { C as CircleCheck } from "./circle-check-BOhPN_lY.js";
import { M as MapPin } from "./map-pin-Dnu3-KF1.js";
import { C as CircleX } from "./circle-x-D5A39vmn.js";
import { C as CircleAlert } from "./circle-alert-DVl3mOZJ.js";
import "./index-BUYIiYu8.js";
import "./index-r_yBevHi.js";
function Verifications() {
  const { data: pendingWorkOrders = [], isLoading: woLoading } = usePendingWorkOrders();
  const { data: pendingElectricians = [], isLoading: elLoading } = usePendingElectricians();
  const { data: pendingJobApps = [] } = usePendingJobApplications();
  const { data: pendingPayments = [], isLoading: ppLoading } = usePendingPayments();
  const approveWO = useApproveWorkOrder();
  const rejectWO = useRejectWorkOrder();
  const approveEl = useApproveElectrician();
  const rejectEl = useRejectElectrician();
  const rejectJA = useRejectJobApplication();
  const { data: pendingJobAppsFull = [], isLoading: jaFullLoading } = usePendingJobApplicationsFull();
  const approveJAFull = useApproveJobApplicationFull();
  const rejectJAFull = useRejectJobApplicationFull();
  const approveP = useApprovePayment();
  const flagP = useFlagPayment();
  const [rejectDialog, setRejectDialog] = reactExports.useState({ open: false, type: "workOrder", id: 0, reason: "" });
  const openRejectDialog = (type, id) => {
    setRejectDialog({ open: true, type, id, reason: "" });
  };
  const handleRejectConfirm = async () => {
    const { type, id, reason } = rejectDialog;
    try {
      if (type === "workOrder") {
        await rejectWO.mutateAsync({ id, reason });
        ue.success("Work order rejected.");
      } else if (type === "electrician") {
        await rejectEl.mutateAsync({ id, reason });
        ue.success("Electrician rejected.");
      } else if (type === "jobApp") {
        await rejectJA.mutateAsync({ id, reason });
        ue.success("Job application rejected.");
      } else if (type === "jobAppFull") {
        await rejectJAFull.mutateAsync({ id, reason });
        ue.success("Job application rejected.");
      } else if (type === "payment") {
        await flagP.mutateAsync({ id, reason });
        ue.success("Payment flagged.");
      }
      setRejectDialog({ open: false, type: "workOrder", id: 0, reason: "" });
    } catch (err) {
      ue.error((err == null ? void 0 : err.message) ?? "Action failed.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-8 h-8 text-primary" }),
        "Verifications"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Review and approve pending items across all categories." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "jobApps", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-6 flex-wrap h-auto gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "workOrders", className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-3.5 h-3.5" }),
          "Work Orders",
          pendingWorkOrders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-1 text-xs", children: pendingWorkOrders.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "electricians",
            className: "flex items-center gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
              "Electricians",
              pendingElectricians.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-1 text-xs", children: pendingElectricians.length })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "jobApps", className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-3.5 h-3.5" }),
          "Job Applications",
          pendingJobApps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-1 text-xs", children: pendingJobApps.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "payments", className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-3.5 h-3.5" }),
          "Payments",
          pendingPayments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-1 text-xs", children: pendingPayments.length })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "workOrders", children: woLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingState, {}) : pendingWorkOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No pending work orders." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: pendingWorkOrders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        WorkOrderVerifyCard,
        {
          order,
          onApprove: async () => {
            try {
              await approveWO.mutateAsync({ id: order.id });
              ue.success("Work order approved!");
            } catch (err) {
              ue.error((err == null ? void 0 : err.message) ?? "Failed to approve.");
            }
          },
          onReject: () => openRejectDialog("workOrder", order.id),
          isApproving: approveWO.isPending
        },
        order.id
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "electricians", children: elLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingState, {}) : pendingElectricians.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No pending electrician verifications." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: pendingElectricians.map((electrician) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ElectricianVerifyCard,
        {
          electrician,
          onApprove: async () => {
            try {
              await approveEl.mutateAsync({ id: electrician.id });
              ue.success("Electrician approved!");
            } catch (err) {
              ue.error((err == null ? void 0 : err.message) ?? "Failed to approve.");
            }
          },
          onReject: () => openRejectDialog("electrician", electrician.id),
          isApproving: approveEl.isPending
        },
        String(electrician.id)
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "jobApps", children: jaFullLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingState, {}) : pendingJobAppsFull.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No pending job applications." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: pendingJobAppsFull.map((app) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        JobAppFullCard,
        {
          app,
          onApprove: async () => {
            try {
              await approveJAFull.mutateAsync(app.id);
              ue.success("Job application approved!");
            } catch (err) {
              ue.error(
                (err == null ? void 0 : err.message) ?? `Cannot approve: ${(err == null ? void 0 : err.message) ?? "Failed."}`
              );
            }
          },
          onReject: () => openRejectDialog("jobAppFull", app.id),
          isApproving: approveJAFull.isPending
        },
        app.id
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "payments", children: ppLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingState, {}) : pendingPayments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No pending payments." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: pendingPayments.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        PaymentVerifyCard,
        {
          order,
          onApprove: async () => {
            try {
              await approveP.mutateAsync({ id: order.id });
              ue.success("Payment confirmed!");
            } catch (err) {
              ue.error((err == null ? void 0 : err.message) ?? "Failed to confirm.");
            }
          },
          onFlag: () => openRejectDialog("payment", order.id),
          isApproving: approveP.isPending
        },
        order.id
      )) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: rejectDialog.open,
        onOpenChange: (open) => setRejectDialog({ open, type: "workOrder", id: 0, reason: "" }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: rejectDialog.type === "payment" ? "Flag Payment" : "Reject Item" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Please provide a reason for this action." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Reason" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: rejectDialog.reason,
                onChange: (e) => setRejectDialog({ ...rejectDialog, reason: e.target.value }),
                placeholder: "Enter reason..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setRejectDialog({
                  open: false,
                  type: "workOrder",
                  id: 0,
                  reason: ""
                }),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "destructive",
                onClick: handleRejectConfirm,
                disabled: rejectWO.isPending || rejectEl.isPending || rejectJA.isPending || flagP.isPending,
                children: rejectDialog.type === "payment" ? "Flag" : "Reject"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function LoadingState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary" }) });
}
function EmptyState({ message }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-12 h-12 text-muted-foreground mb-4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: message })
  ] });
}
function WorkOrderVerifyCard({
  order,
  onApprove,
  onReject,
  isApproving
}) {
  const [confirmed, setConfirmed] = React.useState(false);
  const handleApprove = async () => {
    await onApprove();
    setConfirmed(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-white text-gray-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base", children: [
          "#",
          order.id,
          " — ",
          order.title
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: order.status })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: order.description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 text-sm text-muted-foreground mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5" }),
          order.location
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5" }),
          order.customerEmail
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-3.5 h-3.5" }),
          "₹",
          order.paymentAmount
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        confirmed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-green-500 text-white px-3 py-1 text-sm flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
          "✓ Job Confirmed"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: handleApprove,
            disabled: isApproving,
            className: "text-green-400 border-green-400/30 bg-green-400/10 hover:bg-green-400/20",
            variant: "outline",
            children: [
              isApproving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 mr-1" }),
              "Approve"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: onReject,
            className: "text-red-400 border-red-400/30 hover:bg-red-400/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 mr-1" }),
              "Reject"
            ]
          }
        )
      ] })
    ] })
  ] });
}
function ElectricianVerifyCard({
  electrician,
  onApprove,
  onReject,
  isApproving
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-white text-gray-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: electrician.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "outline",
          className: "text-xs text-amber-400 border-amber-400/30",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3 mr-1" }),
            "Pending"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 text-sm text-muted-foreground mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5" }),
          electrician.email
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5" }),
          electrician.address
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: getSpecialityLabel(electrician.specialist) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: getQualificationLabel(electrician.qualification) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: onApprove,
            disabled: isApproving,
            className: "text-green-400 border-green-400/30 bg-green-400/10 hover:bg-green-400/20",
            variant: "outline",
            children: [
              isApproving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 mr-1" }),
              "Approve"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: onReject,
            className: "text-red-400 border-red-400/30 hover:bg-red-400/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 mr-1" }),
              "Reject"
            ]
          }
        )
      ] })
    ] })
  ] });
}
function PaymentVerifyCard({
  order,
  onApprove,
  onFlag,
  isApproving
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base", children: [
        "#",
        order.id,
        " — ",
        order.title
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentStatusBadge, { status: order.paymentStatus })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 text-sm text-muted-foreground mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-3.5 h-3.5" }),
          "₹",
          order.paymentAmount
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: order.paymentMethod }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5" }),
          order.customerEmail
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: onApprove,
            disabled: isApproving,
            className: "text-green-400 border-green-400/30 bg-green-400/10 hover:bg-green-400/20",
            variant: "outline",
            children: [
              isApproving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 mr-1" }),
              "Confirm"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: onFlag,
            className: "text-amber-400 border-amber-400/30 hover:bg-amber-400/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5 mr-1" }),
              "Flag"
            ]
          }
        )
      ] })
    ] })
  ] });
}
function calcAge(dob) {
  const d = new Date(dob);
  const today = /* @__PURE__ */ new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || m === 0 && today.getDate() < d.getDate()) age--;
  return age;
}
function JobAppFullCard({
  app,
  onApprove,
  onReject,
  isApproving
}) {
  const [confirmed, setConfirmed] = React.useState(false);
  const age = calcAge(app.dob);
  const handleApprove = async () => {
    await onApprove();
    setConfirmed(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-white text-gray-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base", children: [
          "#",
          app.id,
          " — ",
          app.fullName
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              className: age >= 19 ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300",
              variant: "outline",
              children: [
                "Age: ",
                age,
                " yrs ",
                age < 19 && "⚠️ Under 19"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "text-amber-600 border-amber-400/50",
              children: "Pending"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "DOB: ",
        app.dob,
        " · Father: ",
        app.fatherName
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5" }),
          app.gmailId
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "📱 ",
          app.mobileNo
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "🎓 ",
          app.academicQualification
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "💼 Exp: ",
          app.workExperience || "N/A"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "⏱ ",
          app.workingTime,
          " hrs/day · ",
          app.jobType
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "₹",
          app.salaryPerMonth,
          "/mo · ₹",
          app.salaryPerWeek,
          "/wk · ₹",
          app.salaryPerDay,
          "/day"
        ] }),
        app.otherQualification && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-2", children: [
          "Other: ",
          app.otherQualification
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3 inline mr-1" }),
          app.addressLine1,
          app.addressLine2 ? `, ${app.addressLine2}` : ""
        ] })
      ] }),
      age < 19 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 flex-shrink-0" }),
        "Applicant is under 19 years old and cannot be approved."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        confirmed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-green-500 text-white px-3 py-1 text-sm flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
          "✓ Job Confirmed"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: handleApprove,
            disabled: isApproving || age < 19,
            className: "text-green-400 border-green-400/30 bg-green-400/10 hover:bg-green-400/20 disabled:opacity-50",
            variant: "outline",
            children: [
              isApproving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 mr-1" }),
              "Approve"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: onReject,
            className: "text-red-400 border-red-400/30 hover:bg-red-400/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 mr-1" }),
              "Reject"
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  Verifications as default
};
