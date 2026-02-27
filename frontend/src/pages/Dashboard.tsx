import { useMemo } from 'react';
import { ClipboardList, Users, DollarSign, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllWorkOrders, useGetAllElectricians } from '../hooks/useQueries';
import { WorkOrderStatus, PaymentStatus } from '../backend';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { formatTimestamp } from '../lib/utils';

export default function Dashboard() {
  const { data: workOrders = [], isLoading: ordersLoading } = useGetAllWorkOrders();
  const { data: electricians = [], isLoading: electriciansLoading } = useGetAllElectricians();

  const stats = useMemo(() => {
    const total = workOrders.length;
    const open = workOrders.filter(wo => wo.status === WorkOrderStatus.open).length;
    const inProgress = workOrders.filter(wo => wo.status === WorkOrderStatus.inProgress).length;
    const completed = workOrders.filter(wo => wo.status === WorkOrderStatus.completed).length;
    const pendingPayment = workOrders.filter(wo => wo.paymentStatus === PaymentStatus.pending && wo.status !== WorkOrderStatus.cancelled).length;
    const totalRevenue = workOrders
      .filter(wo => wo.paymentStatus === PaymentStatus.paid)
      .reduce((sum, wo) => sum + Number(wo.paymentAmount), 0);

    return { total, open, inProgress, completed, pendingPayment, totalRevenue };
  }, [workOrders]);

  const recentOrders = useMemo(() => {
    return [...workOrders]
      .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
      .slice(0, 10);
  }, [workOrders]);

  const isLoading = ordersLoading || electriciansLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of all operations and metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.open} open · {stats.inProgress} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-green-500" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-bold text-green-500">{stats.completed}</div>
            <p className="text-xs text-muted-foreground mt-1">of {stats.total} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Electricians
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-bold">{electricians.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {electricians.filter(e => e.isAvailable).length} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-bold text-primary">
              ${(stats.totalRevenue / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stats.pendingPayment} pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payment Alert */}
      {stats.pendingPayment > 0 && (
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6 text-sm">
          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
          <span className="text-amber-500">
            <strong>{stats.pendingPayment}</strong> work order{stats.pendingPayment !== 1 ? 's' : ''} have pending payments.
          </span>
        </div>
      )}

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Work Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No work orders yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Title</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Priority</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Date</th>
                    <th className="text-right px-4 py-3 text-muted-foreground font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((wo) => (
                    <tr key={String(wo.id)} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium max-w-[200px] truncate">{wo.title}</td>
                      <td className="px-4 py-3"><StatusBadge status={wo.status} /></td>
                      <td className="px-4 py-3"><PriorityBadge priority={wo.priority} /></td>
                      <td className="px-4 py-3 text-muted-foreground">{formatTimestamp(wo.createdAt)}</td>
                      <td className="px-4 py-3 text-right font-mono">${(Number(wo.paymentAmount) / 100).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Electrician Roster */}
      {electricians.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Electrician Roster</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Specialty</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Rate</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {electricians.map((e) => (
                    <tr key={String(e.id)} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{e.name}</td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">{String(e.specialist)}</td>
                      <td className="px-4 py-3 font-mono">{String(e.hourlyRate)} {e.currency}/hr</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${e.isAvailable ? 'badge-completed' : 'badge-cancelled'}`}>
                          {e.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
