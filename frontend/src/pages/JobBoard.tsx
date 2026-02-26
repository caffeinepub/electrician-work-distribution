import { useState, useEffect } from 'react';
import { MapPin, Clock, DollarSign, Briefcase, ChevronRight, Loader2, Info, CheckCircle2, Bell, BellRing, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  useGetAllWorkOrders,
  useApplyForWorkOrder,
  useAcceptWorkOrder,
  useDeclineWorkOrder,
  useIsSubscribedToJobAlerts,
  useSubscribeToJobAlerts,
} from '@/hooks/useQueries';
import { ApplicationStatusBadge } from '@/components/ApplicationStatusBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { WorkOrder, ApplicationProcessStatus, WorkOrderStatus } from '@/backend';
import { formatTimestamp } from '@/lib/utils';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

// localStorage key for tracking applied job IDs per session
const APPLIED_JOBS_KEY = 'appliedJobIds';

function getAppliedJobIds(): Set<string> {
  try {
    const raw = localStorage.getItem(APPLIED_JOBS_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function addAppliedJobId(id: string) {
  const ids = getAppliedJobIds();
  ids.add(id);
  localStorage.setItem(APPLIED_JOBS_KEY, JSON.stringify([...ids]));
}

export default function JobBoard() {
  const { data: allWorkOrders = [], isLoading } = useGetAllWorkOrders();
  const applyMutation = useApplyForWorkOrder();
  const acceptMutation = useAcceptWorkOrder();
  const declineMutation = useDeclineWorkOrder();
  const { data: isSubscribed = false } = useIsSubscribedToJobAlerts();
  const subscribeMutation = useSubscribeToJobAlerts();
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [appliedIds, setAppliedIds] = useState<Set<string>>(getAppliedJobIds);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<WorkOrder | null>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  // Refresh applied IDs from localStorage on mount
  useEffect(() => {
    setAppliedIds(getAppliedJobIds());
  }, []);

  // Filter: only open jobs, not already applied by this worker
  const availableJobs = allWorkOrders.filter((wo) => {
    const idStr = String(wo.id);
    if (appliedIds.has(idStr)) return false;
    if (wo.status !== WorkOrderStatus.open) return false;
    return true;
  });

  const filteredJobs = availableJobs.filter((wo) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      wo.title.toLowerCase().includes(q) ||
      wo.description.toLowerCase().includes(q) ||
      wo.location.toLowerCase().includes(q)
    );
  });

  // Jobs this worker has applied to
  const myAppliedJobs = allWorkOrders.filter((wo) => {
    const idStr = String(wo.id);
    return appliedIds.has(idStr);
  });

  const handleOpenApplyDialog = (job: WorkOrder) => {
    setSelectedJob(job);
    setApplySuccess(false);
    setApplyDialogOpen(true);
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    try {
      await applyMutation.mutateAsync(selectedJob.id);
      const idStr = String(selectedJob.id);
      addAppliedJobId(idStr);
      setAppliedIds(getAppliedJobIds());
      setApplySuccess(true);
    } catch (err: unknown) {
      console.error('Apply failed:', err);
    }
  };

  const handleAccept = async (workOrderId: bigint) => {
    try {
      await acceptMutation.mutateAsync(workOrderId);
    } catch (err) {
      console.error('Accept failed:', err);
    }
  };

  const handleDecline = async (workOrderId: bigint) => {
    try {
      await declineMutation.mutateAsync(workOrderId);
    } catch (err) {
      console.error('Decline failed:', err);
    }
  };

  const handleJoinUs = async () => {
    if (!isAuthenticated) {
      setLoginPromptOpen(true);
      return;
    }
    try {
      await subscribeMutation.mutateAsync();
      setSubscribeSuccess(true);
    } catch (err: unknown) {
      console.error('Subscribe failed:', err);
    }
  };

  const priorityLabel = (p: bigint) => {
    const n = Number(p);
    if (n === 1) return 'Low';
    if (n === 2) return 'Medium';
    if (n === 3) return 'High';
    return 'Urgent';
  };

  const alreadySubscribed = isSubscribed || subscribeSuccess;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Job Board</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Browse available jobs and apply. First to apply gets assigned after admin verification.
        </p>
      </div>

      {/* Info Banner */}
      <Alert className="border-primary/30 bg-primary/5">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm text-foreground">
          <strong>How it works:</strong> Apply for a job → Admin verifies your application → Admin confirms assignment → Job is yours!
        </AlertDescription>
      </Alert>

      {/* My Applied Jobs */}
      {myAppliedJobs.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">My Applications</h2>
          <div className="space-y-3">
            {myAppliedJobs.map((job) => (
              <Card key={String(job.id)} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground text-sm">{job.title}</h3>
                        <ApplicationStatusBadge status={job.applicationStatus} />
                        <StatusBadge status={job.status} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{job.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />{formatTimestamp(job.createdAt)}
                        </span>
                      </div>
                    </div>
                    {/* Admin actions for verified-pending-assignment jobs */}
                    {job.applicationStatus === ApplicationProcessStatus.verifiedPendingAssignment && (
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleAccept(job.id)}
                          disabled={acceptMutation.isPending}
                        >
                          {acceptMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Accept'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDecline(job.id)}
                          disabled={declineMutation.isPending}
                        >
                          {declineMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Decline'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Search */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search jobs by title, description, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} available
        </span>
      </div>

      {/* Job Listings */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredJobs.length === 0 ? (
        /* ── "Join Us" Empty State ── */
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-full max-w-lg bg-gradient-to-br from-primary/10 via-card to-primary/5 border border-primary/20 rounded-2xl p-8 text-center shadow-lg space-y-5">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-primary" />
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">
                {searchQuery ? 'No jobs match your search' : 'No Jobs Available Right Now'}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {searchQuery
                  ? 'Try a different search term or clear the filter to see all jobs.'
                  : 'New jobs are posted regularly. Join our worker network and be the first to know when a new job is available!'}
              </p>
            </div>

            {/* Alert notification message */}
            {!searchQuery && (
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 text-sm text-foreground">
                <BellRing className="w-4 h-4 text-primary flex-shrink-0" />
                <span>
                  <strong>Stay ahead!</strong> We'll alert you the moment a new job is posted.
                </span>
              </div>
            )}

            {/* CTA */}
            {!searchQuery && (
              alreadySubscribed ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>You're on the list!</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We'll alert you when new jobs are posted. Stay tuned!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full gap-2 font-semibold text-base"
                    onClick={handleJoinUs}
                    disabled={subscribeMutation.isPending}
                  >
                    {subscribeMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4" />
                        Join Us – Get Job Alerts
                      </>
                    )}
                  </Button>
                  {subscribeMutation.isError && (
                    <p className="text-xs text-destructive">
                      {String(subscribeMutation.error).includes('already subscribed')
                        ? "You're already subscribed to job alerts!"
                        : 'Something went wrong. Please try again.'}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Free to join. No spam. Unsubscribe anytime.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <Card
              key={String(job.id)}
              className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => handleOpenApplyDialog(job)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-semibold text-foreground line-clamp-2">
                    {job.title}
                  </CardTitle>
                  <PriorityBadge priority={Number(job.priority)} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-2">{job.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />₹{(Number(job.paymentAmount) / 100).toFixed(0)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />{formatTimestamp(job.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    <StatusBadge status={job.status} />
                    <Badge variant="outline" className="text-xs">{priorityLabel(job.priority)}</Badge>
                  </div>
                  <Button size="sm" variant="ghost" className="text-primary hover:text-primary gap-1">
                    Apply <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Simple Apply Dialog ── */}
      <Dialog open={applyDialogOpen} onOpenChange={(open) => {
        setApplyDialogOpen(open);
        if (!open) setApplySuccess(false);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {applySuccess ? 'Application Submitted!' : 'Apply for Job'}
            </DialogTitle>
            {selectedJob && !applySuccess && (
              <DialogDescription>{selectedJob.title}</DialogDescription>
            )}
          </DialogHeader>

          {!applySuccess && selectedJob && (
            <div className="space-y-4">
              {/* Job summary */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="text-foreground font-medium">{selectedJob.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Priority</span>
                  <PriorityBadge priority={Number(selectedJob.priority)} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="text-foreground font-medium">₹{(Number(selectedJob.paymentAmount) / 100).toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment</span>
                  <span className="text-foreground font-medium">{selectedJob.paymentMethod}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{selectedJob.description}</p>
              <Alert className="border-amber-500/30 bg-amber-500/5">
                <Info className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-xs text-foreground">
                  First applicant gets priority. Your application will be reviewed by an admin before assignment is confirmed.
                </AlertDescription>
              </Alert>
              {applyMutation.isError && (
                <p className="text-sm text-destructive">
                  Failed to submit application. The job may already have an applicant.
                </p>
              )}
            </div>
          )}

          {applySuccess && (
            <div className="text-center py-4 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                Your application has been submitted and is <strong>pending admin verification</strong>.
                You'll be assigned once an admin reviews and confirms your application.
              </p>
            </div>
          )}

          <DialogFooter>
            {applySuccess ? (
              <Button onClick={() => setApplyDialogOpen(false)} className="w-full">
                Close
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleApply}
                  disabled={applyMutation.isPending}
                >
                  {applyMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </span>
                  ) : 'Apply Now'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Login Prompt Dialog ── */}
      <Dialog open={loginPromptOpen} onOpenChange={setLoginPromptOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              Please log in to subscribe to job alerts and be notified when new jobs are posted.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Join our worker network and never miss a job opportunity!
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoginPromptOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setLoginPromptOpen(false);
                await login();
              }}
              disabled={loginStatus === 'logging-in'}
            >
              {loginStatus === 'logging-in' ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in...
                </span>
              ) : 'Login'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
