import { c as createLucideIcon, u as useNavigate, C as ClipboardList, U as Users, j as jsxRuntimeExports, Z as Zap, b as Button } from "./index-CojzdrZl.js";
import { e as useGetAllWorkOrders, k as useGetAllElectricians, C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./useQueries-DY1f8-wB.js";
import { P as PriorityBadge } from "./PriorityBadge-CY1WQF82.js";
import { S as StatusBadge } from "./StatusBadge-kenQiSkq.js";
import { C as Clock } from "./clock-C8ukhak5.js";
import { C as CircleCheck } from "./circle-check-Dz1_ocUU.js";
import { I as IndianRupee } from "./indian-rupee-ndInwIL2.js";
import { A as ArrowRight } from "./arrow-right-Bhh4iMZv.js";
import "./helpers-BNKG4l1e.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
function Dashboard() {
  const navigate = useNavigate();
  const { data: workOrders = [], isLoading: ordersLoading } = useGetAllWorkOrders();
  const { data: electricians = [] } = useGetAllElectricians();
  const totalOrders = workOrders.length;
  const openOrders = workOrders.filter((wo) => wo.status === "open").length;
  const inProgressOrders = workOrders.filter(
    (wo) => wo.status === "inProgress"
  ).length;
  const completedOrders = workOrders.filter(
    (wo) => wo.status === "completed"
  ).length;
  const totalRevenue = workOrders.filter((wo) => wo.paymentStatus.__kind__ === "confirmed").reduce((sum, wo) => sum + wo.paymentAmount, 0);
  const recentOrders = [...workOrders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);
  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ClipboardList,
      color: "text-blue-400"
    },
    { label: "Open", value: openOrders, icon: Clock, color: "text-amber-400" },
    {
      label: "In Progress",
      value: inProgressOrders,
      icon: TrendingUp,
      color: "text-cyan-400"
    },
    {
      label: "Completed",
      value: completedOrders,
      icon: CircleCheck,
      color: "text-green-400"
    },
    {
      label: "Revenue (₹)",
      value: totalRevenue,
      icon: IndianRupee,
      color: "text-primary"
    },
    {
      label: "Electricians",
      value: electricians.length,
      icon: Users,
      color: "text-purple-400"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 py-8 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-8 h-8 text-primary" }),
        "Admin Dashboard"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Overview of all service operations." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8", children: stats.map((stat) => {
      const Icon = stat.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-5 h-5 ${stat.color}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground", children: stat.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: stat.label })
      ] }) }) }, stat.label);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8", children: [
      {
        label: "Work Orders",
        href: "/admin/work-orders",
        icon: ClipboardList
      },
      { label: "Electricians", href: "/admin/electricians", icon: Users },
      { label: "Payments", href: "/admin/payments", icon: IndianRupee },
      {
        label: "Verifications",
        href: "/admin/verifications",
        icon: CircleCheck
      }
    ].map((action) => {
      const Icon = action.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "flex items-center gap-2 h-12",
          onClick: () => navigate({ to: action.href }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" }),
            action.label,
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3.5 h-3.5 ml-auto" })
          ]
        },
        action.href
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Recent Orders" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: ordersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Loading..." }) : recentOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No orders yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: recentOrders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/30 border border-border",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-sm text-foreground truncate", children: [
                "#",
                order.id,
                " — ",
                order.title
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: order.location })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PriorityBadge, { priority: order.priority }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: order.status })
            ] })
          ]
        },
        order.id
      )) }) })
    ] })
  ] });
}
export {
  Dashboard as default
};
