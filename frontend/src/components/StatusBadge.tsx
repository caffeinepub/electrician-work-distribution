import { WorkOrderStatus } from '../backend';

interface StatusBadgeProps {
  status: WorkOrderStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getClass = () => {
    switch (status) {
      case WorkOrderStatus.open:
      case 'open':
        return 'status-open';
      case WorkOrderStatus.inProgress:
      case 'inProgress':
        return 'status-inProgress';
      case WorkOrderStatus.completed:
      case 'completed':
        return 'status-completed';
      case WorkOrderStatus.cancelled:
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-open';
    }
  };

  const getLabel = () => {
    switch (status) {
      case WorkOrderStatus.open:
      case 'open':
        return 'Open';
      case WorkOrderStatus.inProgress:
      case 'inProgress':
        return 'In Progress';
      case WorkOrderStatus.completed:
      case 'completed':
        return 'Completed';
      case WorkOrderStatus.cancelled:
      case 'cancelled':
        return 'Cancelled';
      default:
        return String(status);
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getClass()}`}>
      {getLabel()}
    </span>
  );
}
