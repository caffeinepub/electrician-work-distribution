import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Status helpers
export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    open: "Open",
    inProgress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
    pending: "Pending",
  };
  return map[status] ?? status;
}

export function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    open: "badge-status-open",
    inProgress: "badge-status-in-progress",
    completed: "badge-status-completed",
    cancelled: "badge-status-cancelled",
    pending: "badge-status-pending",
  };
  return map[status] ?? "badge-status-default";
}

// Priority helpers
export function getPriorityLabel(priority: number): string {
  const map: Record<number, string> = {
    1: "Low",
    2: "Medium",
    3: "High",
    4: "Urgent",
  };
  return map[priority] ?? `P${priority}`;
}

export function getPriorityClass(priority: number): string {
  const map: Record<number, string> = {
    1: "badge-priority-low",
    2: "badge-priority-medium",
    3: "badge-priority-high",
    4: "badge-priority-urgent",
  };
  return map[priority] ?? "badge-priority-low";
}

// Payment status helpers
export function getPaymentStatusLabel(status: any): string {
  if (!status) return "Pending";
  const kind = status.__kind__ ?? status;
  const map: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    failed: "Failed",
    refunded: "Refunded",
  };
  return map[kind] ?? kind;
}

export function getPaymentStatusClass(status: any): string {
  if (!status) return "badge-payment-pending";
  const kind = status.__kind__ ?? status;
  const map: Record<string, string> = {
    pending: "badge-payment-pending",
    confirmed: "badge-payment-confirmed",
    failed: "badge-payment-failed",
    refunded: "badge-payment-refunded",
  };
  return map[kind] ?? "badge-payment-pending";
}

// Application status helpers
export function getApplicationStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    verifiedPendingAssignment: "Verified – Pending Assignment",
  };
  return map[status] ?? status;
}

export function getApplicationStatusClass(status: string): string {
  const map: Record<string, string> = {
    pending: "badge-status-pending",
    approved: "badge-status-completed",
    rejected: "badge-status-cancelled",
    verifiedPendingAssignment: "badge-status-in-progress",
  };
  return map[status] ?? "badge-status-default";
}

// Qualification helpers
export function getQualificationLabel(qualification: string): string {
  const map: Record<string, string> = {
    itiElectrician: "ITI Electrician",
    electronicElectricalEngineering: "Electronic Electrical Engineering",
    eeeDiploma: "EEE Diploma",
    diplomaElectrical: "Diploma Electrical",
    acMechanic: "AC Mechanic",
    electronicCommerceEngineering: "Electronic Commerce Engineering",
    other: "Other",
  };
  return map[qualification] ?? qualification;
}

export function getSpecialityLabel(speciality: string): string {
  const map: Record<string, string> = {
    electronicRepair: "Electronic Repair",
    acTechnician: "AC Technician",
    fridgeRepairWork: "Fridge Repair Work",
    electrician: "Electrician",
  };
  return map[speciality] ?? speciality;
}

// Timestamp formatter
export function formatTimestamp(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
