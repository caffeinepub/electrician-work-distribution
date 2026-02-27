import { Loader2, BookOpen, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { useGetCurrentUserWorkOrders, useAcceptWorkOrder, useDeclineWorkOrder } from '../hooks/useQueries';
import { WorkOrderStatus, ApplicationProcessStatus } from '../backend';
import StatusBadge from '../components/StatusBadge';
import ApplicationStatusBadge from '../components/ApplicationStatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { formatTimestamp } from '../lib/utils';

export default function MyBookings() {
  const navigate = useNavigate();
  const { data: workOrders = [], isLoading, error } = useGetCurrentUserWorkOrders();
  const acceptMutation = useAcceptWorkOrder();
  const declineMutation = useDeclineWorkOrder();

  const ongoingOrders = workOrders.filter(
    (wo) => wo.status === WorkOrderStatus.open || wo.status === WorkOrderStatus.inProgress
  );
  const pastOrders = workOrders.filter(
    (wo) => wo.status === WorkOrderStatus.completed || wo.status === WorkOrderStatus.cancelled
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive text-sm">
          Failed to load bookings. Please try again.
        </div>
      </div>
    );
  }

  if (workOrders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="text-center max-w-sm">
          <div className="rounded-full bg-muted p-4 w-fit mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-display font-bold mb-2">No Bookings Yet</h2>
          <p className="text-muted-foreground text-sm mb-6">
            You haven't made any service requests yet. Browse our services to get started.
          </p>
          <Button onClick={() => navigate({ to: '/services' })} className="gap-2">
            Browse Services
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const OrderCard = ({ wo }: { wo: typeof workOrders[0] }) => (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{wo.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{wo.location}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StatusBadge status={wo.status} />
          <PriorityBadge priority={wo.priority} />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Submitted: {formatTimestamp(wo.createdAt)}</span>
        <ApplicationStatusBadge status={wo.applicationStatus} />
      </div>
      {wo.applicationStatus === ApplicationProcessStatus.verifiedPendingAssignment && (
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-1 text-green-500 border-green-500/30 hover:bg-green-500/10"
            onClick={() => acceptMutation.mutate(wo.id)}
            disabled={acceptMutation.isPending}
          >
            {acceptMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={() => declineMutation.mutate(wo.id)}
            disabled={declineMutation.isPending}
          >
            {declineMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
            Decline
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">My Bookings</h1>
        <p className="text-muted-foreground">Track your service requests and their status.</p>
      </div>

      {ongoingOrders.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
            Ongoing Requests ({ongoingOrders.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ongoingOrders.map((wo) => <OrderCard key={String(wo.id)} wo={wo} />)}
          </div>
        </section>
      )}

      {pastOrders.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-muted-foreground inline-block" />
            Past Requests ({pastOrders.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastOrders.map((wo) => <OrderCard key={String(wo.id)} wo={wo} />)}
          </div>
        </section>
      )}
    </div>
  );
}
