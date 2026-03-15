import React from "react";
import type { ApplicationProcessStatus, WorkOrderStatus } from "../lib/types";

interface Step {
  label: string;
  description: string;
  status: WorkOrderStatus | ApplicationProcessStatus | string;
}

interface ProcessGuideProps {
  currentStatus: WorkOrderStatus | ApplicationProcessStatus | string;
  steps?: Step[];
}

const DEFAULT_STEPS: Step[] = [
  {
    label: "Submitted",
    description: "Service request submitted",
    status: "pending",
  },
  {
    label: "Verified",
    description: "Application verified by admin",
    status: "verifiedPendingAssignment",
  },
  {
    label: "Assigned",
    description: "Technician assigned",
    status: "inProgress",
  },
  { label: "Completed", description: "Service completed", status: "completed" },
];

export default function ProcessGuide({
  currentStatus,
  steps = DEFAULT_STEPS,
}: ProcessGuideProps) {
  const currentIndex = steps.findIndex((s) => s.status === currentStatus);

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <React.Fragment key={step.status}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                      ? "border-primary text-primary bg-primary/10"
                      : "border-muted text-muted-foreground bg-muted/30"
                }`}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              <span
                className={`text-xs font-medium ${
                  isCurrent
                    ? "text-primary"
                    : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mb-4 transition-colors ${
                  isCompleted ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
