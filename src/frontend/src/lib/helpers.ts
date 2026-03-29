import type {
  ApplicationProcessStatus,
  PaymentStatus,
  WorkOrderStatus,
} from "./types";

export function formatTimestamp(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getStatusClass(status: WorkOrderStatus | string): string {
  switch (status) {
    case "open":
      return "badge-status-open";
    case "inProgress":
      return "badge-status-in-progress";
    case "completed":
      return "badge-status-completed";
    case "cancelled":
      return "badge-status-cancelled";
    default:
      return "";
  }
}

export function getStatusLabel(status: WorkOrderStatus | string): string {
  switch (status) {
    case "open":
      return "Open";
    case "inProgress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return String(status);
  }
}

export function getApplicationStatusClass(
  status: ApplicationProcessStatus | string,
): string {
  switch (status) {
    case "pending":
      return "badge-app-pending";
    case "accepted":
      return "badge-app-accepted";
    case "declined":
      return "badge-app-declined";
    case "cancelled":
      return "badge-app-cancelled";
    case "verifiedPendingAssignment":
      return "badge-app-verified";
    default:
      return "";
  }
}

export function getApplicationStatusLabel(
  status: ApplicationProcessStatus | string,
): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "accepted":
      return "Accepted";
    case "declined":
      return "Declined";
    case "cancelled":
      return "Cancelled";
    case "verifiedPendingAssignment":
      return "Verified — Pending Assignment";
    default:
      return String(status);
  }
}

export function getPaymentStatusClass(status: PaymentStatus): string {
  switch (status.__kind__) {
    case "pending":
      return "badge-pay-pending";
    case "paid":
      return "badge-pay-paid";
    case "confirmed":
      return "badge-pay-confirmed";
    case "flagged":
      return "badge-pay-flagged";
    default:
      return "";
  }
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  switch (status.__kind__) {
    case "pending":
      return "Payment Pending";
    case "paid":
      return "Paid";
    case "confirmed":
      return "Confirmed";
    case "flagged":
      return `Flagged${status.flagged ? `: ${status.flagged}` : ""}`;
    default:
      return String(status.__kind__);
  }
}

export function getPriorityClass(priority: number): string {
  switch (priority) {
    case 1:
      return "badge-priority-low";
    case 2:
      return "badge-priority-medium";
    case 3:
      return "badge-priority-high";
    case 4:
      return "badge-priority-urgent";
    default:
      return "";
  }
}

export function getPriorityLabel(priority: number): string {
  switch (priority) {
    case 1:
      return "Low";
    case 2:
      return "Medium";
    case 3:
      return "High";
    case 4:
      return "Urgent";
    default:
      return `Priority ${priority}`;
  }
}

export function getQualificationLabel(qualification: string): string {
  switch (qualification) {
    case "itiElectrician":
      return "ITI Electrician";
    case "electronicElectricalEngineering":
      return "Electronic Electrical Engineering";
    case "eeeDiploma":
      return "EEE Diploma";
    case "diploma":
      return "Diploma";
    case "acMechanic":
      return "AC Mechanic";
    default:
      return qualification;
  }
}

export function getSpecialityLabel(speciality: string): string {
  switch (speciality) {
    case "electronicRepair":
      return "Electronic Repair";
    case "acTechnician":
      return "AC Technician";
    case "fridgeRepairWork":
      return "Fridge Repair";
    case "electrician":
      return "Electrician";
    default:
      return speciality;
  }
}
