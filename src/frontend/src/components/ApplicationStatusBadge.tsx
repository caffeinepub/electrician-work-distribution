import React from "react";
import {
  getApplicationStatusClass,
  getApplicationStatusLabel,
} from "../lib/helpers";
import type { ApplicationProcessStatus } from "../lib/types";

interface ApplicationStatusBadgeProps {
  status: ApplicationProcessStatus | string;
}

export default function ApplicationStatusBadge({
  status,
}: ApplicationStatusBadgeProps) {
  return (
    <span className={`badge ${getApplicationStatusClass(status)}`}>
      {getApplicationStatusLabel(status)}
    </span>
  );
}
