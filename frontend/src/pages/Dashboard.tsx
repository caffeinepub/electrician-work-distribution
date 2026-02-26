import { useGetWorkOrders, useGetElectricians } from '../hooks/useQueries';
import { WorkOrderStatus, PaymentStatus } from '../backend';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Zap, ClipboardList, CheckCircle, Clock, DollarSign, Users } from 'lucide-react';
import { formatTimestamp } from '../lib/utils';

export default function Dashboard() {
  const { data: workOrders = [], isLoading: ordersLoading } = useGetWorkOrders();
  const { data: electricians = [], isLoading: electriciansLoading } = useGetElectricians();

  const openOrders = workOrders.filter(wo => wo.status === WorkOrderStatus.open);
  const inProgressOrders = workOrders.filter(wo => wo.status === WorkOrderStatus.inProgress);
  const completedOrders = workOrders.filter(wo => wo.status === WorkOrderStatus.completed);
  const availableElectricians = electricians.filter(e => e.isAvailable);

  const totalPaid = workOrders
    .filter(wo => wo.paymentStatus === PaymentStatus.paid)
    .reduce((sum, wo) => sum + Number(wo.paymentAmount), 0);

  const totalPending = workOrders
    .filter(wo => wo.paymentStatus === PaymentStatus.pending)
    .reduce((sum, wo) => sum + Number(wo.paymentAmount), 0);

  const recentOrders = [...workOrders]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 5);

  const stats = [
    {
      label: 'Total Orders',
      value: workOrders.length,
      icon: ClipboardList,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Open',
      value: openOrders.length,
      icon: Clock,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
    {
      label: 'In Progress',
      value: inProgressOrders.length,
      icon: Zap,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      label: 'Completed',
      value: completedOrders.length,
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      label: 'Revenue Paid',
      value: `₹${totalPaid.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Available Staff',
      value: `${availableElectricians.length}/${electricians.length}`,
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your electrical services operations</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map(stat => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex flex-col gap-2">
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-xl font-heading font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Revenue Alert */}
      {totalPending > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <DollarSign className="w-5 h-5 text-yellow-400 shrink-0" />
          <div>
            <span className="text-sm font-medium text-yellow-300">Pending Payments: </span>
            <span className="text-sm text-yellow-200">
              ₹{totalPending.toLocaleString()} outstanding across{' '}
              {workOrders.filter(wo => wo.paymentStatus === PaymentStatus.pending).length} orders
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Work Orders */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-heading text-foreground text-lg">Recent Work Orders</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {ordersLoading ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                  Loading...
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                  No work orders yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground text-xs">Title</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Status</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Priority</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map(order => (
                      <TableRow key={String(order.id)} className="border-border hover:bg-muted/30">
                        <TableCell className="text-sm text-foreground font-medium">{order.title}</TableCell>
                        <TableCell><StatusBadge status={order.status as WorkOrderStatus} /></TableCell>
                        <TableCell><PriorityBadge priority={Number(order.priority)} /></TableCell>
                        <TableCell className="text-xs text-muted-foreground">{formatTimestamp(order.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Electrician Roster */}
        <div>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-heading text-foreground text-lg">Electrician Roster</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {electriciansLoading ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                  Loading...
                </div>
              ) : electricians.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                  No electricians yet.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {electricians.slice(0, 6).map(el => (
                    <div key={String(el.id)} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-foreground">{el.name}</div>
                        <div className="text-xs text-muted-foreground">{el.specialist}</div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          el.isAvailable
                            ? 'border-green-500/40 text-green-400 bg-green-500/10'
                            : 'border-border text-muted-foreground'
                        }`}
                      >
                        {el.isAvailable ? 'Available' : 'Busy'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
