import React from "react";
import { getStatusClass, getStatusLabel } from "../lib/helpers";
import type { WorkOrderStatus } from "../lib/types";

interface StatusBadgeProps {
  status: WorkOrderStatus | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge ${getStatusClass(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}
