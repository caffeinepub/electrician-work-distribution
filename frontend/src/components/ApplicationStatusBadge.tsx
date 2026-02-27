import { ApplicationProcessStatus } from '../backend';

interface ApplicationStatusBadgeProps {
  status: ApplicationProcessStatus;
}

export default function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const getClass = () => {
    switch (status) {
      case ApplicationProcessStatus.pending:
        return 'badge-app-pending';
      case ApplicationProcessStatus.verifiedPendingAssignment:
        return 'badge-blue';
      case ApplicationProcessStatus.accepted:
        return 'badge-completed';
      case ApplicationProcessStatus.declined:
        return 'badge-cancelled';
      case ApplicationProcessStatus.cancelled:
        return 'badge-cancelled';
      default:
        return 'badge-app-pending';
    }
  };

  const getLabel = () => {
    switch (status) {
      case ApplicationProcessStatus.pending:
        return 'Pending Decision';
      case ApplicationProcessStatus.verifiedPendingAssignment:
        return 'Verified – Awaiting Assignment';
      case ApplicationProcessStatus.accepted:
        return 'Accepted';
      case ApplicationProcessStatus.declined:
        return 'Declined';
      case ApplicationProcessStatus.cancelled:
        return 'Cancelled';
      default:
        return String(status);
    }
  };

  return <span className={`badge ${getClass()}`}>{getLabel()}</span>;
}
