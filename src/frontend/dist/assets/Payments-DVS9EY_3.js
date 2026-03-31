import { c as createLucideIcon, j as jsxRuntimeExports, n as cn, r as reactExports, R as React, f as LoaderCircle, b as Button, L as Label, I as Input, d as ue } from "./index-DT4hGqI0.js";
import { B as Badge } from "./badge-B6MCZdEA.js";
import { e as useGetAllWorkOrders, r as useUpdateWorkOrderPayment, s as useGetCashTransfers, t as useAddCashTransfer, C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./useQueries-DkbzSMcZ.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BQjGPYfq.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-B0jpU4LC.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent, P as PaymentStatusBadge } from "./PaymentStatusBadge-CNLdkHJt.js";
import { f as formatTimestamp } from "./helpers-BNKG4l1e.js";
import { I as IndianRupee } from "./indian-rupee-Bjder2c0.js";
import { C as CircleCheck } from "./circle-check-BOhPN_lY.js";
import { C as Clock } from "./clock-BadqGE9p.js";
import { P as Pencil } from "./pencil-BAYIT5Aw.js";
import "./index-r_yBevHi.js";
import "./index-BUYIiYu8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 8v8", key: "napkw2" }],
  ["path", { d: "m8 12 4 4 4-4", key: "k98ssh" }]
];
const CircleArrowDown = createLucideIcon("circle-arrow-down", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m16 12-4-4-4 4", key: "177agl" }],
  ["path", { d: "M12 16V8", key: "1sbj14" }]
];
const CircleArrowUp = createLucideIcon("circle-arrow-up", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode);
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "table",
        {
          "data-slot": "table",
          className: cn("w-full caption-bottom text-sm", className),
          ...props
        }
      )
    }
  );
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function makePaymentStatus(kind, flagReason) {
  if (kind === "flagged") {
    return { __kind__: "flagged", flagged: flagReason ?? "" };
  }
  return { __kind__: kind };
}
function Payments() {
  const { data: workOrders = [], isLoading } = useGetAllWorkOrders();
  const updatePaymentMutation = useUpdateWorkOrderPayment();
  const [editDialog, setEditDialog] = reactExports.useState({
    open: false,
    orderId: null,
    status: "pending",
    amount: "",
    flagReason: ""
  });
  const totalRevenue = workOrders.filter((wo) => wo.paymentStatus.__kind__ === "confirmed").reduce((sum, wo) => sum + wo.paymentAmount, 0);
  const pendingCount = workOrders.filter(
    (wo) => wo.paymentStatus.__kind__ === "pending"
  ).length;
  const paidCount = workOrders.filter(
    (wo) => wo.paymentStatus.__kind__ === "paid"
  ).length;
  const openEditDialog = (order) => {
    setEditDialog({
      open: true,
      orderId: order.id,
      status: order.paymentStatus.__kind__,
      amount: String(order.paymentAmount),
      flagReason: order.paymentStatus.__kind__ === "flagged" ? order.paymentStatus.flagged ?? "" : ""
    });
  };
  const handleSave = async () => {
    if (editDialog.orderId === null) return;
    try {
      await updatePaymentMutation.mutateAsync({
        id: editDialog.orderId,
        paymentStatus: makePaymentStatus(
          editDialog.status,
          editDialog.flagReason
        ),
        paymentAmount: Number(editDialog.amount)
      });
      ue.success("Payment updated successfully!");
      setEditDialog({
        open: false,
        orderId: null,
        status: "pending",
        amount: "",
        flagReason: ""
      });
    } catch (err) {
      ue.error((err == null ? void 0 : err.message) ?? "Failed to update payment.");
    }
  };
  const { data: cashTransfers = [] } = useGetCashTransfers();
  const addCashTransfer = useAddCashTransfer();
  const [transferDialog, setTransferDialog] = React.useState({
    open: false,
    amount: "",
    note: "",
    transferType: "incoming",
    upiId: "8015393383@fam",
    status: "completed"
  });
  const totalIncoming = cashTransfers.filter((t) => t.transferType === "incoming" && t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const totalOutgoing = cashTransfers.filter((t) => t.transferType === "outgoing" && t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const netBalance = totalIncoming - totalOutgoing;
  const handleAddTransfer = async () => {
    if (!transferDialog.amount || Number(transferDialog.amount) <= 0) {
      ue.error("Please enter a valid amount.");
      return;
    }
    try {
      await addCashTransfer.mutateAsync({
        amount: Number(transferDialog.amount),
        note: transferDialog.note,
        date: (/* @__PURE__ */ new Date()).toISOString(),
        transferType: transferDialog.transferType,
        upiId: transferDialog.upiId,
        status: transferDialog.status
      });
      ue.success("Transfer recorded!");
      setTransferDialog({
        open: false,
        amount: "",
        note: "",
        transferType: "incoming",
        upiId: "8015393383@fam",
        status: "completed"
      });
    } catch (err) {
      ue.error((err == null ? void 0 : err.message) ?? "Failed to record transfer.");
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-8 h-8 text-primary" }),
        "Payments"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Manage and track all service payments." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-8 h-8 text-green-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold text-foreground", children: [
            "₹",
            totalRevenue
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Confirmed Revenue" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-8 h-8 text-amber-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground", children: pendingCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Pending Payments" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-8 h-8 text-blue-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground", children: paidCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Paid (Awaiting Confirmation)" })
        ] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "payments", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "payments", "data-ocid": "payments.tab", children: "All Payments" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "cash", "data-ocid": "cash.tab", children: "Cash Transfer History" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "payments", children: workOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-12 h-12 text-muted-foreground mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No payments to display." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "All Payments" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Order" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Method" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: workOrders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-medium", children: [
              "#",
              order.id,
              " — ",
              order.title
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-muted-foreground text-sm", children: [
              formatTimestamp(order.createdAt),
              " ·",
              " ",
              order.paymentMethod
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-semibold text-primary", children: [
              "₹",
              order.paymentAmount
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground text-sm", children: order.paymentMethod }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentStatusBadge, { status: order.paymentStatus }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                onClick: () => openEditDialog(order),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
              }
            ) })
          ] }, order.id)) })
        ] }) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "cash", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowDown, { className: "w-8 h-8 text-green-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold text-foreground", children: [
                "₹",
                totalIncoming
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Incoming" })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { className: "w-8 h-8 text-red-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold text-foreground", children: [
                "₹",
                totalOutgoing
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Outgoing" })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              IndianRupee,
              {
                className: `w-8 h-8 ${netBalance >= 0 ? "text-blue-500" : "text-red-500"}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: `text-2xl font-bold ${netBalance >= 0 ? "text-blue-600" : "text-red-600"}`,
                  children: [
                    "₹",
                    netBalance
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Net Balance" })
            ] })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Transfer Records" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => setTransferDialog({ ...transferDialog, open: true }),
              "data-ocid": "cash.open_modal_button",
              className: "flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "w-4 h-4" }),
                "Record Transfer"
              ]
            }
          )
        ] }),
        cashTransfers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-16 text-center",
            "data-ocid": "cash.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-12 h-12 text-muted-foreground mb-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No cash transfers recorded yet." })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "cash.table", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Note" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "UPI ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: cashTransfers.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-ocid": "cash.row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground", children: new Date(t.date).toLocaleDateString("en-IN") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: t.transferType === "incoming" ? "text-green-700 border-green-400/50 bg-green-50" : "text-red-700 border-red-400/50 bg-red-50",
                children: [
                  t.transferType === "incoming" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowDown, { className: "w-3 h-3 mr-1 inline" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { className: "w-3 h-3 mr-1 inline" }),
                  t.transferType
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-semibold", children: [
              "₹",
              t.amount
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground text-sm", children: t.note || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground text-sm", children: t.upiId || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: t.status === "completed" ? "default" : "secondary",
                children: t.status
              }
            ) })
          ] }, t.id)) })
        ] }) }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: transferDialog.open,
        onOpenChange: (open) => setTransferDialog({ ...transferDialog, open }),
        "data-ocid": "cash.dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Record Cash Transfer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Record an incoming or outgoing cash transfer." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Transfer Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: transferDialog.transferType,
                  onValueChange: (v) => setTransferDialog({
                    ...transferDialog,
                    transferType: v
                  }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "cash.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "incoming", children: "Incoming" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "outgoing", children: "Outgoing" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Amount (₹)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: transferDialog.amount,
                  onChange: (e) => setTransferDialog({
                    ...transferDialog,
                    amount: e.target.value
                  }),
                  placeholder: "Enter amount",
                  min: "0",
                  "data-ocid": "cash.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Note" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: transferDialog.note,
                  onChange: (e) => setTransferDialog({ ...transferDialog, note: e.target.value }),
                  placeholder: "Optional note",
                  "data-ocid": "cash.textarea"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "UPI ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: transferDialog.upiId,
                  onChange: (e) => setTransferDialog({
                    ...transferDialog,
                    upiId: e.target.value
                  }),
                  "data-ocid": "cash.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: transferDialog.status,
                  onValueChange: (v) => setTransferDialog({
                    ...transferDialog,
                    status: v
                  }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "completed", children: "Completed" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pending", children: "Pending" })
                    ] })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setTransferDialog({ ...transferDialog, open: false }),
                "data-ocid": "cash.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: handleAddTransfer,
                disabled: addCashTransfer.isPending,
                "data-ocid": "cash.submit_button",
                children: [
                  addCashTransfer.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : null,
                  "Record"
                ]
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: editDialog.open,
        onOpenChange: (open) => setEditDialog({
          open,
          orderId: null,
          status: "pending",
          amount: "",
          flagReason: ""
        }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Payment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Update the payment status and amount." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Payment Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: editDialog.status,
                  onValueChange: (v) => setEditDialog({
                    ...editDialog,
                    status: v
                  }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pending", children: "Pending" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "paid", children: "Paid" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "confirmed", children: "Confirmed" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "flagged", children: "Flagged" })
                    ] })
                  ]
                }
              )
            ] }),
            editDialog.status === "flagged" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Flag Reason" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: editDialog.flagReason,
                  onChange: (e) => setEditDialog({ ...editDialog, flagReason: e.target.value }),
                  placeholder: "Reason for flagging..."
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Amount (₹)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: editDialog.amount,
                  onChange: (e) => setEditDialog({ ...editDialog, amount: e.target.value }),
                  min: "0"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setEditDialog({
                  open: false,
                  orderId: null,
                  status: "pending",
                  amount: "",
                  flagReason: ""
                }),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: handleSave,
                disabled: updatePaymentMutation.isPending,
                children: [
                  updatePaymentMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : null,
                  "Save"
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  Payments as default
};
