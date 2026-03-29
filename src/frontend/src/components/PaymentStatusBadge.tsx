import React from "react";
import { getPaymentStatusClass, getPaymentStatusLabel } from "../lib/helpers";
import type { PaymentStatus } from "../lib/types";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export default function PaymentStatusBadge({
  status,
}: PaymentStatusBadgeProps) {
  return (
    <span className={`badge ${getPaymentStatusClass(status)}`}>
      {getPaymentStatusLabel(status)}
    </span>
  );
}
