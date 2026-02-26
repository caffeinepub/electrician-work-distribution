import { useState } from 'react';
import { Search, Star, DollarSign, UserCheck, Loader2, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { PaymentStatusBadge } from '@/components/PaymentStatusBadge';
import { ApplicationStatusBadge } from '@/components/ApplicationStatusBadge';
import {
  useGetAllWorkOrders,
  useGetAllElectricians,
  useUpdateWorkOrderStatus,
  useAssignElectricianToWorkOrder,
  useUpdateWorkOrderPayment,
  useSubmitWorkerRating,
  useAcceptWorkOrder,
  useDeclineWorkOrder,
  useVerifyWorkOrderApplication,
  useGetWorkOrdersByApplicationStatus,
} from '@/hooks/useQueries';
import { WorkOrder, WorkOrderStatus, PaymentStatus, ApplicationProcessStatus } from '@/backend';
import { formatTimestamp } from '@/lib/utils';

export default function WorkOrders() {
  const { data: workOrders = [], isLoading } = useGetAllWorkOrders();
  const { data: pendingVerificationOrders = [] } = useGetWorkOrdersByApplicationStatus(ApplicationProcessStatus.pending);
  const { data: electricians = [] } = useGetAllElectricians();

  const updateStatus = useUpdateWorkOrderStatus();
  const assignElectrician = useAssignElectricianToWorkOrder();
  const updatePayment = useUpdateWorkOrderPayment();
  const submitRating = useSubmitWorkerRating();
  const acceptWorkOrder = useAcceptWorkOrder();
  const declineWorkOrder = useDeclineWorkOrder();
  const verifyApplication = useVerifyWorkOrderApplication();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');

  // Payment dialog
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<WorkOrder | null>(null);
  const [paymentForm, setPaymentForm] = useState({ amount: '', method: 'cash', status: 'pending' });

  // Rating dialog
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedOrderForRating, setSelectedOrderForRating] = useState<WorkOrder | null>(null);
  const [ratingForm, setRatingForm] = useState({ rating: '5', comment: '' });

  // Verify confirm dialog
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [selectedOrderForVerify, setSelectedOrderForVerify] = useState<WorkOrder | null>(null);

  const getElectricianName = (id: bigint) => {
    const e = electricians.find((el) => el.id === id);
    return e ? e.name : `#${id}`;
  };

  const filteredOrders = workOrders.filter((wo) => {
    const matchesSearch =
      !searchQuery ||
      wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || wo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingVerificationFiltered = pendingVerificationOrders.filter((wo) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return wo.title.toLowerCase().includes(q) || wo.location.toLowerCase().includes(q);
  });

  const verifiedPendingOrders = workOrders.filter(
    (wo) => wo.applicationStatus === ApplicationProcessStatus.verifiedPendingAssignment
  );

  const openPaymentDialog = (order: WorkOrder) => {
    setSelectedOrderForPayment(order);
    setPaymentForm({
      amount: (Number(order.paymentAmount) / 100).toFixed(2),
      method: order.paymentMethod,
      status: order.paymentStatus,
    });
    setPaymentDialogOpen(true);
  };

  const handlePaymentSave = async () => {
    if (!selectedOrderForPayment) return;
    try {
      await updatePayment.mutateAsync({
        id: selectedOrderForPayment.id,
        paymentAmount: BigInt(Math.round(parseFloat(paymentForm.amount) * 100)),
        paymentMethod: paymentForm.method,
        paymentStatus: paymentForm.status as PaymentStatus,
      });
      setPaymentDialogOpen(false);
    } catch (err) {
      console.error('Payment update failed:', err);
    }
  };

  const openRatingDialog = (order: WorkOrder) => {
    setSelectedOrderForRating(order);
    setRatingForm({ rating: '5', comment: '' });
    setRatingDialogOpen(true);
  };

  const handleRatingSave = async () => {
    if (!selectedOrderForRating) return;
    try {
      await submitRating.mutateAsync({
        workOrderId: selectedOrderForRating.id,
        rating: BigInt(ratingForm.rating),
        comment: ratingForm.comment,
      });
      setRatingDialogOpen(false);
    } catch (err) {
      console.error('Rating submit failed:', err);
    }
  };

  const handleVerifyConfirm = async () => {
    if (!selectedOrderForVerify) return;
    try {
      await verifyApplication.mutateAsync(selectedOrderForVerify.id);
      setVerifyDialogOpen(false);
      setSelectedOrderForVerify(null);
    } catch (err) {
      console.error('Verify failed:', err);
    }
  };

  const handleAccept = async (workOrderId: bigint) => {
    try {
      await acceptWorkOrder.mutateAsync(workOrderId);
    } catch (err) {
      console.error('Accept failed:', err);
    }
  };

  const handleDecline = async (workOrderId: bigint) => {
    try {
      await declineWorkOrder.mutateAsync(workOrderId);
    } catch (err) {
      console.error('Decline failed:', err);
    }
  };

  const WorkOrderCard = ({ order }: { order: WorkOrder }) => (
    <Card className="bg-card border-border">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground text-sm">{order.title}</h3>
              <StatusBadge status={order.status} />
              <PriorityBadge priority={Number(order.priority)} />
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{order.description}</p>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">#{String(order.id)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Location: </span>
            <span className="text-foreground">{order.location}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Technician: </span>
            <span className="text-foreground">{getElectricianName(order.issuedElectrician)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Customer: </span>
            <span className="text-foreground">{order.customerEmail}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Created: </span>
            <span className="text-foreground">{formatTimestamp(order.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <ApplicationStatusBadge status={order.applicationStatus} />
          <PaymentStatusBadge status={order.paymentStatus} />
          <span className="text-xs text-muted-foreground">
            ₹{(Number(order.paymentAmount) / 100).toFixed(0)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
          <Select
            value={order.status}
            onValueChange={async (val) => {
              try {
                await updateStatus.mutateAsync({ id: order.id, status: val as WorkOrderStatus });
              } catch (err) {
                console.error(err);
              }
            }}
          >
            <SelectTrigger className="h-7 text-xs w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={WorkOrderStatus.open}>Open</SelectItem>
              <SelectItem value={WorkOrderStatus.inProgress}>In Progress</SelectItem>
              <SelectItem value={WorkOrderStatus.completed}>Completed</SelectItem>
              <SelectItem value={WorkOrderStatus.cancelled}>Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={String(order.issuedElectrician)}
            onValueChange={async (val) => {
              try {
                await assignElectrician.mutateAsync({ workOrderId: order.id, issuedElectrician: BigInt(val) });
              } catch (err) {
                console.error(err);
              }
            }}
          >
            <SelectTrigger className="h-7 text-xs w-36">
              <SelectValue placeholder="Assign tech" />
            </SelectTrigger>
            <SelectContent>
              {electricians.map((e) => (
                <SelectItem key={String(e.id)} value={String(e.id)}>{e.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => openPaymentDialog(order)}>
            <DollarSign className="w-3 h-3" />Payment
          </Button>

          {order.status === WorkOrderStatus.completed && (
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => openRatingDialog(order)}>
              <Star className="w-3 h-3" />Rate
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const PendingVerificationCard = ({ order }: { order: WorkOrder }) => (
    <Card className="bg-card border-amber-500/30 border">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground text-sm">{order.title}</h3>
              <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-400">
                Pending Verification
              </Badge>
              <PriorityBadge priority={Number(order.priority)} />
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{order.description}</p>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">#{String(order.id)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Location: </span>
            <span className="text-foreground">{order.location}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Technician: </span>
            <span className="text-foreground">{getElectricianName(order.issuedElectrician)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Customer: </span>
            <span className="text-foreground">{order.customerEmail}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Created: </span>
            <span className="text-foreground">{formatTimestamp(order.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <ApplicationStatusBadge status={order.applicationStatus} />
          <span className="text-xs text-muted-foreground">
            ₹{(Number(order.paymentAmount) / 100).toFixed(0)}
          </span>
        </div>

        <div className="flex gap-2 pt-1 border-t border-border">
          <Button
            size="sm"
            variant="default"
            className="h-7 text-xs gap-1"
            onClick={() => {
              setSelectedOrderForVerify(order);
              setVerifyDialogOpen(true);
            }}
            disabled={verifyApplication.isPending}
          >
            {verifyApplication.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <ShieldCheck className="w-3 h-3" />
            )}
            Verify Application
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-7 text-xs gap-1"
            onClick={() => handleDecline(order.id)}
            disabled={declineWorkOrder.isPending}
          >
            {declineWorkOrder.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <XCircle className="w-3 h-3" />
            )}
            Decline
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Work Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track all service work orders</p>
        </div>
        <div className="flex items-center gap-2">
          {pendingVerificationOrders.length > 0 && (
            <Badge variant="outline" className="border-amber-500/50 text-amber-400 gap-1">
              <ShieldCheck className="w-3 h-3" />
              {pendingVerificationOrders.length} pending verification
            </Badge>
          )}
          {verifiedPendingOrders.length > 0 && (
            <Badge variant="outline" className="border-blue-500/50 text-blue-400 gap-1">
              <UserCheck className="w-3 h-3" />
              {verifiedPendingOrders.length} awaiting assignment
            </Badge>
          )}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search work orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={WorkOrderStatus.open}>Open</SelectItem>
            <SelectItem value={WorkOrderStatus.inProgress}>In Progress</SelectItem>
            <SelectItem value={WorkOrderStatus.completed}>Completed</SelectItem>
            <SelectItem value={WorkOrderStatus.cancelled}>Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-lg">
          <TabsTrigger value="all">All ({workOrders.length})</TabsTrigger>
          <TabsTrigger value="pending-verify">
            Verify ({pendingVerificationOrders.length})
          </TabsTrigger>
          <TabsTrigger value="verified-assign">
            Assign ({verifiedPendingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({workOrders.filter(wo => wo.status === WorkOrderStatus.inProgress).length})
          </TabsTrigger>
        </TabsList>

        {/* All Orders Tab */}
        <TabsContent value="all" className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No work orders found.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredOrders.map((order) => (
                <WorkOrderCard key={String(order.id)} order={order} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Pending Verification Tab */}
        <TabsContent value="pending-verify" className="mt-4">
          <div className="mb-3">
            <p className="text-sm text-muted-foreground">
              These jobs have received a worker application and are awaiting your verification before assignment.
            </p>
          </div>
          {pendingVerificationFiltered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No applications pending verification.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingVerificationFiltered.map((order) => (
                <PendingVerificationCard key={String(order.id)} order={order} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Verified - Pending Assignment Tab */}
        <TabsContent value="verified-assign" className="mt-4">
          <div className="mb-3">
            <p className="text-sm text-muted-foreground">
              These applications have been verified. Confirm assignment to move them to In Progress.
            </p>
          </div>
          {verifiedPendingOrders.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No verified applications awaiting assignment.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {verifiedPendingOrders.map((order) => (
                <Card key={String(order.id)} className="bg-card border-blue-500/30 border">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground text-sm">{order.title}</h3>
                          <ApplicationStatusBadge status={order.applicationStatus} />
                          <PriorityBadge priority={Number(order.priority)} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{order.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">#{String(order.id)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Location: </span>
                        <span className="text-foreground">{order.location}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Technician: </span>
                        <span className="text-foreground">{getElectricianName(order.issuedElectrician)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1 border-t border-border">
                      <Button
                        size="sm"
                        variant="default"
                        className="h-7 text-xs gap-1"
                        onClick={() => handleAccept(order.id)}
                        disabled={acceptWorkOrder.isPending}
                      >
                        {acceptWorkOrder.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        Confirm Assignment
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 text-xs gap-1"
                        onClick={() => handleDecline(order.id)}
                        disabled={declineWorkOrder.isPending}
                      >
                        {declineWorkOrder.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Active Tab */}
        <TabsContent value="active" className="mt-4">
          {workOrders.filter(wo => wo.status === WorkOrderStatus.inProgress).length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No active work orders.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {workOrders
                .filter(wo => wo.status === WorkOrderStatus.inProgress)
                .map((order) => (
                  <WorkOrderCard key={String(order.id)} order={order} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Payment</DialogTitle>
            <DialogDescription>
              {selectedOrderForPayment?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="payAmount">Amount (₹)</Label>
              <Input
                id="payAmount"
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm(f => ({ ...f, amount: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="payMethod">Payment Method</Label>
              <Input
                id="payMethod"
                value={paymentForm.method}
                onChange={(e) => setPaymentForm(f => ({ ...f, method: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Payment Status</Label>
              <Select
                value={paymentForm.status}
                onValueChange={(val) => setPaymentForm(f => ({ ...f, status: val }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentStatus.pending}>Pending</SelectItem>
                  <SelectItem value={PaymentStatus.paid}>Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePaymentSave} disabled={updatePayment.isPending}>
              {updatePayment.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rate Worker</DialogTitle>
            <DialogDescription>
              {selectedOrderForRating?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Rating (1–5)</Label>
              <Select
                value={ratingForm.rating}
                onValueChange={(val) => setRatingForm(f => ({ ...f, rating: val }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} Star{n !== 1 ? 's' : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ratingComment">Comment (Optional)</Label>
              <Textarea
                id="ratingComment"
                placeholder="Share your experience..."
                value={ratingForm.comment}
                onChange={(e) => setRatingForm(f => ({ ...f, comment: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRatingDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRatingSave} disabled={submitRating.isPending}>
              {submitRating.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Rating'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify Confirm Dialog */}
      <AlertDialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verify Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to verify the application for <strong>{selectedOrderForVerify?.title}</strong>?
              This will move it to "Verified – Awaiting Assignment" status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedOrderForVerify(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleVerifyConfirm} disabled={verifyApplication.isPending}>
              {verifyApplication.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </span>
              ) : 'Verify'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
