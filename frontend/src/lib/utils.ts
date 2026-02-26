import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { WorkOrder } from '../backend';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Priority helpers ─────────────────────────────────────────────────────────

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
  if (p === 1) return 'priority-low';
  if (p === 2) return 'priority-medium';
  if (p === 3) return 'priority-high';
  if (p === 4) return 'priority-urgent';
  return '';
}

// ─── Status helpers ───────────────────────────────────────────────────────────

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'open': return 'Open';
    case 'inProgress': return 'In Progress';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Cancelled';
    default: return status;
  }
}

export function getStatusClass(status: string): string {
  switch (status) {
    case 'open': return 'status-open';
    case 'inProgress': return 'status-in-progress';
    case 'completed': return 'status-completed';
    case 'cancelled': return 'status-cancelled';
    default: return '';
  }
}

// ─── Payment Status helpers ───────────────────────────────────────────────────

export function getPaymentStatusLabel(status: string): string {
  switch (status) {
    case 'paid': return 'Paid';
    case 'pending': return 'Pending';
    case 'overdue': return 'Overdue';
    case 'cancelled': return 'Cancelled';
    default: return status;
  }
}

export function getPaymentStatusClass(status: string): string {
  switch (status) {
    case 'paid': return 'payment-status-paid';
    case 'pending': return 'payment-status-pending';
    case 'overdue': return 'payment-status-overdue';
    case 'cancelled': return 'payment-status-cancelled';
    default: return '';
  }
}

// ─── Speciality helpers ───────────────────────────────────────────────────────

export function getSpecialityLabel(speciality: string): string {
  switch (speciality) {
    case 'residential': return 'Residential';
    case 'commercial': return 'Commercial';
    case 'industrial': return 'Industrial';
    default: return speciality;
  }
}

// ─── Timestamp helpers ────────────────────────────────────────────────────────

export function formatTimestamp(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ─── Rating helpers ───────────────────────────────────────────────────────────

export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r, 0);
  return sum / ratings.length;
}

export function formatRatingText(average: number, count: number): string {
  if (count === 0) return 'No ratings';
  return `${average.toFixed(1)} (${count} review${count !== 1 ? 's' : ''})`;
}

export function validateRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

/**
 * Calculate average rating and count for a specific electrician
 * from completed work orders that have a workerRating.
 */
export function calculateElectricianRating(
  electricianId: bigint,
  workOrders: WorkOrder[],
): { averageRating: number; ratingCount: number } {
  const relevant = workOrders.filter(
    (wo) =>
      wo.issuedElectrician === electricianId &&
      wo.status === 'completed' &&
      wo.workerRating != null,
  );

  if (relevant.length === 0) {
    return { averageRating: 0, ratingCount: 0 };
  }

  const sum = relevant.reduce((acc, wo) => acc + Number(wo.workerRating!.rating), 0);
  return {
    averageRating: sum / relevant.length,
    ratingCount: relevant.length,
  };
}
