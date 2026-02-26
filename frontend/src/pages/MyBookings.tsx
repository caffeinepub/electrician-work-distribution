import { useGetCurrentUserWorkOrders, useAcceptWorkOrder, useDeclineWorkOrder } from '../hooks/useQueries';
import { WorkOrderStatus, ApplicationProcessStatus } from '../backend';
import type { WorkOrder } from '../backend';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { ApplicationStatusBadge } from '../components/ApplicationStatusBadge';
import { formatTimestamp } from '../lib/utils';
import { BookMarked, Wrench, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';

export default function MyBookings() {
  const { data: bookings = [], isLoading, isError } = useGetCurrentUserWorkOrders();
  const acceptWorkOrder = useAcceptWorkOrder();
  const declineWorkOrder = useDeclineWorkOrder();

  const ongoingBookings = bookings.filter(
    (b) => b.status === WorkOrderStatus.open || b.status === WorkOrderStatus.inProgress
  );
  const pastBookings = bookings.filter(
    (b) => b.status === WorkOrderStatus.completed || b.status === WorkOrderStatus.cancelled
  );

  const handleAccept = async (booking: WorkOrder) => {
    try {
      await acceptWorkOrder.mutateAsync(booking.id);
      toast.success(`Accepted: ${booking.title}`);
    } catch {
      toast.error('Failed to accept. Please try again.');
    }
  };

  const handleDecline = async (booking: WorkOrder) => {
    try {
      await declineWorkOrder.mutateAsync(booking.id);
      toast.success(`Declined: ${booking.title}`);
    } catch {
      toast.error('Failed to decline. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-destructive">
        Failed to load bookings. Please try again.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-3">
        <BookMarked className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">My Bookings</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <BookMarked className="w-12 h-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-semibold text-muted-foreground">No bookings found</h2>
          <p className="text-muted-foreground">You haven't made any service requests yet.</p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Wrench className="w-4 h-4" />
            Browse Services
          </Link>
        </div>
      ) : (
        <>
          {/* Ongoing Bookings */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              Ongoing Requests
              <span className="text-sm font-normal text-muted-foreground">({ongoingBookings.length})</span>
            </h2>
            {ongoingBookings.length === 0 ? (
              <p className="text-muted-foreground text-sm">No ongoing requests.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ongoingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id.toString()}
                    booking={booking}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                    isAccepting={acceptWorkOrder.isPending && acceptWorkOrder.variables === booking.id}
                    isDeclining={declineWorkOrder.isPending && declineWorkOrder.variables === booking.id}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Past Bookings */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-muted-foreground inline-block" />
              Past Requests
              <span className="text-sm font-normal text-muted-foreground">({pastBookings.length})</span>
            </h2>
            {pastBookings.length === 0 ? (
              <p className="text-muted-foreground text-sm">No past requests.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastBookings.map((booking) => (
                  <BookingCard
                    key={booking.id.toString()}
                    booking={booking}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                    isAccepting={acceptWorkOrder.isPending && acceptWorkOrder.variables === booking.id}
                    isDeclining={declineWorkOrder.isPending && declineWorkOrder.variables === booking.id}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

interface BookingCardProps {
  booking: WorkOrder;
  onAccept: (booking: WorkOrder) => void;
  onDecline: (booking: WorkOrder) => void;
  isAccepting: boolean;
  isDeclining: boolean;
}

function BookingCard({ booking, onAccept, onDecline, isAccepting, isDeclining }: BookingCardProps) {
  const isPendingDecision = booking.applicationStatus === ApplicationProcessStatus.pending;

  return (
    <div className="bg-card border border-border rounded-sm p-4 space-y-3 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-sm leading-tight">{booking.title}</h3>
        <span className="text-xs text-muted-foreground font-mono shrink-0">#{booking.id.toString()}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={booking.status} />
        <PriorityBadge priority={Number(booking.priority)} />
        <ApplicationStatusBadge status={booking.applicationStatus} />
      </div>
      <div className="text-xs text-muted-foreground space-y-1">
        <p><span className="text-foreground/60">Service:</span> {booking.description.slice(0, 60)}{booking.description.length > 60 ? '…' : ''}</p>
        <p><span className="text-foreground/60">Location:</span> {booking.location}</p>
        <p><span className="text-foreground/60">Date:</span> {formatTimestamp(booking.createdAt)}</p>
      </div>

      {/* Accept / Decline buttons for pending application status */}
      {isPendingDecision && (
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 flex items-center justify-center gap-1"
            onClick={() => onAccept(booking)}
            disabled={isAccepting || isDeclining}
          >
            {isAccepting ? (
              <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-emerald-400" />
            ) : (
              <ThumbsUp className="w-3 h-3" />
            )}
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center justify-center gap-1"
            onClick={() => onDecline(booking)}
            disabled={isAccepting || isDeclining}
          >
            {isDeclining ? (
              <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-400" />
            ) : (
              <ThumbsDown className="w-3 h-3" />
            )}
            Decline
          </Button>
        </div>
      )}
    </div>
  );
}
