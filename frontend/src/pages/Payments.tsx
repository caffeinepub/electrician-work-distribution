import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useGetWorkOrders, useUpdateWorkOrderPayment } from '../hooks/useQueries';
import { WorkOrder, PaymentStatus } from '../backend';
import { PaymentStatusBadge } from '../components/PaymentStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatTimestamp } from '../lib/utils';
import { DollarSign, Clock, CheckCircle, Edit2, LogIn } from 'lucide-react';
import { toast } from 'sonner';

export default function Payments() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const { data: workOrders = [], isLoading } = useGetWorkOrders();
  const updatePaymentMutation = useUpdateWorkOrderPayment();

  const [editingOrder, setEditingOrder] = useState<WorkOrder | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editMethod, setEditMethod] = useState('');
  const [editStatus, setEditStatus] = useState<PaymentStatus>(PaymentStatus.pending);

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Authentication Required</h2>
          <p className="text-muted-foreground max-w-sm">
            You must be logged in to view payment information.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => login()}
            disabled={loginStatus === 'logging-in'}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loginStatus === 'logging-in' ? 'Logging in...' : 'Log In'}
          </Button>
          <Button variant="outline" onClick={() => navigate({ to: '/services' })}>
            Go to Services
          </Button>
        </div>
      </div>
    );
  }

  const completedOrders = workOrders.filter(wo => wo.status === 'completed');

  const totalPaid = workOrders
    .filter(wo => wo.paymentStatus === PaymentStatus.paid)
    .reduce((sum, wo) => sum + Number(wo.paymentAmount), 0);

  const totalPending = workOrders
    .filter(wo => wo.paymentStatus === PaymentStatus.pending)
    .reduce((sum, wo) => sum + Number(wo.paymentAmount), 0);

  const paidCount = workOrders.filter(wo => wo.paymentStatus === PaymentStatus.paid).length;
  const pendingCount = workOrders.filter(wo => wo.paymentStatus === PaymentStatus.pending).length;

  const openEditDialog = (order: WorkOrder) => {
    setEditingOrder(order);
    setEditAmount(String(Number(order.paymentAmount)));
    setEditMethod(order.paymentMethod || 'Cash');
    setEditStatus(order.paymentStatus as PaymentStatus);
  };

  const handleSavePayment = async () => {
    if (!editingOrder) return;
    try {
      await updatePaymentMutation.mutateAsync({
        id: editingOrder.id,
        paymentAmount: BigInt(Math.round(Number(editAmount) || 0)),
        paymentMethod: editMethod,
        paymentStatus: editStatus,
      });
      toast.success('Payment updated successfully');
      setEditingOrder(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update payment');
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground tracking-tight">Payments</h1>
        <p className="text-muted-foreground mt-1">Track and manage payment status for all work orders</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Total Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-bold text-foreground">
              ₹{totalPaid.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {paidCount} payment{paidCount !== 1 ? 's' : ''} completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              Total Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-bold text-foreground">
              ₹{totalPending.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingCount} payment{pendingCount !== 1 ? 's' : ''} outstanding
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Completed Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-bold text-foreground">
              {completedOrders.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">work orders finished</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-bold text-foreground">
              ₹{(totalPaid + totalPending).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">across all orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Details Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-heading text-foreground">Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              Loading payments...
            </div>
          ) : workOrders.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              No work orders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Order</TableHead>
                    <TableHead className="text-muted-foreground">Customer</TableHead>
                    <TableHead className="text-muted-foreground">Date</TableHead>
                    <TableHead className="text-muted-foreground">Amount</TableHead>
                    <TableHead className="text-muted-foreground">Method</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workOrders.map(order => (
                    <TableRow key={String(order.id)} className="border-border hover:bg-muted/30">
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground text-sm">{order.title}</div>
                          <div className="text-xs text-muted-foreground">#{String(order.id)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground">{order.customerEmail}</div>
                        <div className="text-xs text-muted-foreground">{order.customerAddress}</div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTimestamp(order.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-foreground">
                        ₹{Number(order.paymentAmount).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {order.paymentMethod || '—'}
                      </TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={order.paymentStatus as PaymentStatus} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(order)}
                          className="text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Payment Dialog */}
      <Dialog open={!!editingOrder} onOpenChange={open => !open && setEditingOrder(null)}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Payment</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update payment details for:{' '}
              <span className="text-foreground font-medium">{editingOrder?.title}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-foreground">Payment Amount (₹)</Label>
              <Input
                type="number"
                min="0"
                value={editAmount}
                onChange={e => setEditAmount(e.target.value)}
                className="bg-background border-border text-foreground"
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground">Payment Method</Label>
              <Select value={editMethod} onValueChange={setEditMethod}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground">Payment Status</Label>
              <Select value={editStatus} onValueChange={v => setEditStatus(v as PaymentStatus)}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value={PaymentStatus.pending}>Pending</SelectItem>
                  <SelectItem value={PaymentStatus.paid}>Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingOrder(null)}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePayment}
              disabled={updatePaymentMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {updatePaymentMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
