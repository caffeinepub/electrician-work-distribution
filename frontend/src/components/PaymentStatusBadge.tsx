import { PaymentStatus } from '../backend';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export default function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const getClass = () => {
    switch (status) {
      case PaymentStatus.paid:
        return 'badge-paid';
      case PaymentStatus.pending:
        return 'badge-payment-pending';
      default:
        return 'badge-payment-pending';
    }
  };

  const getLabel = () => {
    switch (status) {
      case PaymentStatus.paid:
        return 'Paid';
      case PaymentStatus.pending:
        return 'Pending';
      default:
        return String(status);
    }
  };

  return <span className={`badge ${getClass()}`}>{getLabel()}</span>;
}
