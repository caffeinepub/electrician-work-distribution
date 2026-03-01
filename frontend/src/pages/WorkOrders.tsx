import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import { toast } from 'sonner';
import {
  ClipboardList, User, MapPin, Phone, Mail, Calendar,
  CheckCircle, XCircle, UserCheck, Loader2, IndianRupee,
  AlertCircle, Activity, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  useGetAllWorkOrders,
  useGetAllElectricians,
  useVerifyAndMoveToQueue,
  useGetVerifiedApplications,
  useAssignElectrician,
  useAcceptWorkOrder,
  useDeclineWorkOrder,
  useUpdateWorkOrderStatus,
} from '../hooks/useQueries';
import { WorkOrderStatus, ApplicationProcessStatus, Electrician } from '../backend';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import ApplicationStatusBadge from '../components/ApplicationStatusBadge';
import WorkerChecklist from '../components/WorkerChecklist';
import ProcessGuide from '../components/ProcessGuide';
import PageTransition from '../components/PageTransition';
import { formatTimestamp } from '../lib/utils';

interface WorkOrderCardProps {
  order: {
    id: bigint;
    title: string;
    description: string;
    location: string;
    priority: bigint;
    status: WorkOrderStatus;
    applicationStatus: ApplicationProcessStatus;
    issuedElectrician?: bigint;
    createdAt: bigint;
    customerEmail: string;
    customerAddress: string;
    customerContactNumber: string;
    paymentAmount: bigint;
    paymentMethod: string;
  };
  electricians: Electrician[];
  showVerify?: boolean;
  showAssign?: boolean;
  showActive?: boolean;
  showComplete?: boolean;
  onVerify?: (id: bigint) => void;
  onAssign?: (orderId: bigint, electricianId: bigint) => void;
  onConfirmOrder?: (order: any) => void;
  onComplete?: (id: bigint) => void;
  isVerifying?: boolean;
  isAssigning?: boolean;
  isCompleting?: boolean;
}

function WorkOrderCard({
  order,
  electricians,
  showVerify,
  showAssign,
  showActive,
  showComplete,
  onVerify,
  onAssign,
  onConfirmOrder,
  onComplete,
  isVerifying,
  isAssigning,
  isCompleting,
}: WorkOrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedElectrician, setSelectedElectrician] = useState<string>('');

  const assignedElectrician = order.issuedElectrician
    ? electricians.find(e => e.id === order.issuedElectrician)
    : null;

  const isInProgress = order.status === WorkOrderStatus.inProgress;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">#{order.id.toString()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm truncate">{order.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{order.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={order.status} />
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
          </div>
        </div>

        {/* Quick info row */}
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate max-w-[120px]">{order.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatTimestamp(order.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
            <IndianRupee className="h-3 w-3" />
            <span>{order.paymentAmount.toString()}</span>
          </div>
          <PriorityBadge priority={Number(order.priority)} />
          <ApplicationStatusBadge status={order.applicationStatus} />
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-border px-4 py-3 space-y-3 bg-muted/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Email:</span>
                <span className="text-foreground truncate">{order.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Phone:</span>
                <span className="text-foreground">{order.customerContactNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Address:</span>
                <span className="text-foreground truncate">{order.customerAddress}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <IndianRupee className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Payment:</span>
                <span className="text-foreground">₹{order.paymentAmount.toString()} via {order.paymentMethod}</span>
              </div>
              {assignedElectrician && (
                <div className="flex items-center gap-2 text-xs">
                  <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Worker:</span>
                  <span className="text-foreground font-medium">{assignedElectrician.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Worker Checklist for In Progress orders */}
          {isInProgress && (
            <WorkerChecklist workOrderId={order.id.toString()} />
          )}
        </div>
      )}

      {/* Action Buttons */}
      {(showVerify || showAssign || showActive || showComplete) && (
        <div className="border-t border-border px-4 py-3 bg-muted/5">
          {showVerify && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onVerify?.(order.id)}
                disabled={isVerifying}
                className="btn-hover-scale"
              >
                {isVerifying ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5 mr-1.5" />}
                Verify & Queue
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="btn-hover-scale"
              >
                <XCircle className="h-3.5 w-3.5 mr-1.5" />
                Decline
              </Button>
            </div>
          )}

          {showAssign && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedElectrician} onValueChange={setSelectedElectrician}>
                <SelectTrigger className="h-8 text-xs flex-1">
                  <SelectValue placeholder="Select electrician..." />
                </SelectTrigger>
                <SelectContent>
                  {electricians.filter(e => e.isAvailable).map(e => (
                    <SelectItem key={e.id.toString()} value={e.id.toString()}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={() => {
                  if (selectedElectrician) {
                    onConfirmOrder?.({ ...order, selectedElectricianId: BigInt(selectedElectrician) });
                  } else {
                    toast.error('Please select an electrician first');
                  }
                }}
                disabled={isAssigning || !selectedElectrician}
                className="btn-hover-scale shrink-0"
              >
                {isAssigning ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <UserCheck className="h-3.5 w-3.5 mr-1.5" />}
                Assign & Confirm
              </Button>
            </div>
          )}

          {showComplete && (
            <Button
              size="sm"
              onClick={() => onComplete?.(order.id)}
              disabled={isCompleting}
              className="btn-hover-scale"
            >
              {isCompleting ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5 mr-1.5" />}
              Mark Complete
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export default function WorkOrders() {
  const { data: allOrders = [], isLoading: ordersLoading } = useGetAllWorkOrders();
  const { data: electricians = [], isLoading: electriciansLoading } = useGetAllElectricians();
  const { data: verifiedOrders = [], isLoading: verifiedLoading } = useGetVerifiedApplications();

  const verifyMutation = useVerifyAndMoveToQueue();
  const assignMutation = useAssignElectrician();
  const acceptMutation = useAcceptWorkOrder();
  const declineMutation = useDeclineWorkOrder();
  const updateStatusMutation = useUpdateWorkOrderStatus();

  const isLoading = ordersLoading || electriciansLoading;

  // Order confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    order: any;
    electrician: Electrician | null;
  }>({ open: false, order: null, electrician: null });

  const pendingOrders = allOrders.filter(
    o => o.applicationStatus === ApplicationProcessStatus.pending
  );
  const activeOrders = allOrders.filter(
    o => o.status === WorkOrderStatus.inProgress
  );

  // Determine current stage for process guide based on most recent active order
  const latestActiveOrder = activeOrders[0] || verifiedOrders[0] || pendingOrders[0];

  const handleVerify = (id: bigint) => {
    verifyMutation.mutate(id, {
      onSuccess: () => toast.success('Application verified and moved to assignment queue'),
      onError: (err: any) => toast.error(err?.message || 'Failed to verify application'),
    });
  };

  const handleOpenConfirmDialog = (orderWithElectrician: any) => {
    const electrician = electricians.find(
      e => e.id === orderWithElectrician.selectedElectricianId
    ) || null;
    setConfirmDialog({
      open: true,
      order: orderWithElectrician,
      electrician,
    });
  };

  const handleConfirmOrder = async () => {
    const { order, electrician } = confirmDialog;
    if (!order || !electrician) return;

    try {
      await assignMutation.mutateAsync({
        workOrderId: order.id,
        electricianId: electrician.id,
      });
      await acceptMutation.mutateAsync(order.id);
      toast.success(`Order #${order.id} confirmed and assigned to ${electrician.name}!`);
      setConfirmDialog({ open: false, order: null, electrician: null });
    } catch (err: any) {
      toast.error(err?.message || 'Failed to confirm order');
    }
  };

  const handleComplete = (id: bigint) => {
    updateStatusMutation.mutate(
      { id, status: WorkOrderStatus.completed },
      {
        onSuccess: () => toast.success('Order marked as completed'),
        onError: (err: any) => toast.error(err?.message || 'Failed to complete order'),
      }
    );
  };

  const isConfirming = assignMutation.isPending || acceptMutation.isPending;

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-primary" />
              Work Orders
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage and track all service requests
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Activity className="h-3 w-3 mr-1" />
              {allOrders.length} total
            </Badge>
            <Badge variant="outline" className="text-xs text-amber-400 border-amber-400/30">
              <AlertCircle className="h-3 w-3 mr-1" />
              {pendingOrders.length} pending
            </Badge>
          </div>
        </div>

        {/* Process Guide */}
        <ProcessGuide
          workOrderStatus={latestActiveOrder?.status}
          applicationStatus={latestActiveOrder?.applicationStatus}
        />

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="all">
              All
              {allOrders.length > 0 && (
                <span className="ml-1.5 text-xs bg-muted rounded-full px-1.5">{allOrders.length}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="verify">
              Verify
              {pendingOrders.length > 0 && (
                <span className="ml-1.5 text-xs bg-amber-400/20 text-amber-400 rounded-full px-1.5">{pendingOrders.length}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="assign">
              Assign
              {verifiedOrders.length > 0 && (
                <span className="ml-1.5 text-xs bg-blue-400/20 text-blue-400 rounded-full px-1.5">{verifiedOrders.length}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="active">
              Active
              {activeOrders.length > 0 && (
                <span className="ml-1.5 text-xs bg-green-400/20 text-green-400 rounded-full px-1.5">{activeOrders.length}</span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* All Orders Tab */}
          <TabsContent value="all" className="mt-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : allOrders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No work orders yet</p>
                <p className="text-sm mt-1">Orders will appear here when customers book services</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allOrders.map(order => (
                  <WorkOrderCard
                    key={order.id.toString()}
                    order={order}
                    electricians={electricians}
                    showComplete={order.status === WorkOrderStatus.inProgress}
                    onComplete={handleComplete}
                    isCompleting={updateStatusMutation.isPending}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Verify Tab */}
          <TabsContent value="verify" className="mt-4">
            {ordersLoading ? (
              <div className="space-y-3">
                {[1, 2].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : pendingOrders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No pending applications</p>
                <p className="text-sm mt-1">New applications will appear here for review</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingOrders.map(order => (
                  <WorkOrderCard
                    key={order.id.toString()}
                    order={order}
                    electricians={electricians}
                    showVerify
                    onVerify={handleVerify}
                    isVerifying={verifyMutation.isPending}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Assign Tab */}
          <TabsContent value="assign" className="mt-4">
            {verifiedLoading ? (
              <div className="space-y-3">
                {[1, 2].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : verifiedOrders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No orders in assignment queue</p>
                <p className="text-sm mt-1">Verified orders will appear here for worker assignment</p>
              </div>
            ) : (
              <div className="space-y-3">
                {verifiedOrders.map(order => (
                  <WorkOrderCard
                    key={order.id.toString()}
                    order={order}
                    electricians={electricians}
                    showAssign
                    onConfirmOrder={handleOpenConfirmDialog}
                    isAssigning={isConfirming}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Active Tab */}
          <TabsContent value="active" className="mt-4">
            {ordersLoading ? (
              <div className="space-y-3">
                {[1, 2].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : activeOrders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No active orders</p>
                <p className="text-sm mt-1">In-progress orders will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeOrders.map(order => (
                  <WorkOrderCard
                    key={order.id.toString()}
                    order={order}
                    electricians={electricians}
                    showActive
                    showComplete
                    onComplete={handleComplete}
                    isCompleting={updateStatusMutation.isPending}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Order Confirmation Dialog */}
        <Dialog
          open={confirmDialog.open}
          onOpenChange={open => !open && setConfirmDialog({ open: false, order: null, electrician: null })}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Confirm Order Assignment
              </DialogTitle>
              <DialogDescription>
                Review the details below before confirming this work order.
              </DialogDescription>
            </DialogHeader>

            {confirmDialog.order && (
              <div className="space-y-4 py-2">
                {/* Order Summary */}
                <div className="bg-muted/30 rounded-lg p-4 space-y-3 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Order ID</span>
                    <span className="text-sm font-bold text-primary">#{confirmDialog.order.id.toString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Service Type</span>
                    <span className="text-sm font-medium text-foreground">{confirmDialog.order.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Assigned Worker</span>
                    <span className="text-sm font-medium text-foreground">
                      {confirmDialog.electrician?.name || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Location</span>
                    <span className="text-sm text-foreground truncate max-w-[180px]">{confirmDialog.order.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Customer</span>
                    <span className="text-sm text-foreground">{confirmDialog.order.customerEmail}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Booked On</span>
                    <span className="text-sm text-foreground">{formatTimestamp(confirmDialog.order.createdAt)}</span>
                  </div>
                </div>

                {/* Price highlight */}
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-foreground">Service Charge</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">₹50</span>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Confirming will assign the worker and move this order to <strong>In Progress</strong> status.
                </p>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmDialog({ open: false, order: null, electrician: null })}
                disabled={isConfirming}
                className="btn-hover-scale"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmOrder}
                disabled={isConfirming}
                className="btn-hover-scale"
              >
                {isConfirming ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Confirming...</>
                ) : (
                  <><CheckCircle className="h-4 w-4 mr-2" /> Confirm Order</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
