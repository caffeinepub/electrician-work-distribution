interface PriorityBadgeProps {
  priority: number;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const getClass = () => {
    switch (priority) {
      case 1: return 'priority-low';
      case 2: return 'priority-medium';
      case 3: return 'priority-high';
      case 4: return 'priority-critical';
      default: return 'priority-medium';
    }
  };

  const getLabel = () => {
    switch (priority) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      case 4: return 'Urgent';
      default: return 'Medium';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getClass()}`}>
      {getLabel()}
    </span>
  );
}
