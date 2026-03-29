import { r as reactExports, j as jsxRuntimeExports, S as ShieldCheck, C as ClipboardList, U as Users, d as ue, L as Label, I as Input, b as Button, f as LoaderCircle, K as React } from "./index-CojzdrZl.js";
import { B as Badge } from "./badge-Bk4E2kyK.js";
import { r as usePendingWorkOrders, s as usePendingElectricians, t as usePendingJobApplications, v as usePendingPayments, w as useApproveWorkOrder, x as useRejectWorkOrder, y as useApproveElectrician, z as useRejectElectrician, A as useApproveJobApplication, B as useRejectJobApplication, D as useApprovePayment, E as useFlagPayment, C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./useQueries-DY1f8-wB.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-DfbYWFlN.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent, C as CircleX } from "./tabs-42mtodcH.js";
import { P as PaymentStatusBadge } from "./PaymentStatusBadge-DdDeeNXa.js";
import { S as StatusBadge } from "./StatusBadge-kenQiSkq.js";
import { d as getSpecialityLabel, e as getQualificationLabel } from "./helpers-BNKG4l1e.js";
import { I as IndianRupee } from "./indian-rupee-ndInwIL2.js";
import { C as CircleCheck } from "./circle-check-Dz1_ocUU.js";
import { M as MapPin } from "./map-pin-DbUMEA64.js";
import { M as Mail } from "./mail-R52affIC.js";
import { C as CircleAlert } from "./index-BUJzucdB.js";
import "./index-4434lWAG.js";
function Verifications() {
  const { data: pendingWorkOrders = [], isLoading: woLoading } = usePendingWorkOrders();
  const { data: pendingElectricians = [], isLoading: elLoading } = usePendingElectricians();
  const { data: pendingJobApps = [], isLoading: jaLoading } = usePendingJobApplications();
  const { data: pendingPayments = [], isLoading: ppLoading } = usePendingPayments();
  const approveWO = useApproveWorkOrder();
  const rejectWO = useRejectWorkOrder();
  const approveEl = useApproveElectrician();
  const rejectEl = useRejectElectrician();
  const approveJA = useApproveJobApplication();
  const rejectJA = useRejectJobApplication();
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "jobApps", children: jaLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingState, {}) : pendingJobApps.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No pending job applications." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: pendingJobApps.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        WorkOrderVerifyCard,
        {
          order,
          onApprove: async () => {
            try {
              await approveJA.mutateAsync({ id: order.id });
              ue.success("Job application approved!");
            } catch (err) {
              ue.error((err == null ? void 0 : err.message) ?? "Failed to approve.");
            }
          },
          onReject: () => openRejectDialog("jobApp", order.id),
          isApproving: approveJA.isPending
        },
        order.id
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
export {
  Verifications as default
};
