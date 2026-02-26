import { useGetAllWorkOrders, useGetAllElectricians } from '../hooks/useQueries';
import { WorkOrderStatus, PaymentStatus } from '../backend';
import { formatTimestamp } from '../lib/utils';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const { data: workOrders = [], isLoading: ordersLoading } = useGetAllWorkOrders();
  const { data: electricians = [], isLoading: electriciansLoading } = useGetAllElectricians();

  const totalOrders = workOrders.length;
  const openOrders = workOrders.filter((wo) => wo.status === WorkOrderStatus.open).length;
  const inProgressOrders = workOrders.filter((wo) => wo.status === WorkOrderStatus.inProgress).length;
  const completedOrders = workOrders.filter((wo) => wo.status === WorkOrderStatus.completed).length;
  const totalRevenue = workOrders
    .filter((wo) => wo.paymentStatus === PaymentStatus.paid)
    .reduce((sum, wo) => sum + Number(wo.paymentAmount), 0);
  const pendingPayments = workOrders.filter(
    (wo) => wo.paymentStatus === PaymentStatus.pending && wo.status !== WorkOrderStatus.cancelled
  );

  const stats = [
    { label: 'Total Orders', value: totalOrders, color: 'text-foreground' },
    { label: 'Open', value: openOrders, color: 'text-blue-400' },
    { label: 'In Progress', value: inProgressOrders, color: 'text-amber-400' },
    { label: 'Completed', value: completedOrders, color: 'text-green-400' },
    { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, color: 'text-primary' },
    { label: 'Staff', value: electricians.length, color: 'text-purple-400' },
  ];

  const recentOrders = [...workOrders].reverse().slice(0, 10);

  if (ordersLoading || electriciansLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {pendingPayments.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {pendingPayments.length} work order(s) have pending payments.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-sm p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-sm">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Priority</th>
                <th className="text-left p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id.toString()} className="border-b border-border/50 hover:bg-accent/30">
                  <td className="p-3 font-mono text-xs">#{order.id.toString()}</td>
                  <td className="p-3">{order.title}</td>
                  <td className="p-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="p-3">
                    <PriorityBadge priority={Number(order.priority)} />
                  </td>
                  <td className="p-3 text-muted-foreground">{formatTimestamp(order.createdAt)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted-foreground">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Electricians */}
      <div className="bg-card border border-border rounded-sm">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Electrician Roster</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Specialist</th>
                <th className="text-left p-3">Availability</th>
                <th className="text-left p-3">Rate</th>
              </tr>
            </thead>
            <tbody>
              {electricians.map((e) => (
                <tr key={e.id.toString()} className="border-b border-border/50 hover:bg-accent/30">
                  <td className="p-3 font-medium">{e.name}</td>
                  <td className="p-3 text-muted-foreground capitalize">{e.specialist}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${e.isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {e.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{e.currency}{Number(e.hourlyRate)}/hr</td>
                </tr>
              ))}
              {electricians.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-muted-foreground">
                    No electricians yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
