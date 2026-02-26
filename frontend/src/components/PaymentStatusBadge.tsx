import { PaymentStatus } from '../backend';

interface PaymentStatusBadgeProps {
  status: PaymentStatus | string;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const getClass = () => {
    switch (status) {
      case PaymentStatus.paid:
      case 'paid':
        return 'payment-paid';
      case PaymentStatus.pending:
      case 'pending':
        return 'payment-pending';
      default:
        return 'payment-pending';
    }
  };

  const getLabel = () => {
    switch (status) {
      case PaymentStatus.paid:
      case 'paid':
        return 'Paid';
      case PaymentStatus.pending:
      case 'pending':
        return 'Pending';
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
