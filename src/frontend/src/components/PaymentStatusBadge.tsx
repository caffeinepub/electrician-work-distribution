import React from "react";
import type { PaymentStatus } from "../lib/types";
import { getPaymentStatusClass, getPaymentStatusLabel } from "../lib/utils";

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
