import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  Bell,
  Briefcase,
  CheckCircle2,
  Clock,
  GraduationCap,
  Loader2,
  MapPin,
  PartyPopper,
  Users,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type WorkOrder,
  useApplyToWorkOrder,
  useGetAllWorkOrders,
  useIsSubscribedToJobAlerts,
  useSubscribeToJobAlerts,
} from "../hooks/useQueries";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function JobBoard() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: workOrders = [], isLoading: ordersLoading } =
    useGetAllWorkOrders();
  const { data: isSubscribed, isLoading: subLoading } =
    useIsSubscribedToJobAlerts();
  const applyMutation = useApplyToWorkOrder();
  const subscribeMutation = useSubscribeToJobAlerts();

  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<number | null>(
    null,
  );
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applicationConfirmed, setApplicationConfirmed] = useState(false);

  const openJobs = workOrders.filter((wo) => wo.status === "open");
  const selectedOrder = workOrders.find((wo) => wo.id === selectedWorkOrderId);

  const handleApplyClick = (workOrderId: number) => {
    if (!isAuthenticated) {
      toast.error("Please log in to apply for jobs.");
      return;
    }
    setSelectedWorkOrderId(workOrderId);
    setApplicationConfirmed(false);
    setApplyDialogOpen(true);
  };

  const handleApplyConfirm = async () => {
    if (!selectedWorkOrderId) return;
    try {
      await applyMutation.mutateAsync({ workOrderId: selectedWorkOrderId });
      toast.success("Application Confirmed! You're on the waiting list.", {
        duration: 4000,
        icon: <PartyPopper className="w-4 h-4 text-green-500" />,
      });
      setApplicationConfirmed(true);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to submit application.");
    }
  };

  const handleDialogClose = () => {
    setApplyDialogOpen(false);
    setSelectedWorkOrderId(null);
    setApplicationConfirmed(false);
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to subscribe to job alerts.");
      login();
      return;
    }
    try {
      await subscribeMutation.mutateAsync();
      toast.success("Successfully subscribed to job alerts!", {
        duration: 2000,
        icon: <CheckCircle2 className="text-green-500 w-4 h-4" />,
      });
    } catch (err: any) {
      const msg = err?.message ?? "Failed to subscribe to job alerts.";
      if (msg.includes("already subscribed")) {
        toast.info("You are already subscribed to job alerts.");
      } else {
        toast.error(msg, { duration: 2000 });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Briefcase className="w-8 h-8 text-primary" />
                Job Board
              </h1>
              <p className="text-muted-foreground mt-1">
                Browse open service requests and apply to work on them.
              </p>
              {/* Any ITI Course Banner */}
              <div className="flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 text-xs font-medium w-fit">
                <GraduationCap className="w-3.5 h-3.5" />
                Any ITI Course Learning Accepted — All qualified workers
                welcome!
              </div>
            </div>

            {/* Job Alert Subscription */}
            <div className="flex items-center gap-3">
              {!subLoading && isSubscribed ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
                  <Bell className="w-4 h-4" />
                  Alerts Active
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSubscribe}
                  disabled={subscribeMutation.isPending || subLoading}
                  className="flex items-center gap-2"
                  data-ocid="jobboard.subscribe.button"
                >
                  {subscribeMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                  {subscribeMutation.isPending
                    ? "Subscribing..."
                    : "Get Job Alerts"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {ordersLoading ? (
          <div
            className="flex items-center justify-center py-20"
            data-ocid="jobboard.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : openJobs.length === 0 ? (
          /* Empty State */
          <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-ocid="jobboard.empty_state"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Zap className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No Open Jobs Right Now
            </h2>
            <p className="text-muted-foreground max-w-md mb-6">
              There are no open service requests at the moment.
            </p>

            {/* Subscribe to job alerts note */}
            <div className="w-full max-w-md mb-4 p-4 rounded-xl border border-primary/30 bg-primary/5 text-left">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Subscribe to Job Alerts
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Subscribe to job alerts so we can notify you the moment new
                    jobs are posted. Be the first to know and grab the
                    opportunity!
                  </p>
                  {!isSubscribed ? (
                    <Button
                      size="sm"
                      onClick={handleSubscribe}
                      disabled={subscribeMutation.isPending}
                      className="mt-3 flex items-center gap-2"
                      data-ocid="jobboard.subscribe.primary_button"
                    >
                      {subscribeMutation.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Bell className="w-3.5 h-3.5" />
                      )}
                      {subscribeMutation.isPending
                        ? "Subscribing..."
                        : "Subscribe to Job Alerts"}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 mt-3 text-green-600 dark:text-green-400 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      You're subscribed! We'll notify you of new jobs.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Already applied / waiting list info card */}
            <div className="w-full max-w-md p-4 rounded-xl border border-green-500/30 bg-green-500/5 text-left">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Already Applied? No Worries!
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Your application is confirmed and you're on the waiting
                    list. We'll alert you as soon as a job becomes available for
                    you.
                  </p>
                  <div className="flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">
                      Application Confirmed — Waiting List
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {openJobs.length}
                </span>{" "}
                open {openJobs.length === 1 ? "job" : "jobs"} available
              </p>
            </div>

            <div className="grid gap-4">
              {openJobs.map((job, idx) => (
                <JobCard
                  key={job.id}
                  job={job}
                  index={idx + 1}
                  isAuthenticated={isAuthenticated}
                  onApply={() => handleApplyClick(job.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Apply Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md" data-ocid="jobboard.dialog">
          <DialogHeader>
            <DialogTitle>
              {applicationConfirmed
                ? "Application Confirmed!"
                : "Apply for Job"}
            </DialogTitle>
            <DialogDescription>
              {applicationConfirmed
                ? "You have been added to the workers waiting list."
                : "You are about to apply for the following service request."}
            </DialogDescription>
          </DialogHeader>

          {applicationConfirmed ? (
            /* Success State */
            <div className="space-y-4 py-2">
              <div className="flex flex-col items-center text-center py-4 gap-3">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <PartyPopper className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-bold text-lg text-foreground">
                  You're on the Waiting List!
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Your application is confirmed. You have been added to the
                  workers waiting list. We will alert you when the job is
                  assigned to you.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20 flex items-start gap-2">
                <Bell className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Job Alert:</strong> You
                  will receive an alert as soon as this job is assigned to you.
                  No need to keep checking — we'll notify you!
                </p>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleDialogClose}
                  className="w-full"
                  data-ocid="jobboard.confirm_button"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Got it, I'm on the list!
                </Button>
              </DialogFooter>
            </div>
          ) : (
            /* Apply State */
            <>
              {selectedOrder && (
                <div className="space-y-3 py-2">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
                    <h3 className="font-semibold text-foreground">
                      {selectedOrder.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedOrder.location}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <PriorityBadge priority={selectedOrder.priority} />
                      <StatusBadge status={selectedOrder.status} />
                    </div>
                  </div>
                  {/* Any ITI note */}
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                    <GraduationCap className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">
                        Any ITI Course Accepted.
                      </strong>{" "}
                      All ITI course graduates are welcome to apply for this
                      job.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Your application will be reviewed. Once confirmed, you'll
                      be added to the workers waiting list and alerted when
                      assigned.
                    </p>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleDialogClose}
                  disabled={applyMutation.isPending}
                  data-ocid="jobboard.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApplyConfirm}
                  disabled={applyMutation.isPending}
                  data-ocid="jobboard.submit_button"
                >
                  {applyMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Confirm Application"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface JobCardProps {
  job: WorkOrder;
  index: number;
  isAuthenticated: boolean;
  onApply: () => void;
}

function JobCard({ job, index, isAuthenticated, onApply }: JobCardProps) {
  return (
    <Card
      className="hover:border-primary/40 transition-colors"
      data-ocid={`jobboard.item.${index}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight">{job.title}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {job.description}
            </CardDescription>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-xl font-bold text-primary">₹50</div>
            <div className="text-xs text-muted-foreground">Fixed Price</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            {job.location}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(job.createdAt)}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={job.priority} />
            <StatusBadge status={job.status} />
            {job.preferredEducation ? (
              <Badge
                variant="outline"
                className="text-xs flex items-center gap-1 border-green-500/40 text-green-700 dark:text-green-400"
              >
                <GraduationCap className="w-3 h-3" />
                Any ITI Course Accepted
              </Badge>
            ) : null}
          </div>

          <Button
            size="sm"
            onClick={onApply}
            disabled={!isAuthenticated}
            className="shrink-0 font-semibold"
            title={!isAuthenticated ? "Log in to apply" : "Apply for this job"}
            data-ocid={`jobboard.item.${index}`}
          >
            Apply Now
          </Button>
        </div>

        {!isAuthenticated && (
          <p className="text-xs text-muted-foreground mt-2">
            Please log in to apply for jobs.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
