import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ClipboardList, MapPin, Calendar, IndianRupee,
  CheckCircle, Clock, AlertCircle, Star
} from 'lucide-react';
import { useGetCurrentUserWorkOrders, useSubmitWorkerRating } from '../hooks/useQueries';
import { WorkOrderStatus, ApplicationProcessStatus } from '../backend';
import StatusBadge from '../components/StatusBadge';
import ApplicationStatusBadge from '../components/ApplicationStatusBadge';
import WorkerChecklist from '../components/WorkerChecklist';
import PageTransition from '../components/PageTransition';
import { formatTimestamp } from '../lib/utils';
import { toast } from 'sonner';

export default function MyBookings() {
  const { data: orders = [], isLoading } = useGetCurrentUserWorkOrders();
  const submitRating = useSubmitWorkerRating();
  const [ratingDialog, setRatingDialog] = useState<{ open: boolean; orderId: bigint | null }>({
    open: false,
    orderId: null,
  });
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  const ongoingOrders = orders.filter(
    o =>
      o.status === WorkOrderStatus.open ||
      o.status === WorkOrderStatus.inProgress
  );
  const pastOrders = orders.filter(
    o =>
      o.status === WorkOrderStatus.completed ||
      o.status === WorkOrderStatus.cancelled
  );

  const handleSubmitRating = () => {
    if (!ratingDialog.orderId) return;
    submitRating.mutate(
      { workOrderId: ratingDialog.orderId, rating: BigInt(ratingValue), comment: ratingComment },
      {
        onSuccess: () => {
          toast.success('Rating submitted!');
          setRatingDialog({ open: false, orderId: null });
          setRatingValue(5);
          setRatingComment('');
        },
        onError: (err: any) => toast.error(err?.message || 'Failed to submit rating'),
      }
    );
  };

  const renderOrderCard = (order: typeof orders[0], showChecklist = false) => (
    <Card
      key={order.id.toString()}
      className="border-border hover:border-primary/30 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">#{order.id.toString()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm truncate">{order.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{order.description}</p>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-3">
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
          <ApplicationStatusBadge status={order.applicationStatus} />
        </div>

        {/* Worker Checklist for In Progress orders */}
        {showChecklist && order.status === WorkOrderStatus.inProgress && (
          <WorkerChecklist workOrderId={order.id.toString()} />
        )}

        {/* Rate button for completed orders */}
        {order.status === WorkOrderStatus.completed && !order.workerRating && (
          <Button
            size="sm"
            variant="outline"
            className="btn-hover-scale"
            onClick={() => setRatingDialog({ open: true, orderId: order.id })}
          >
            <Star className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
            Rate Service
          </Button>
        )}
        {order.status === WorkOrderStatus.completed && order.workerRating && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span>You rated this service {order.workerRating.rating.toString()}/5</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            My Bookings
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your service requests and their progress
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" />
              {[1, 2].map(i => (
                <Card key={i} className="border-border">
                  <CardContent className="p-4 space-y-3">
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="h-8 w-8 text-primary opacity-60" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Book a service to see your requests here
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/services'}
              className="btn-hover-scale"
            >
              Browse Services
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Ongoing */}
            {ongoingOrders.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="h-4 w-4 text-blue-400" />
                  <h2 className="text-base font-semibold text-foreground">Ongoing Requests</h2>
                  <Badge variant="outline" className="text-xs text-blue-400 border-blue-400/30">
                    {ongoingOrders.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {ongoingOrders.map(order => renderOrderCard(order, true))}
                </div>
              </section>
            )}

            {/* Past */}
            {pastOrders.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-base font-semibold text-foreground">Past Requests</h2>
                  <Badge variant="outline" className="text-xs">
                    {pastOrders.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {pastOrders.map(order => renderOrderCard(order, false))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Rating Dialog */}
        {ratingDialog.open && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm space-y-4 animate-fade-in">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-400" />
                Rate This Service
              </h3>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRatingValue(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= ratingValue ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={ratingComment}
                onChange={e => setRatingComment(e.target.value)}
                placeholder="Leave a comment (optional)..."
                className="w-full bg-muted/30 border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none h-20 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 btn-hover-scale"
                  onClick={() => setRatingDialog({ open: false, orderId: null })}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 btn-hover-scale"
                  onClick={handleSubmitRating}
                  disabled={submitRating.isPending}
                >
                  {submitRating.isPending ? 'Submitting...' : 'Submit Rating'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

// Need to import Activity
function Activity({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
