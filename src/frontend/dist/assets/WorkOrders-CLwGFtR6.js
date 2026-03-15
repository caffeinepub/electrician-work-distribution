import { c as createLucideIcon, g as useGetAllWorkOrders, q as useGetAllElectricians, s as useUpdateWorkOrderStatus, t as useAssignElectricianToWorkOrder, r as reactExports, j as jsxRuntimeExports, L as LoaderCircle, C as ClipboardList, B as Button, d as ue } from "./index-DuXxNtqE.js";
import { B as Badge } from "./badge-DLaFdFAq.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-CdMSN0Jv.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-N5mR9zOG.js";
import { L as Label } from "./label-u8LAFSpM.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-j5e_CqrF.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent, C as CircleX } from "./tabs-ifBLDx5p.js";
import { P as PaymentStatusBadge } from "./PaymentStatusBadge-DJxr_wBZ.js";
import { P as PriorityBadge } from "./PriorityBadge-CnEiHtqt.js";
import { S as StatusBadge } from "./StatusBadge-CKQqFeYR.js";
import { M as MapPin } from "./map-pin-DMiWtppM.js";
import { M as Mail } from "./mail-BPyAV_OI.js";
import { I as IndianRupee } from "./indian-rupee-Clxg2B10.js";
import { C as CircleCheck } from "./circle-check-BzGhkgnG.js";
import { C as CircleAlert } from "./circle-alert-I-DdmSi8.js";
import "./index-CCnJQYgY.js";
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
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = createLucideIcon("user-check", __iconNode);
function WorkOrders() {
  const { data: workOrders = [], isLoading } = useGetAllWorkOrders();
  const { data: electricians = [] } = useGetAllElectricians();
  const updateStatusMutation = useUpdateWorkOrderStatus();
  const assignMutation = useAssignElectricianToWorkOrder();
  const [assignDialogOpen, setAssignDialogOpen] = reactExports.useState(false);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = reactExports.useState(
    null
  );
  const [selectedElectricianId, setSelectedElectricianId] = reactExports.useState("");
  const allOrders = workOrders;
  const pendingOrders = workOrders.filter(
    (wo) => wo.status === "open" && wo.verificationStatus === "pending"
  );
  const assignmentQueue = workOrders.filter(
    (wo) => wo.status === "open" && (wo.applicationStatus === "verifiedPendingAssignment" || wo.verificationStatus === "approved")
  );
  const activeOrders = workOrders.filter((wo) => wo.status === "inProgress");
  const openAssignDialog = (workOrderId) => {
    setSelectedWorkOrderId(workOrderId);
    setSelectedElectricianId("");
    setAssignDialogOpen(true);
  };
  const handleAssignWorker = async () => {
    if (!selectedWorkOrderId || !selectedElectricianId) {
      ue.error("Please select an electrician.");
      return;
    }
    try {
      await assignMutation.mutateAsync({
        workOrderId: selectedWorkOrderId,
        electricianId: BigInt(selectedElectricianId)
      });
      ue.success("Worker assigned successfully!");
      setAssignDialogOpen(false);
      setSelectedWorkOrderId(null);
      setSelectedElectricianId("");
    } catch (err) {
      ue.error((err == null ? void 0 : err.message) ?? "Failed to assign worker.");
    }
  };
  const handleStatusChange = async (id, status) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
      ue.success(`Order status updated to ${status}.`);
    } catch (err) {
      ue.error((err == null ? void 0 : err.message) ?? "Failed to update status.");
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-8 h-8 text-primary" }),
        "Work Orders"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Manage and assign service requests." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "all", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "all", children: [
          "All Orders",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-2 text-xs", children: allOrders.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "verify", children: [
          "Verify Application",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-2 text-xs", children: pendingOrders.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "assign", children: [
          "Assignment Queue",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-2 text-xs", children: assignmentQueue.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "active", children: [
          "Active",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-2 text-xs", children: activeOrders.length })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "all", children: allOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No work orders found." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: allOrders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        WorkOrderCard,
        {
          order,
          electricians,
          onAssign: openAssignDialog,
          onStatusChange: handleStatusChange,
          showAssignButton: order.status === "open"
        },
        order.id
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "verify", children: pendingOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No pending applications to verify." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: pendingOrders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        WorkOrderCard,
        {
          order,
          electricians,
          onAssign: openAssignDialog,
          onStatusChange: handleStatusChange,
          showAssignButton: false
        },
        order.id
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "assign", children: assignmentQueue.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No orders in the assignment queue." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: assignmentQueue.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        WorkOrderCard,
        {
          order,
          electricians,
          onAssign: openAssignDialog,
          onStatusChange: handleStatusChange,
          showAssignButton: true
        },
        order.id
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "active", children: activeOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No active orders." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: activeOrders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        WorkOrderCard,
        {
          order,
          electricians,
          onAssign: openAssignDialog,
          onStatusChange: handleStatusChange,
          showAssignButton: false
        },
        order.id
      )) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: assignDialogOpen, onOpenChange: setAssignDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-5 h-5 text-primary" }),
          "Assign Worker"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Select an electrician to assign to this work order." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Select Electrician" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: selectedElectricianId,
              onValueChange: setSelectedElectricianId,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose an electrician..." }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: electricians.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", disabled: true, children: "No electricians available" }) : electricians.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(e.id), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: e.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    e.specialist,
                    " •",
                    " ",
                    e.isAvailable ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-500", children: "Available" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: "Unavailable" })
                  ] })
                ] }) }, String(e.id))) })
              ]
            }
          )
        ] }),
        selectedElectricianId && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-lg bg-primary/5 border border-primary/20", children: (() => {
          const e = electricians.find(
            (el) => String(el.id) === selectedElectricianId
          );
          if (!e) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: e.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: e.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: e.address }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: e.specialist }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `text-xs ${e.isAvailable ? "text-green-500 border-green-500/30" : "text-red-400 border-red-400/30"}`,
                  children: e.isAvailable ? "Available" : "Unavailable"
                }
              )
            ] })
          ] });
        })() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setAssignDialogOpen(false),
            disabled: assignMutation.isPending,
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleAssignWorker,
            disabled: assignMutation.isPending || !selectedElectricianId,
            children: assignMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }),
              "Assigning..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-4 h-4 mr-2" }),
              "Assign Worker"
            ] })
          }
        )
      ] })
    ] }) })
  ] });
}
function WorkOrderCard({
  order,
  electricians,
  onAssign,
  onStatusChange,
  showAssignButton
}) {
  const assignedElectrician = order.issuedElectrician ? electricians.find((e) => Number(e.id) === order.issuedElectrician) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "hover:border-primary/30 transition-colors", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base leading-tight", children: [
          "#",
          order.id,
          " — ",
          order.title
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 line-clamp-2", children: order.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 flex items-center gap-2 flex-wrap justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PriorityBadge, { priority: order.priority }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: order.status })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 shrink-0" }),
          order.location
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5 shrink-0" }),
          order.customerEmail
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3.5 h-3.5 shrink-0" }),
          order.customerContactNumber
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-3.5 h-3.5 shrink-0" }),
          "₹",
          order.paymentAmount,
          " —",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentStatusBadge, { status: order.paymentStatus })
        ] })
      ] }),
      assignedElectrician && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4 p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-4 h-4 text-green-500 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-green-400 font-medium", children: [
          "Assigned to: ",
          assignedElectrician.name
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          order.verificationStatus === "approved" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: "text-xs text-green-400 border-green-400/30",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3 mr-1" }),
                "Verified"
              ]
            }
          ),
          order.verificationStatus === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: "text-xs text-amber-400 border-amber-400/30",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3 mr-1" }),
                "Pending Verification"
              ]
            }
          ),
          order.applicationStatus === "verifiedPendingAssignment" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "text-xs text-blue-400 border-blue-400/30",
              children: "Ready to Assign"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          order.status === "inProgress" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => onStatusChange(order.id, "completed"),
              className: "text-green-400 border-green-400/30 hover:bg-green-400/10",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 mr-1" }),
                "Complete"
              ]
            }
          ),
          order.status === "open" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => onStatusChange(order.id, "cancelled"),
              className: "text-red-400 border-red-400/30 hover:bg-red-400/10",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 mr-1" }),
                "Cancel"
              ]
            }
          ),
          showAssignButton && !order.issuedElectrician && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              onClick: () => onAssign(order.id),
              className: "font-semibold",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-3.5 h-3.5 mr-1" }),
                "Assign Worker"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function EmptyState({ message }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-7 h-7 text-muted-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: message })
  ] });
}
export {
  WorkOrders as default
};
