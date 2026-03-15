import React from "react";
import type { ApplicationProcessStatus } from "../lib/types";
import {
  getApplicationStatusClass,
  getApplicationStatusLabel,
} from "../lib/utils";

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
