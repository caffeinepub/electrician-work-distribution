import React from "react";
import type { WorkOrderStatus } from "../lib/types";
import { getStatusClass, getStatusLabel } from "../lib/utils";

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
