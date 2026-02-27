interface PriorityBadgeProps {
  priority: bigint | number;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const p = Number(priority);

  const getClass = () => {
    switch (p) {
      case 1: return 'badge-priority-low';
      case 2: return 'badge-priority-medium';
      case 3: return 'badge-priority-high';
      case 4: return 'badge-priority-urgent';
      default: return 'badge-priority-low';
    }
  };

  const getLabel = () => {
    switch (p) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      case 4: return 'Urgent';
      default: return `P${p}`;
    }
  };

  return <span className={`badge ${getClass()}`}>{getLabel()}</span>;
}
