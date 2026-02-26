import { ApplicationProcessStatus } from '@/backend';

interface ApplicationStatusBadgeProps {
  status: ApplicationProcessStatus;
  className?: string;
}

export function ApplicationStatusBadge({ status, className = '' }: ApplicationStatusBadgeProps) {
  const config: Record<ApplicationProcessStatus, { label: string; cls: string }> = {
    [ApplicationProcessStatus.pending]: {
      label: 'Pending Decision',
      cls: 'badge-amber',
    },
    [ApplicationProcessStatus.verifiedPendingAssignment]: {
      label: 'Verified – Awaiting Assignment',
      cls: 'badge-blue',
    },
    [ApplicationProcessStatus.accepted]: {
      label: 'Accepted',
      cls: 'badge-success',
    },
    [ApplicationProcessStatus.declined]: {
      label: 'Declined',
      cls: 'badge-danger',
    },
    [ApplicationProcessStatus.cancelled]: {
      label: 'Cancelled',
      cls: 'badge-neutral',
    },
  };

  const { label, cls } = config[status] ?? { label: status, cls: 'badge-neutral' };

  return (
    <span className={`badge ${cls} ${className}`}>{label}</span>
  );
}
