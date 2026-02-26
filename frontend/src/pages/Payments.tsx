import { useState } from 'react';
import { useGetAllWorkOrders, useUpdateWorkOrderPayment } from '../hooks/useQueries';
import { PaymentStatus, WorkOrderStatus } from '../backend';
import type { WorkOrder } from '../backend';
import { formatTimestamp } from '../lib/utils';
import { PaymentStatusBadge } from '../components/PaymentStatusBadge';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Payments() {
  const { identity } = useInternetIdentity();
  const { data: workOrders = [], isLoading } = useGetAllWorkOrders();
  const updatePayment = useUpdateWorkOrderPayment();

  const [editTarget, setEditTarget] = useState<WorkOrder | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('');
  const [payStatus, setPayStatus] = useState<PaymentStatus>(PaymentStatus.pending);

  const totalRevenue = workOrders
    .filter((wo) => wo.paymentStatus === PaymentStatus.paid)
    .reduce((sum, wo) => sum + Number(wo.paymentAmount), 0);

  const pendingAmount = workOrders
    .filter((wo) => wo.paymentStatus === PaymentStatus.pending && wo.status !== WorkOrderStatus.cancelled)
    .reduce((sum, wo) => sum + Number(wo.paymentAmount), 0);

  const paidCount = workOrders.filter((wo) => wo.paymentStatus === PaymentStatus.paid).length;
  const pendingCount = workOrders.filter(
    (wo) => wo.paymentStatus === PaymentStatus.pending && wo.status !== WorkOrderStatus.cancelled
  ).length;

  const openEdit = (wo: WorkOrder) => {
    setEditTarget(wo);
    setPayAmount(wo.paymentAmount.toString());
    setPayMethod(wo.paymentMethod);
    setPayStatus(wo.paymentStatus);
  };

  const handleSave = async () => {
    if (!editTarget) return;
    try {
      await updatePayment.mutateAsync({
        id: editTarget.id,
        paymentAmount: BigInt(Math.round(parseFloat(payAmount) || 0)),
        paymentMethod: payMethod,
        paymentStatus: payStatus,
      });
      toast.success('Payment updated.');
      setEditTarget(null);
    } catch {
      toast.error('Failed to update payment.');
    }
  };

  if (!identity) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Please log in to view payments.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Payments</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-400' },
          { label: 'Pending Amount', value: `$${pendingAmount.toLocaleString()}`, icon: Clock, color: 'text-amber-400' },
          { label: 'Paid Orders', value: paidCount, icon: CheckCircle, color: 'text-primary' },
          { label: 'Pending Orders', value: pendingCount, icon: TrendingUp, color: 'text-orange-400' },
        ].map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`w-4 h-4 ${card.color}`} />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{card.label}</p>
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left p-3">Work Order</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Method</th>
              <th className="text-left p-3">Payment Status</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workOrders.map((wo) => (
              <tr key={wo.id.toString()} className="border-b border-border/50 hover:bg-accent/30">
                <td className="p-3">
                  <div>
                    <p className="font-medium text-xs">{wo.title}</p>
                    <p className="text-xs text-muted-foreground font-mono">#{wo.id.toString()}</p>
                  </div>
                </td>
                <td className="p-3">
                  <StatusBadge status={wo.status} />
                </td>
                <td className="p-3 font-medium">${Number(wo.paymentAmount).toLocaleString()}</td>
                <td className="p-3 text-muted-foreground">{wo.paymentMethod || '—'}</td>
                <td className="p-3">
                  <PaymentStatusBadge status={wo.paymentStatus} />
                </td>
                <td className="p-3 text-muted-foreground text-xs">{formatTimestamp(wo.createdAt)}</td>
                <td className="p-3">
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => openEdit(wo)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
            {workOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted-foreground">
                  No payment records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Payment</DialogTitle>
            <DialogDescription>{editTarget?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Amount</Label>
              <Input type="number" min="0" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Payment Method</Label>
              <Input value={payMethod} onChange={(e) => setPayMethod(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Payment Status</Label>
              <Select value={payStatus} onValueChange={(v) => setPayStatus(v as PaymentStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentStatus.pending}>Pending</SelectItem>
                  <SelectItem value={PaymentStatus.paid}>Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={updatePayment.isPending}>
              {updatePayment.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
