import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Loader2,
  Star,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import ApplicationStatusBadge from "../components/ApplicationStatusBadge";
import StatusBadge from "../components/StatusBadge";
import {
  useGetCurrentUserWorkOrders,
  useSubmitWorkerRating,
} from "../hooks/useQueries";
import type { WorkOrder } from "../lib/types";
import { formatTimestamp } from "../lib/utils";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function MyBookings() {
  const { data: workOrders = [], isLoading } = useGetCurrentUserWorkOrders();
  const submitRatingMutation = useSubmitWorkerRating();

  const [ratingDialog, setRatingDialog] = useState<{
    open: boolean;
    orderId: number | null;
  }>({ open: false, orderId: null });
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState("");

  const ongoingOrders = workOrders.filter(
    (wo) => wo.status === "open" || wo.status === "inProgress",
  );
  const pastOrders = workOrders.filter(
    (wo) => wo.status === "completed" || wo.status === "cancelled",
  );

  const handleSubmitRating = async () => {
    if (!ratingDialog.orderId) return;
    try {
      await submitRatingMutation.mutateAsync({
        orderId: ratingDialog.orderId,
        rating: ratingValue,
        comment: ratingComment,
      });
      toast.success("Rating submitted!");
      setRatingDialog({ open: false, orderId: null });
      setRatingValue(5);
      setRatingComment("");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to submit rating.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <CalendarCheck className="w-8 h-8 text-primary" />
          My Bookings
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your service requests.
        </p>
      </div>

      {workOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <CalendarCheck className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No Bookings Yet
          </h2>
          <p className="text-muted-foreground">
            You haven't booked any services yet. Browse our services to get
            started.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Ongoing */}
          {ongoingOrders.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Ongoing Requests ({ongoingOrders.length})
              </h2>
              <div className="grid gap-4">
                {ongoingOrders.map((order) => (
                  <BookingCard
                    key={order.id}
                    order={order}
                    onRate={() =>
                      setRatingDialog({ open: true, orderId: order.id })
                    }
                  />
                ))}
              </div>
            </section>
          )}

          {/* Past */}
          {pastOrders.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                Past Requests ({pastOrders.length})
              </h2>
              <div className="grid gap-4">
                {pastOrders.map((order) => (
                  <BookingCard
                    key={order.id}
                    order={order}
                    onRate={() =>
                      setRatingDialog({ open: true, orderId: order.id })
                    }
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Rating Dialog */}
      <Dialog
        open={ratingDialog.open}
        onOpenChange={(open) => setRatingDialog({ open, orderId: null })}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Rate the Service</DialogTitle>
            <DialogDescription>
              How was your experience with the technician?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingValue(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        star <= ratingValue
                          ? "text-amber-400 fill-amber-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Comment (optional)</Label>
              <Textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRatingDialog({ open: false, orderId: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRating}
              disabled={submitRatingMutation.isPending}
            >
              {submitRatingMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Submit Rating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface BookingCardProps {
  order: WorkOrder;
  onRate: () => void;
}

function BookingCard({ order, onRate }: BookingCardProps) {
  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">
              #{order.id} — {order.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {order.description}
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-1">
            <StatusBadge status={order.status} />
            <ApplicationStatusBadge status={order.applicationStatus} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-3 flex-wrap text-sm text-muted-foreground">
          <span>{formatDate(order.createdAt)}</span>
          <span className="font-semibold text-primary">
            ₹{order.paymentAmount}
          </span>
        </div>

        {order.status === "completed" && !order.workerRating && (
          <Button
            size="sm"
            variant="outline"
            className="mt-3 w-full"
            onClick={onRate}
          >
            <Star className="w-3.5 h-3.5 mr-1" />
            Rate this Service
          </Button>
        )}

        {order.status === "completed" && order.workerRating && (
          <div className="mt-3 flex items-center gap-1 text-sm text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>You rated this service {order.workerRating.rating}/5</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
