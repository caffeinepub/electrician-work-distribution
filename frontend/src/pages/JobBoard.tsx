import { useState } from 'react';
import { Search, Briefcase, MapPin, Clock, Bell, BellOff, Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useGetAllWorkOrders, useApplyForWorkOrder, useIsSubscribedToJobAlerts, useSubscribeToJobAlerts } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { WorkOrder, WorkOrderStatus, ApplicationProcessStatus } from '../backend';
import { formatTimestamp, getPriorityLabel } from '../lib/utils';
import PriorityBadge from '../components/PriorityBadge';

export default function JobBoard() {
  const [search, setSearch] = useState('');
  const [applyTarget, setApplyTarget] = useState<WorkOrder | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('appliedJobIds');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [loginPrompt, setLoginPrompt] = useState(false);

  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const { data: workOrders = [], isLoading } = useGetAllWorkOrders();
  const applyMutation = useApplyForWorkOrder();
  const { data: isSubscribed } = useIsSubscribedToJobAlerts();
  const subscribeMutation = useSubscribeToJobAlerts();

  const openJobs = workOrders.filter(
    (wo) => wo.status === WorkOrderStatus.open && wo.applicationStatus === ApplicationProcessStatus.pending
  );

  const filteredJobs = openJobs.filter((wo) =>
    wo.title.toLowerCase().includes(search.toLowerCase()) ||
    wo.description.toLowerCase().includes(search.toLowerCase()) ||
    wo.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleApply = async () => {
    if (!applyTarget) return;
    try {
      await applyMutation.mutateAsync(applyTarget.id);
      const newApplied = new Set(appliedIds);
      newApplied.add(String(applyTarget.id));
      setAppliedIds(newApplied);
      localStorage.setItem('appliedJobIds', JSON.stringify([...newApplied]));
      setApplyTarget(null);
    } catch (err: any) {
      // error handled by mutation state
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      setLoginPrompt(true);
      return;
    }
    try {
      await subscribeMutation.mutateAsync();
    } catch {
      // already subscribed or error
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">Job Board</h1>
        <p className="text-muted-foreground">Browse open work orders and apply to jobs that match your skills.</p>
      </div>

      {/* Search & Subscribe */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title, description, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={isSubscribed ? 'outline' : 'default'}
          onClick={handleSubscribe}
          disabled={subscribeMutation.isPending || isSubscribed === true}
          className="gap-2 shrink-0"
        >
          {subscribeMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSubscribed ? (
            <BellOff className="h-4 w-4" />
          ) : (
            <Bell className="h-4 w-4" />
          )}
          {isSubscribed ? 'Subscribed' : 'Get Job Alerts'}
        </Button>
      </div>

      {/* Job Listings */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Open Jobs</h3>
          <p className="text-muted-foreground text-sm mb-6">
            {search ? 'No jobs match your search.' : 'There are no open job listings at the moment.'}
          </p>
          {!search && !isSubscribed && (
            <Button onClick={handleSubscribe} variant="outline" className="gap-2">
              <Bell className="h-4 w-4" />
              Subscribe to Job Alerts
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const hasApplied = appliedIds.has(String(job.id));
            return (
              <div key={String(job.id)} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-display font-semibold text-base">{job.title}</h3>
                      <PriorityBadge priority={job.priority} />
                    </div>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{job.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(job.createdAt)}
                      </span>
                      {job.preferredEducation && (
                        <Badge variant="outline" className="text-xs">
                          {job.preferredEducation}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {hasApplied ? (
                      <Button variant="outline" size="sm" disabled className="text-green-500 border-green-500/30">
                        Applied ✓
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          if (!isAuthenticated) {
                            setLoginPrompt(true);
                          } else {
                            setApplyTarget(job);
                          }
                        }}
                      >
                        Apply
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Dialog */}
      <Dialog open={!!applyTarget} onOpenChange={(open) => !open && setApplyTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for Job</DialogTitle>
            <DialogDescription>
              You are applying for: <strong>{applyTarget?.title}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="bg-muted rounded-lg p-3 text-sm space-y-1">
              <div><span className="text-muted-foreground">Location:</span> {applyTarget?.location}</div>
              <div><span className="text-muted-foreground">Priority:</span> {applyTarget ? getPriorityLabel(applyTarget.priority) : ''}</div>
              {applyTarget?.preferredEducation && (
                <div><span className="text-muted-foreground">Required:</span> {applyTarget.preferredEducation}</div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              By applying, you confirm your availability and qualifications for this job. Only one application per job is accepted.
            </p>
            {applyMutation.isError && (
              <p className="text-sm text-destructive">
                {(applyMutation.error as any)?.message || 'Failed to apply. Please try again.'}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyTarget(null)}>Cancel</Button>
            <Button onClick={handleApply} disabled={applyMutation.isPending}>
              {applyMutation.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Applying...</>
              ) : (
                'Confirm Application'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Login Prompt Dialog */}
      <Dialog open={loginPrompt} onOpenChange={setLoginPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to apply for jobs or subscribe to job alerts.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoginPrompt(false)}>Cancel</Button>
            <Button onClick={() => { setLoginPrompt(false); login(); }} disabled={isLoggingIn} className="gap-2">
              {isLoggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
