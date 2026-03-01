import { PaymentStatus } from '../backend';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export default function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const getClass = (): string => {
    switch (status.__kind__) {
      case 'paid': return 'badge-paid';
      case 'confirmed': return 'badge-paid';
      case 'flagged': return 'badge-cancelled';
      case 'pending':
      default: return 'badge-payment-pending';
    }
  };

  const getLabel = (): string => {
    switch (status.__kind__) {
      case 'paid': return 'Paid';
      case 'confirmed': return 'Confirmed';
      case 'flagged': return 'Flagged';
      case 'pending':
      default: return 'Pending';
    }
  };

  return <span className={`badge ${getClass()}`}>{getLabel()}</span>;
}
