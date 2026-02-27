import { WorkOrderStatus } from '../backend';

interface StatusBadgeProps {
  status: WorkOrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getClass = () => {
    switch (status) {
      case WorkOrderStatus.open:
        return 'badge-open';
      case WorkOrderStatus.inProgress:
        return 'badge-in-progress';
      case WorkOrderStatus.completed:
        return 'badge-completed';
      case WorkOrderStatus.cancelled:
        return 'badge-cancelled';
      default:
        return 'badge-open';
    }
  };

  const getLabel = () => {
    switch (status) {
      case WorkOrderStatus.open:
        return 'Open';
      case WorkOrderStatus.inProgress:
        return 'In Progress';
      case WorkOrderStatus.completed:
        return 'Completed';
      case WorkOrderStatus.cancelled:
        return 'Cancelled';
      default:
        return String(status);
    }
  };

  return <span className={`badge ${getClass()}`}>{getLabel()}</span>;
}
