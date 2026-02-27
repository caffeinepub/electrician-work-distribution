import { useState, useMemo } from 'react';
import { Search, Loader2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  useGetAllWorkOrders,
  useGetAllElectricians,
  useUpdateWorkOrder,
  useAcceptWorkOrder,
  useDeclineWorkOrder,
  useVerifyWorkOrderApplication,
  useSubmitWorkerRating,
  useSubmitCustomerRating,
} from '../hooks/useQueries';
import { WorkOrder, WorkOrderStatus, ApplicationProcessStatus } from '../backend';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import ApplicationStatusBadge from '../components/ApplicationStatusBadge';
import PaymentStatusBadge from '../components/PaymentStatusBadge';
import RatingInput from '../components/RatingInput';
import { formatTimestamp, getQualificationLabel } from '../lib/utils';

type DialogType = 'status' | 'rating' | 'verify' | null;

export default function WorkOrders() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [newStatus, setNewStatus] = useState<WorkOrderStatus>(WorkOrderStatus.open);
  const [workerRating, setWorkerRating] = useState(0);
  const [workerComment, setWorkerComment] = useState('');
  const [customerRating, setCustomerRating] = useState(0);
  const [customerComment, setCustomerComment] = useState('');

  const { data: workOrders = [], isLoading } = useGetAllWorkOrders();
  const { data: electricians = [] } = useGetAllElectricians();

  const updateStatus = useUpdateWorkOrder();
  const acceptOrder = useAcceptWorkOrder();
  const declineOrder = useDeclineWorkOrder();
  const verifyApplication = useVerifyWorkOrderApplication();
  const submitWorkerRating = useSubmitWorkerRating();
  const submitCustomerRating = useSubmitCustomerRating();

  const openDialog = (order: WorkOrder, type: DialogType) => {
    setSelectedOrder(order);
    setDialogType(type);
    if (type === 'status') setNewStatus(order.status);
    if (type === 'rating') {
      setWorkerRating(order.workerRating ? Number(order.workerRating.rating) : 0);
      setWorkerComment(order.workerRating?.comment || '');
      setCustomerRating(order.customerRating ? Number(order.customerRating.rating) : 0);
      setCustomerComment(order.customerRating?.comment || '');
    }
  };

  const closeDialog = () => {
    setSelectedOrder(null);
    setDialogType(null);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;
    await updateStatus.mutateAsync({ id: selectedOrder.id, status: newStatus });
    closeDialog();
  };

  const handleVerify = async () => {
    if (!selectedOrder) return;
    await verifyApplication.mutateAsync(selectedOrder.id);
    closeDialog();
  };

  const handleAccept = async (order: WorkOrder) => {
    await acceptOrder.mutateAsync(order.id);
  };

  const handleDecline = async (order: WorkOrder) => {
    await declineOrder.mutateAsync(order.id);
  };

  const handleRatingSubmit = async () => {
    if (!selectedOrder) return;
    if (workerRating > 0) {
      await submitWorkerRating.mutateAsync({
        workOrderId: selectedOrder.id,
        rating: BigInt(workerRating),
        comment: workerComment,
      });
    }
    if (customerRating > 0) {
      await submitCustomerRating.mutateAsync({
        workOrderId: selectedOrder.id,
        rating: BigInt(customerRating),
        comment: customerComment,
      });
    }
    closeDialog();
  };

  const verifyApplicationCount = workOrders.filter(
    wo => wo.applicationStatus === ApplicationProcessStatus.pending && wo.status === WorkOrderStatus.open
  ).length;

  const filteredOrders = useMemo(() => {
    let orders = workOrders;
    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(
        (wo) =>
          wo.title.toLowerCase().includes(q) ||
          wo.description.toLowerCase().includes(q) ||
          wo.location.toLowerCase().includes(q)
      );
    }
    switch (activeTab) {
      case 'verify':
        return orders.filter(wo => wo.applicationStatus === ApplicationProcessStatus.pending && wo.status === WorkOrderStatus.open);
      case 'active':
        return orders.filter(wo => wo.status === WorkOrderStatus.inProgress);
      default:
        return orders;
    }
  }, [workOrders, search, activeTab]);

  const getElectricianName = (id: bigint | undefined) => {
    if (id == null) return 'Unassigned';
    const e = electricians.find(e => e.id === id);
    return e ? e.name : `#${String(id)}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold mb-2">Work Orders</h1>
        <p className="text-muted-foreground">Manage and track all work orders.</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search work orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({workOrders.length})</TabsTrigger>
          <TabsTrigger value="verify">
            Verify Application ({verifyApplicationCount})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({workOrders.filter(wo => wo.status === WorkOrderStatus.inProgress).length})
          </TabsTrigger>
        </TabsList>

        {['all', 'verify', 'active'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No work orders found.</div>
              ) : (
                filteredOrders.map((wo) => (
                  <WorkOrderCard
                    key={wo.id.toString()}
                    order={wo}
                    electricianName={getElectricianName(wo.issuedElectrician)}
                    onStatusClick={() => openDialog(wo, 'status')}
                    onRatingClick={() => openDialog(wo, 'rating')}
                    onVerifyClick={() => openDialog(wo, 'verify')}
                    onAccept={() => handleAccept(wo)}
                    onDecline={() => handleDecline(wo)}
                    isAccepting={acceptOrder.isPending}
                    isDeclining={declineOrder.isPending}
                  />
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Status Dialog */}
      <Dialog open={dialogType === 'status'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>{selectedOrder?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label>New Status</Label>
            <Select value={newStatus} onValueChange={(v) => setNewStatus(v as WorkOrderStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={WorkOrderStatus.open}>Open</SelectItem>
                <SelectItem value={WorkOrderStatus.inProgress}>In Progress</SelectItem>
                <SelectItem value={WorkOrderStatus.completed}>Completed</SelectItem>
                <SelectItem value={WorkOrderStatus.cancelled}>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleStatusUpdate} disabled={updateStatus.isPending}>
              {updateStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify Dialog */}
      <Dialog open={dialogType === 'verify'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Application</DialogTitle>
            <DialogDescription>{selectedOrder?.title}</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Verify this work order application to move it to the assignment queue.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleVerify} disabled={verifyApplication.isPending}>
              {verifyApplication.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog open={dialogType === 'rating'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ratings</DialogTitle>
            <DialogDescription>{selectedOrder?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="mb-2 block">Worker Rating</Label>
              <RatingInput
                value={workerRating}
                onChange={setWorkerRating}
                comment={workerComment}
                onCommentChange={setWorkerComment}
              />
            </div>
            <div>
              <Label className="mb-2 block">Customer Rating</Label>
              <RatingInput
                value={customerRating}
                onChange={setCustomerRating}
                comment={customerComment}
                onCommentChange={setCustomerComment}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleRatingSubmit} disabled={submitWorkerRating.isPending || submitCustomerRating.isPending}>
              {(submitWorkerRating.isPending || submitCustomerRating.isPending) ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Ratings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface WorkOrderCardProps {
  order: WorkOrder;
  electricianName: string;
  onStatusClick: () => void;
  onRatingClick: () => void;
  onVerifyClick: () => void;
  onAccept: () => void;
  onDecline: () => void;
  isAccepting: boolean;
  isDeclining: boolean;
}

function WorkOrderCard({
  order,
  electricianName,
  onStatusClick,
  onRatingClick,
  onVerifyClick,
  onAccept,
  onDecline,
  isAccepting,
  isDeclining,
}: WorkOrderCardProps) {
  return (
    <div className="bg-card border border-border rounded-sm p-4">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground font-mono">#{String(order.id)}</span>
            <h3 className="font-semibold truncate">{order.title}</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{order.description}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <StatusBadge status={order.status} />
          <PriorityBadge priority={order.priority} />
          <ApplicationStatusBadge status={order.applicationStatus} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
        <div><span className="font-medium text-foreground/70">Location:</span> {order.location}</div>
        <div><span className="font-medium text-foreground/70">Electrician:</span> {electricianName}</div>
        <div><span className="font-medium text-foreground/70">Date:</span> {formatTimestamp(order.createdAt)}</div>
        <div><span className="font-medium text-foreground/70">Email:</span> {order.customerEmail}</div>
        <div>
          <span className="font-medium text-foreground/70">Payment:</span>{' '}
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
        <div><span className="font-medium text-foreground/70">Amount:</span> ₹{Number(order.paymentAmount) / 100}</div>
        <div className="flex items-center gap-1">
          <Phone className="h-3 w-3 text-foreground/50 shrink-0" />
          <span className="font-medium text-foreground/70">Contact:</span>{' '}
          <span className="text-foreground/90">{order.customerContactNumber || '—'}</span>
        </div>
        <div className="col-span-1">
          <span className="font-medium text-foreground/70">Qualification:</span>{' '}
          <span className="text-primary font-medium">{getQualificationLabel(order.preferredEducation)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        <Button size="sm" variant="outline" onClick={onStatusClick}>
          Update Status
        </Button>

        {order.applicationStatus === ApplicationProcessStatus.pending &&
          order.status === WorkOrderStatus.open && (
            <Button size="sm" variant="outline" onClick={onVerifyClick}>
              Verify Application
            </Button>
          )}

        {order.applicationStatus === ApplicationProcessStatus.verifiedPendingAssignment && (
          <>
            <Button
              size="sm"
              variant="default"
              onClick={onAccept}
              disabled={isAccepting}
            >
              {isAccepting ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
              Accept
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onDecline}
              disabled={isDeclining}
            >
              {isDeclining ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
              Decline
            </Button>
          </>
        )}

        {order.applicationStatus === ApplicationProcessStatus.pending &&
          order.status !== WorkOrderStatus.open && (
            <Button
              size="sm"
              variant="destructive"
              onClick={onDecline}
              disabled={isDeclining}
            >
              {isDeclining ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
              Decline
            </Button>
          )}

        <Button size="sm" variant="ghost" onClick={onRatingClick}>
          Ratings
        </Button>
      </div>
    </div>
  );
}
