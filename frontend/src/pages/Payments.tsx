import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  IndianRupee, TrendingUp, Clock, CheckCircle,
  Edit, Loader2, CreditCard,
} from 'lucide-react';
import { useGetAllWorkOrders, useUpdateWorkOrderPayment } from '../hooks/useQueries';
import { PaymentStatus, WorkOrderStatus } from '../backend';
import StatusBadge from '../components/StatusBadge';
import PaymentStatusBadge from '../components/PaymentStatusBadge';
import PageTransition from '../components/PageTransition';
import { formatTimestamp } from '../lib/utils';

// PaymentStatus is a discriminated union, not an enum.
// We use string literals for __kind__ comparisons and for Select values.
type PaymentStatusKind = 'pending' | 'paid' | 'confirmed' | 'flagged';

function makePaymentStatus(kind: PaymentStatusKind): PaymentStatus {
  switch (kind) {
    case 'paid': return { __kind__: 'paid', paid: null };
    case 'confirmed': return { __kind__: 'confirmed', confirmed: null };
    case 'flagged': return { __kind__: 'flagged', flagged: '' };
    case 'pending':
    default: return { __kind__: 'pending', pending: null };
  }
}

export default function Payments() {
  const { data: workOrders = [], isLoading } = useGetAllWorkOrders();
  const updatePayment = useUpdateWorkOrderPayment();

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    orderId: bigint | null;
    amount: string;
    method: string;
    statusKind: PaymentStatusKind;
  }>({
    open: false,
    orderId: null,
    amount: '',
    method: '',
    statusKind: 'pending',
  });

  const closeDialog = () =>
    setEditDialog({ open: false, orderId: null, amount: '', method: '', statusKind: 'pending' });

  const totalRevenue = workOrders
    .filter(o => o.paymentStatus.__kind__ === 'paid' || o.paymentStatus.__kind__ === 'confirmed')
    .reduce((sum, o) => sum + Number(o.paymentAmount), 0);

  const pendingRevenue = workOrders
    .filter(o => o.paymentStatus.__kind__ === 'pending' && o.status !== WorkOrderStatus.cancelled)
    .reduce((sum, o) => sum + Number(o.paymentAmount), 0);

  const paidCount = workOrders.filter(
    o => o.paymentStatus.__kind__ === 'paid' || o.paymentStatus.__kind__ === 'confirmed'
  ).length;

  const pendingCount = workOrders.filter(
    o => o.paymentStatus.__kind__ === 'pending' && o.status !== WorkOrderStatus.cancelled
  ).length;

  const openEdit = (order: typeof workOrders[0]) => {
    setEditDialog({
      open: true,
      orderId: order.id,
      amount: order.paymentAmount.toString(),
      method: order.paymentMethod,
      statusKind: order.paymentStatus.__kind__ as PaymentStatusKind,
    });
  };

  const handleSave = () => {
    if (!editDialog.orderId) return;
    updatePayment.mutate(
      {
        id: editDialog.orderId,
        paymentAmount: BigInt(editDialog.amount || '0'),
        paymentMethod: editDialog.method,
        paymentStatus: makePaymentStatus(editDialog.statusKind),
      },
      {
        onSuccess: () => {
          toast.success('Payment updated successfully');
          closeDialog();
        },
        onError: (err: unknown) =>
          toast.error(err instanceof Error ? err.message : 'Failed to update payment'),
      }
    );
  };

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Payments
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track and manage all payment transactions
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-5">
                  <Skeleton className="h-8 w-8 rounded-lg mb-3" />
                  <Skeleton className="h-7 w-24 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card className="border-green-500/20 bg-green-500/5 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
                <CardContent className="p-5">
                  <div className="p-2 bg-green-500/10 rounded-lg w-fit mb-3">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-green-400">₹{totalRevenue.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Collected</p>
                </CardContent>
              </Card>
              <Card className="border-amber-400/20 bg-amber-400/5 hover:shadow-lg hover:shadow-amber-400/10 transition-all duration-300">
                <CardContent className="p-5">
                  <div className="p-2 bg-amber-400/10 rounded-lg w-fit mb-3">
                    <Clock className="h-5 w-5 text-amber-400" />
                  </div>
                  <p className="text-2xl font-bold text-amber-400">₹{pendingRevenue.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-muted-foreground mt-1">Pending Collection</p>
                </CardContent>
              </Card>
              <Card className="border-border hover:shadow-lg transition-all duration-300">
                <CardContent className="p-5">
                  <div className="p-2 bg-primary/10 rounded-lg w-fit mb-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{paidCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">Paid Orders</p>
                </CardContent>
              </Card>
              <Card className="border-border hover:shadow-lg transition-all duration-300">
                <CardContent className="p-5">
                  <div className="p-2 bg-muted rounded-lg w-fit mb-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">Pending Orders</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Payment Table */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-8 w-16 rounded" />
                  </div>
                ))}
              </div>
            ) : workOrders.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <IndianRupee className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {workOrders.map(order => (
                  <div
                    key={order.id.toString()}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">#{order.id.toString()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{order.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(order.createdAt)} · {order.paymentMethod}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold text-primary">₹{order.paymentAmount.toString()}</span>
                      <StatusBadge status={order.status} />
                      <PaymentStatusBadge status={order.paymentStatus} />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(order)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={editDialog.open} onOpenChange={open => !open && closeDialog()}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-4 w-4 text-primary" />
                Edit Payment
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Amount (₹)</Label>
                <Input
                  type="number"
                  value={editDialog.amount}
                  onChange={e => setEditDialog(prev => ({ ...prev, amount: e.target.value }))}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Payment Method</Label>
                <Input
                  value={editDialog.method}
                  onChange={e => setEditDialog(prev => ({ ...prev, method: e.target.value }))}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Payment Status</Label>
                <Select
                  value={editDialog.statusKind}
                  onValueChange={v =>
                    setEditDialog(prev => ({ ...prev, statusKind: v as PaymentStatusKind }))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={updatePayment.isPending}>
                {updatePayment.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
