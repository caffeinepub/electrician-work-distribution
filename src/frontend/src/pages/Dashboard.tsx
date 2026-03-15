import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock,
  IndianRupee,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import React from "react";
import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
import {
  useGetAllElectricians,
  useGetAllWorkOrders,
} from "../hooks/useQueries";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: workOrders = [], isLoading: ordersLoading } =
    useGetAllWorkOrders();
  const { data: electricians = [] } = useGetAllElectricians();

  const totalOrders = workOrders.length;
  const openOrders = workOrders.filter((wo) => wo.status === "open").length;
  const inProgressOrders = workOrders.filter(
    (wo) => wo.status === "inProgress",
  ).length;
  const completedOrders = workOrders.filter(
    (wo) => wo.status === "completed",
  ).length;
  const totalRevenue = workOrders
    .filter((wo) => wo.paymentStatus.__kind__ === "confirmed")
    .reduce((sum, wo) => sum + wo.paymentAmount, 0);

  const recentOrders = [...workOrders]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ClipboardList,
      color: "text-blue-400",
    },
    { label: "Open", value: openOrders, icon: Clock, color: "text-amber-400" },
    {
      label: "In Progress",
      value: inProgressOrders,
      icon: TrendingUp,
      color: "text-cyan-400",
    },
    {
      label: "Completed",
      value: completedOrders,
      icon: CheckCircle2,
      color: "text-green-400",
    },
    {
      label: "Revenue (₹)",
      value: totalRevenue,
      icon: IndianRupee,
      color: "text-primary",
    },
    {
      label: "Electricians",
      value: electricians.length,
      icon: Users,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Zap className="w-8 h-8 text-primary" />
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of all service operations.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-4 pb-4">
                <div className="flex flex-col gap-1">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          {
            label: "Work Orders",
            href: "/admin/work-orders",
            icon: ClipboardList,
          },
          { label: "Electricians", href: "/admin/electricians", icon: Users },
          { label: "Payments", href: "/admin/payments", icon: IndianRupee },
          {
            label: "Verifications",
            href: "/admin/verifications",
            icon: CheckCircle2,
          },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.href}
              variant="outline"
              className="flex items-center gap-2 h-12"
              onClick={() => navigate({ to: action.href })}
            >
              <Icon className="w-4 h-4" />
              {action.label}
              <ArrowRight className="w-3.5 h-3.5 ml-auto" />
            </Button>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/30 border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      #{order.id} — {order.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PriorityBadge priority={order.priority} />
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
