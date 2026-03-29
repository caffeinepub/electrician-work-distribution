import React from "react";
import { getPriorityClass, getPriorityLabel } from "../lib/helpers";

interface PriorityBadgeProps {
  priority: number | bigint | string;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const p =
    typeof priority === "string"
      ? ["low", "medium", "high", "urgent"].indexOf(priority) + 1 || 1
      : Number(priority);

  const label =
    priority === "low"
      ? "Low"
      : priority === "medium"
        ? "Medium"
        : priority === "high"
          ? "High"
          : priority === "urgent"
            ? "Urgent"
            : getPriorityLabel(p);

  const cls =
    priority === "low"
      ? "badge-priority-low"
      : priority === "medium"
        ? "badge-priority-medium"
        : priority === "high"
          ? "badge-priority-high"
          : priority === "urgent"
            ? "badge-priority-urgent"
            : getPriorityClass(p);

  return <span className={`badge ${cls}`}>{label}</span>;
}
