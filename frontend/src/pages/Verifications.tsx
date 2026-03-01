import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, Flag, ShieldCheck, AlertCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  usePendingWorkOrders,
  usePendingElectricians,
  usePendingJobApplications,
  usePendingPayments,
  useApproveWorkOrder,
  useRejectWorkOrder,
  useApproveElectrician,
  useRejectElectrician,
  useApproveJobApplication,
  useRejectJobApplication,
  useApprovePayment,
  useFlagPayment,
  useGetWorkOrderApplication,
} from '../hooks/useQueries';
import { WorkOrder, Electrician } from '../backend';
import { getPriorityLabel, getPriorityClass, getSpecialityLabel, getQualificationLabel } from '../lib/utils';
import { Principal } from '@dfinity/principal';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function VerificationStatusBadge({ status }: { status: { __kind__: string; rejected?: string } }) {
  if (status.__kind__ === 'approved') {
    return <Badge className="bg-green-600/20 text-green-400 border-green-600/30">Approved</Badge>;
  }
  if (status.__kind__ === 'rejected') {
    return <Badge className="bg-red-600/20 text-red-400 border-red-600/30">Rejected</Badge>;
  }
  if (status.__kind__ === 'verifiedPendingAssignment') {
    return <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">Verified</Badge>;
  }
  return <Badge className="bg-amber-600/20 text-amber-400 border-amber-600/30">Pending</Badge>;
}

function PaymentStatusBadge({ status }: { status: { __kind__: string; flagged?: string } }) {
  if (status.__kind__ === 'confirmed') {
    return <Badge className="bg-green-600/20 text-green-400 border-green-600/30">Confirmed</Badge>;
  }
  if (status.__kind__ === 'paid') {
    return <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">Paid</Badge>;
  }
  if (status.__kind__ === 'flagged') {
    return <Badge className="bg-red-600/20 text-red-400 border-red-600/30">Flagged</Badge>;
  }
  return <Badge className="bg-amber-600/20 text-amber-400 border-amber-600/30">Pending</Badge>;
}

// ─── Reason Dialog ────────────────────────────────────────────────────────────

interface ReasonDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title: string;
  description: string;
  isPending: boolean;
  confirmLabel?: string;
  confirmVariant?: 'destructive' | 'default';
}

function ReasonDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  isPending,
  confirmLabel = 'Confirm',
  confirmVariant = 'destructive',
}: ReasonDialogProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason.trim());
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setReason(''); onClose(); } }}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="reason">Reason / Note</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason..."
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { setReason(''); onClose(); }} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={isPending || !reason.trim()}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Work Order Row ───────────────────────────────────────────────────────────

function WorkOrderRow({ order }: { order: WorkOrder }) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const approveWO = useApproveWorkOrder();
  const rejectWO = useRejectWorkOrder();

  const handleApprove = async () => {
    try {
      await approveWO.mutateAsync(order.id);
      toast.success(`Work order #${order.id} approved`);
    } catch (e: unknown) {
      toast.error(`Failed to approve: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleReject = async (reason: string) => {
    try {
      await rejectWO.mutateAsync({ id: order.id, reason });
      toast.success(`Work order #${order.id} rejected`);
      setRejectOpen(false);
    } catch (e: unknown) {
      toast.error(`Failed to reject: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-foreground truncate">#{String(order.id)} {order.title}</span>
          <VerificationStatusBadge status={order.verificationStatus} />
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityClass(Number(order.priority))}`}>
            {getPriorityLabel(Number(order.priority))}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1 truncate">{order.location}</p>
        <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          variant="outline"
          className="border-green-600/50 text-green-400 hover:bg-green-600/10"
          onClick={handleApprove}
          disabled={approveWO.isPending || order.verificationStatus.__kind__ === 'approved'}
        >
          {approveWO.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle className="h-3.5 w-3.5" />
          )}
          <span className="ml-1">Approve</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-red-600/50 text-red-400 hover:bg-red-600/10"
          onClick={() => setRejectOpen(true)}
          disabled={rejectWO.isPending || order.verificationStatus.__kind__ === 'rejected'}
        >
          <XCircle className="h-3.5 w-3.5" />
          <span className="ml-1">Reject</span>
        </Button>
      </div>
      <ReasonDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
        title="Reject Work Order"
        description={`Provide a reason for rejecting work order #${order.id}.`}
        isPending={rejectWO.isPending}
        confirmLabel="Reject"
        confirmVariant="destructive"
      />
    </div>
  );
}

// ─── Electrician Row ──────────────────────────────────────────────────────────

function ElectricianRow({ electrician }: { electrician: Electrician }) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const approveE = useApproveElectrician();
  const rejectE = useRejectElectrician();

  const handleApprove = async () => {
    try {
      await approveE.mutateAsync(electrician.id);
      toast.success(`Electrician "${electrician.name}" approved`);
    } catch (e: unknown) {
      toast.error(`Failed to approve: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleReject = async (reason: string) => {
    try {
      await rejectE.mutateAsync({ id: electrician.id, reason });
      toast.success(`Electrician "${electrician.name}" rejected`);
      setRejectOpen(false);
    } catch (e: unknown) {
      toast.error(`Failed to reject: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-foreground">{electrician.name}</span>
          <VerificationStatusBadge status={electrician.verificationStatus} />
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {getSpecialityLabel(electrician.specialist)} · {getQualificationLabel(electrician.qualification)}
        </p>
        <p className="text-xs text-muted-foreground">{electrician.email}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          variant="outline"
          className="border-green-600/50 text-green-400 hover:bg-green-600/10"
          onClick={handleApprove}
          disabled={approveE.isPending || electrician.verificationStatus.__kind__ === 'approved'}
        >
          {approveE.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle className="h-3.5 w-3.5" />
          )}
          <span className="ml-1">Approve</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-red-600/50 text-red-400 hover:bg-red-600/10"
          onClick={() => setRejectOpen(true)}
          disabled={rejectE.isPending || electrician.verificationStatus.__kind__ === 'rejected'}
        >
          <XCircle className="h-3.5 w-3.5" />
          <span className="ml-1">Reject</span>
        </Button>
      </div>
      <ReasonDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
        title="Reject Electrician Profile"
        description={`Provide a reason for rejecting ${electrician.name}'s profile.`}
        isPending={rejectE.isPending}
        confirmLabel="Reject"
        confirmVariant="destructive"
      />
    </div>
  );
}

// ─── Job Application Row ──────────────────────────────────────────────────────

function JobApplicationRow({ order }: { order: WorkOrder }) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const { data: application } = useGetWorkOrderApplication(order.id);
  const approveJA = useApproveJobApplication();
  const rejectJA = useRejectJobApplication();

  const applicantId = application?.applicant;

  const handleApprove = async () => {
    if (!applicantId) return;
    try {
      await approveJA.mutateAsync({ workOrderId: order.id, applicantId: applicantId as Principal });
      toast.success(`Application for #${order.id} approved`);
    } catch (e: unknown) {
      toast.error(`Failed to approve: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleReject = async (reason: string) => {
    if (!applicantId) return;
    try {
      await rejectJA.mutateAsync({ workOrderId: order.id, applicantId: applicantId as Principal, reason });
      toast.success(`Application for #${order.id} rejected`);
      setRejectOpen(false);
    } catch (e: unknown) {
      toast.error(`Failed to reject: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-foreground">#{String(order.id)} {order.title}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityClass(Number(order.priority))}`}>
            {getPriorityLabel(Number(order.priority))}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{order.location}</p>
        {applicantId && (
          <p className="text-xs text-muted-foreground font-mono truncate">
            Applicant: {applicantId.toString().slice(0, 20)}...
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          variant="outline"
          className="border-green-600/50 text-green-400 hover:bg-green-600/10"
          onClick={handleApprove}
          disabled={approveJA.isPending || !applicantId}
        >
          {approveJA.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle className="h-3.5 w-3.5" />
          )}
          <span className="ml-1">Approve</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-red-600/50 text-red-400 hover:bg-red-600/10"
          onClick={() => setRejectOpen(true)}
          disabled={rejectJA.isPending || !applicantId}
        >
          <XCircle className="h-3.5 w-3.5" />
          <span className="ml-1">Reject</span>
        </Button>
      </div>
      <ReasonDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
        title="Reject Job Application"
        description={`Provide a reason for rejecting the application for work order #${order.id}.`}
        isPending={rejectJA.isPending}
        confirmLabel="Reject"
        confirmVariant="destructive"
      />
    </div>
  );
}

// ─── Payment Row ──────────────────────────────────────────────────────────────

function PaymentRow({ order }: { order: WorkOrder }) {
  const [flagOpen, setFlagOpen] = useState(false);
  const approveP = useApprovePayment();
  const flagP = useFlagPayment();

  const handleApprove = async () => {
    try {
      await approveP.mutateAsync(order.id);
      toast.success(`Payment for #${order.id} confirmed`);
    } catch (e: unknown) {
      toast.error(`Failed to confirm: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleFlag = async (note: string) => {
    try {
      await flagP.mutateAsync({ workOrderId: order.id, note });
      toast.success(`Payment for #${order.id} flagged`);
      setFlagOpen(false);
    } catch (e: unknown) {
      toast.error(`Failed to flag: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-foreground">#{String(order.id)} {order.title}</span>
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          ₹{String(order.paymentAmount)} · {order.paymentMethod}
        </p>
        <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          variant="outline"
          className="border-green-600/50 text-green-400 hover:bg-green-600/10"
          onClick={handleApprove}
          disabled={approveP.isPending || order.paymentStatus.__kind__ === 'confirmed'}
        >
          {approveP.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle className="h-3.5 w-3.5" />
          )}
          <span className="ml-1">Confirm</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-amber-600/50 text-amber-400 hover:bg-amber-600/10"
          onClick={() => setFlagOpen(true)}
          disabled={flagP.isPending || order.paymentStatus.__kind__ === 'flagged'}
        >
          <Flag className="h-3.5 w-3.5" />
          <span className="ml-1">Flag</span>
        </Button>
      </div>
      <ReasonDialog
        open={flagOpen}
        onClose={() => setFlagOpen(false)}
        onConfirm={handleFlag}
        title="Flag Payment"
        description={`Provide a note for flagging the payment for work order #${order.id}.`}
        isPending={flagP.isPending}
        confirmLabel="Flag"
        confirmVariant="default"
      />
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="h-10 w-10 text-muted-foreground mb-3 opacity-50" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </div>
  );
}

// ─── Tab Label with Count ─────────────────────────────────────────────────────

function TabLabel({ label, count }: { label: string; count?: number }) {
  return (
    <span className="flex items-center gap-1.5">
      {label}
      {count !== undefined && count > 0 && (
        <span className="inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
          {count}
        </span>
      )}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Verifications() {
  const { data: pendingWorkOrders, isLoading: loadingWO } = usePendingWorkOrders();
  const { data: pendingElectricians, isLoading: loadingE } = usePendingElectricians();
  const { data: pendingJobApplications, isLoading: loadingJA } = usePendingJobApplications();
  const { data: pendingPayments, isLoading: loadingP } = usePendingPayments();

  return (
    <div className="animate-fade-in p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
          <ShieldCheck className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Verifications</h1>
          <p className="text-sm text-muted-foreground">Review and approve pending items</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="work-orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="work-orders" className="text-xs sm:text-sm transition-all duration-200">
            <TabLabel label="Work Orders" count={pendingWorkOrders?.length} />
          </TabsTrigger>
          <TabsTrigger value="electricians" className="text-xs sm:text-sm transition-all duration-200">
            <TabLabel label="Electricians" count={pendingElectricians?.length} />
          </TabsTrigger>
          <TabsTrigger value="job-applications" className="text-xs sm:text-sm transition-all duration-200">
            <TabLabel label="Job Applications" count={pendingJobApplications?.length} />
          </TabsTrigger>
          <TabsTrigger value="payments" className="text-xs sm:text-sm transition-all duration-200">
            <TabLabel label="Payments" count={pendingPayments?.length} />
          </TabsTrigger>
        </TabsList>

        {/* Work Orders Tab */}
        <TabsContent value="work-orders" className="mt-4 animate-fade-in">
          <div className="space-y-3">
            {loadingWO ? (
              <LoadingSkeleton />
            ) : !pendingWorkOrders || pendingWorkOrders.length === 0 ? (
              <EmptyState message="No pending work orders to verify." />
            ) : (
              pendingWorkOrders.map((order) => (
                <WorkOrderRow key={String(order.id)} order={order} />
              ))
            )}
          </div>
        </TabsContent>

        {/* Electricians Tab */}
        <TabsContent value="electricians" className="mt-4 animate-fade-in">
          <div className="space-y-3">
            {loadingE ? (
              <LoadingSkeleton />
            ) : !pendingElectricians || pendingElectricians.length === 0 ? (
              <EmptyState message="No pending electrician profiles to verify." />
            ) : (
              pendingElectricians.map((electrician) => (
                <ElectricianRow key={String(electrician.id)} electrician={electrician} />
              ))
            )}
          </div>
        </TabsContent>

        {/* Job Applications Tab */}
        <TabsContent value="job-applications" className="mt-4 animate-fade-in">
          <div className="space-y-3">
            {loadingJA ? (
              <LoadingSkeleton />
            ) : !pendingJobApplications || pendingJobApplications.length === 0 ? (
              <EmptyState message="No pending job applications to review." />
            ) : (
              pendingJobApplications.map((order) => (
                <JobApplicationRow key={String(order.id)} order={order} />
              ))
            )}
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="mt-4 animate-fade-in">
          <div className="space-y-3">
            {loadingP ? (
              <LoadingSkeleton />
            ) : !pendingPayments || pendingPayments.length === 0 ? (
              <EmptyState message="No pending payments to verify." />
            ) : (
              pendingPayments.map((order) => (
                <PaymentRow key={String(order.id)} order={order} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
