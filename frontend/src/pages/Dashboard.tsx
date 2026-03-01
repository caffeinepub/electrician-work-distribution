import { useGetAllWorkOrders, useGetAllElectricians, useIsCallerAdmin } from '../hooks/useQueries';
import { WorkOrderStatus } from '../backend';
import {
  ClipboardList,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  loading,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  description?: string;
  loading?: boolean;
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold text-foreground">{value}</div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: workOrders, isLoading: loadingWO } = useGetAllWorkOrders();
  const { data: electricians, isLoading: loadingE } = useGetAllElectricians();
  const { data: isAdmin } = useIsCallerAdmin();

  const totalOrders = workOrders?.length ?? 0;
  const openOrders = workOrders?.filter((wo) => wo.status === WorkOrderStatus.open).length ?? 0;
  const inProgressOrders = workOrders?.filter((wo) => wo.status === WorkOrderStatus.inProgress).length ?? 0;
  const completedOrders = workOrders?.filter((wo) => wo.status === WorkOrderStatus.completed).length ?? 0;
  const totalElectricians = electricians?.length ?? 0;
  const availableElectricians = electricians?.filter((e) => e.isAvailable).length ?? 0;

  const totalRevenue = workOrders
    ?.filter((wo) => wo.paymentStatus.__kind__ === 'confirmed' || wo.paymentStatus.__kind__ === 'paid')
    .reduce((sum, wo) => sum + Number(wo.paymentAmount), 0) ?? 0;

  const recentOrders = workOrders?.slice(-5).reverse() ?? [];

  return (
    <div className="animate-fade-in p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
            <LayoutDashboardIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Overview of all operations</p>
          </div>
        </div>
        {isAdmin && (
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={ClipboardList}
          description="All time"
          loading={loadingWO}
        />
        <StatCard
          title="Open Orders"
          value={openOrders}
          icon={Clock}
          description="Awaiting assignment"
          loading={loadingWO}
        />
        <StatCard
          title="In Progress"
          value={inProgressOrders}
          icon={Zap}
          description="Active work orders"
          loading={loadingWO}
        />
        <StatCard
          title="Completed"
          value={completedOrders}
          icon={CheckCircle}
          description="Successfully done"
          loading={loadingWO}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Card */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            {loadingWO ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-green-400">₹{totalRevenue}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Confirmed payments</p>
          </CardContent>
        </Card>

        {/* Electricians Card */}
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Electricians</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingE ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{totalElectricians}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {availableElectricians} available
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
              onClick={() => { window.location.href = '/admin/work-orders'; }}
            >
              <span>Work Orders</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
              onClick={() => { window.location.href = '/admin/verifications'; }}
            >
              <span>Verifications</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
              onClick={() => { window.location.href = '/admin/electricians'; }}
            >
              <span>Electricians</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { window.location.href = '/admin/work-orders'; }}
          >
            View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          {loadingWO ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No orders yet.</p>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div
                  key={String(order.id)}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      #{String(order.id)} {order.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{order.location}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-xs text-muted-foreground">₹{String(order.paymentAmount)}</span>
                    <StatusDot status={order.status} />
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

function LayoutDashboardIcon({ className }: { className?: string }) {
  return <ClipboardList className={className} />;
}

function StatusDot({ status }: { status: WorkOrderStatus }) {
  const colors: Record<WorkOrderStatus, string> = {
    [WorkOrderStatus.open]: 'bg-blue-400',
    [WorkOrderStatus.inProgress]: 'bg-amber-400',
    [WorkOrderStatus.completed]: 'bg-green-400',
    [WorkOrderStatus.cancelled]: 'bg-red-400',
  };
  return (
    <span className={`inline-block h-2 w-2 rounded-full ${colors[status] ?? 'bg-muted'}`} />
  );
}
