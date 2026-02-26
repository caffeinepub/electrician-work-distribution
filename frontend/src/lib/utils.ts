import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { WorkOrderStatus, PaymentStatus, Speciality, WorkAvailability, RepairServiceType } from '../backend';
import type { WorkOrder } from '../backend';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPriorityLabel(priority: number | bigint): string {
  const p = Number(priority);
  if (p === 1) return 'Low';
  if (p === 2) return 'Medium';
  if (p === 3) return 'High';
  if (p === 4) return 'Urgent';
  return 'Unknown';
}

export function getPriorityClass(priority: number | bigint): string {
  const p = Number(priority);
  if (p === 1) return 'badge-low';
  if (p === 2) return 'badge-medium';
  if (p === 3) return 'badge-high';
  if (p === 4) return 'badge-urgent';
  return '';
}

export function getStatusLabel(status: WorkOrderStatus): string {
  switch (status) {
    case WorkOrderStatus.open: return 'Open';
    case WorkOrderStatus.inProgress: return 'In Progress';
    case WorkOrderStatus.completed: return 'Completed';
    case WorkOrderStatus.cancelled: return 'Cancelled';
    default: return 'Unknown';
  }
}

export function getStatusClass(status: WorkOrderStatus): string {
  switch (status) {
    case WorkOrderStatus.open: return 'badge-open';
    case WorkOrderStatus.inProgress: return 'badge-in-progress';
    case WorkOrderStatus.completed: return 'badge-completed';
    case WorkOrderStatus.cancelled: return 'badge-cancelled';
    default: return '';
  }
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case PaymentStatus.pending: return 'Pending';
    case PaymentStatus.paid: return 'Paid';
    default: return 'Unknown';
  }
}

export function getPaymentStatusClass(status: PaymentStatus): string {
  switch (status) {
    case PaymentStatus.pending: return 'badge-pending';
    case PaymentStatus.paid: return 'badge-paid';
    default: return '';
  }
}

export function getSpecialityLabel(speciality: Speciality): string {
  switch (speciality) {
    case Speciality.residential: return 'Residential';
    case Speciality.commercial: return 'Commercial';
    case Speciality.industrial: return 'Industrial';
    default: return 'Unknown';
  }
}

export function getRepairServiceTypeLabel(type: RepairServiceType): string {
  switch (type) {
    case RepairServiceType.electronicRepair: return 'Electronic Repair';
    case RepairServiceType.acTechnician: return 'AC Technician';
    case RepairServiceType.fridgeRepairWork: return 'Fridge Repair Work';
    default: return 'Unknown';
  }
}

export function getWorkAvailabilityLabel(availability: WorkAvailability): string {
  switch (availability) {
    case WorkAvailability.partTime: return 'Part-time';
    case WorkAvailability.fullTime: return 'Full-time';
    default: return 'Unknown';
  }
}

export function formatTimestamp(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r, 0);
  return sum / ratings.length;
}

export function formatRatingText(rating: number): string {
  return rating.toFixed(1);
}

export function validateRating(rating: number): boolean {
  return rating >= 1 && rating <= 5;
}

export function calculateElectricianRating(workOrders: WorkOrder[], electricianId: bigint): { averageRating: number; ratingCount: number } {
  const relevant = workOrders.filter(
    (wo) => wo.issuedElectrician === electricianId && wo.workerRating != null
  );
  if (relevant.length === 0) return { averageRating: 0, ratingCount: 0 };
  const sum = relevant.reduce((acc, wo) => acc + Number(wo.workerRating!.rating), 0);
  return {
    averageRating: sum / relevant.length,
    ratingCount: relevant.length,
  };
}
