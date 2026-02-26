import { useState } from 'react';
import {
  useGetWorkOrders,
  useGetElectricians,
  useUpdateWorkOrderStatus,
  useAssignElectrician,
  useUpdateWorkOrderPayment,
  useSubmitCustomerRating,
} from '../hooks/useQueries';
import { WorkOrder, WorkOrderStatus, PaymentStatus, Electrician } from '../backend';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { PaymentStatusBadge } from '../components/PaymentStatusBadge';
import { RatingDisplay } from '../components/RatingDisplay';
import { RatingInput } from '../components/RatingInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Star, DollarSign, Filter } from 'lucide-react';
import { formatTimestamp } from '../lib/utils';
import { toast } from 'sonner';

export default function WorkOrders() {
  const { data: workOrders = [], isLoading } = useGetWorkOrders();
  const { data: electricians = [] } = useGetElectricians();

  const updateStatusMutation = useUpdateWorkOrderStatus();
  const assignElectricianMutation = useAssignElectrician();
  const updatePaymentMutation = useUpdateWorkOrderPayment();
  const submitCustomerRatingMutation = useSubmitCustomerRating();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Payment edit dialog
  const [paymentOrder, setPaymentOrder] = useState<WorkOrder | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editMethod, setEditMethod] = useState('');
  const [editPayStatus, setEditPayStatus] = useState<PaymentStatus>(PaymentStatus.pending);

  // Customer rating dialog
  const [ratingOrder, setRatingOrder] = useState<WorkOrder | null>(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  const getElectricianName = (id: bigint) => {
    const e = electricians.find((el: Electrician) => el.id === id);
    return e ? e.name : `#${String(id)}`;
  };

  const filtered = workOrders.filter(wo => {
    const matchSearch =
      wo.title.toLowerCase().includes(search.toLowerCase()) ||
      wo.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      wo.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || wo.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openPaymentDialog = (order: WorkOrder) => {
    setPaymentOrder(order);
    setEditAmount(String(Number(order.paymentAmount)));
    setEditMethod(order.paymentMethod || 'Cash');
    setEditPayStatus(order.paymentStatus as PaymentStatus);
  };

  const handleSavePayment = async () => {
    if (!paymentOrder) return;
    try {
      await updatePaymentMutation.mutateAsync({
        id: paymentOrder.id,
        paymentAmount: BigInt(Math.round(Number(editAmount) || 0)),
        paymentMethod: editMethod,
        paymentStatus: editPayStatus,
      });
      toast.success('Payment updated');
      setPaymentOrder(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update payment');
    }
  };

  const openRatingDialog = (order: WorkOrder) => {
    setRatingOrder(order);
    setRatingValue(order.customerRating ? Number(order.customerRating.rating) : 0);
    setRatingComment(order.customerRating?.comment || '');
  };

  const handleSubmitCustomerRating = async () => {
    if (!ratingOrder || ratingValue < 1) {
      toast.error('Please select a rating (1–5 stars)');
      return;
    }
    try {
      await submitCustomerRatingMutation.mutateAsync({
        workOrderId: ratingOrder.id,
        rating: BigInt(ratingValue),
        comment: ratingComment,
      });
      toast.success('Customer rating submitted!');
      setRatingOrder(null);
      setRatingValue(0);
      setRatingComment('');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit rating');
    }
  };

  const handleStatusChange = async (orderId: bigint, status: WorkOrderStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: orderId, status });
      toast.success('Status updated');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleAssignElectrician = async (orderId: bigint, electricianId: bigint) => {
    try {
      await assignElectricianMutation.mutateAsync({
        workOrderId: orderId,
        issuedElectrician: electricianId,
      });
      toast.success('Electrician assigned');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to assign electrician');
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground tracking-tight">Work Orders</h1>
        <p className="text-muted-foreground mt-1">Manage and track all work orders</p>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, email, or location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-background border-border text-foreground"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 bg-background border-border text-foreground">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={WorkOrderStatus.open}>Open</SelectItem>
                  <SelectItem value={WorkOrderStatus.inProgress}>In Progress</SelectItem>
                  <SelectItem value={WorkOrderStatus.completed}>Completed</SelectItem>
                  <SelectItem value={WorkOrderStatus.cancelled}>Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-heading text-foreground">
            Work Orders
            <span className="ml-2 text-sm font-normal text-muted-foreground">({filtered.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              Loading work orders...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              No work orders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Order</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Priority</TableHead>
                    <TableHead className="text-muted-foreground">Electrician</TableHead>
                    <TableHead className="text-muted-foreground">Payment</TableHead>
                    <TableHead className="text-muted-foreground">Customer Rating</TableHead>
                    <TableHead className="text-muted-foreground">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(order => (
                    <TableRow key={String(order.id)} className="border-border hover:bg-muted/30">
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground text-sm">{order.title}</div>
                          <div className="text-xs text-muted-foreground">{order.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={v => handleStatusChange(order.id, v as WorkOrderStatus)}
                        >
                          <SelectTrigger className="w-36 h-8 text-xs bg-background border-border text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value={WorkOrderStatus.open}>Open</SelectItem>
                            <SelectItem value={WorkOrderStatus.inProgress}>In Progress</SelectItem>
                            <SelectItem value={WorkOrderStatus.completed}>Completed</SelectItem>
                            <SelectItem value={WorkOrderStatus.cancelled}>Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={Number(order.priority)} />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={String(order.issuedElectrician)}
                          onValueChange={v => handleAssignElectrician(order.id, BigInt(v))}
                        >
                          <SelectTrigger className="w-36 h-8 text-xs bg-background border-border text-foreground">
                            <SelectValue>{getElectricianName(order.issuedElectrician)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {electricians.map((el: Electrician) => (
                              <SelectItem key={String(el.id)} value={String(el.id)}>
                                {el.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PaymentStatusBadge status={order.paymentStatus as PaymentStatus} />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openPaymentDialog(order)}
                            className="h-6 w-6 p-0 text-primary hover:bg-primary/10"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.status === WorkOrderStatus.completed ? (
                          order.customerRating ? (
                            <div className="flex items-center gap-1">
                              <RatingDisplay
                                rating={Number(order.customerRating.rating)}
                                count={1}
                                size="sm"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openRatingDialog(order)}
                                className="h-6 w-6 p-0 text-primary hover:bg-primary/10"
                              >
                                <Star className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openRatingDialog(order)}
                              className="h-7 text-xs border-primary/40 text-primary hover:bg-primary/10"
                            >
                              <Star className="w-3 h-3 mr-1" />
                              Rate Customer
                            </Button>
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatTimestamp(order.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Edit Dialog */}
      <Dialog open={!!paymentOrder} onOpenChange={open => !open && setPaymentOrder(null)}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Payment</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update payment for:{' '}
              <span className="text-foreground font-medium">{paymentOrder?.title}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-foreground">Amount (₹)</Label>
              <Input
                type="number"
                min="0"
                value={editAmount}
                onChange={e => setEditAmount(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground">Payment Method</Label>
              <Select value={editMethod} onValueChange={setEditMethod}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
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
              <Select value={editPayStatus} onValueChange={v => setEditPayStatus(v as PaymentStatus)}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value={PaymentStatus.pending}>Pending</SelectItem>
                  <SelectItem value={PaymentStatus.paid}>Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentOrder(null)} className="border-border">
              Cancel
            </Button>
            <Button
              onClick={handleSavePayment}
              disabled={updatePaymentMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {updatePaymentMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customer Rating Dialog */}
      <Dialog open={!!ratingOrder} onOpenChange={open => !open && setRatingOrder(null)}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {ratingOrder?.customerRating ? 'Edit Customer Rating' : 'Rate Customer'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Rate the customer for:{' '}
              <span className="text-foreground font-medium">{ratingOrder?.title}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <RatingInput
              value={ratingValue}
              onChange={setRatingValue}
              comment={ratingComment}
              onCommentChange={setRatingComment}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRatingOrder(null)} className="border-border">
              Cancel
            </Button>
            <Button
              onClick={handleSubmitCustomerRating}
              disabled={submitCustomerRatingMutation.isPending || ratingValue < 1}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitCustomerRatingMutation.isPending ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
