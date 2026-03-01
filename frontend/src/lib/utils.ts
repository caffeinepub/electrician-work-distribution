import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { WorkOrderStatus, PaymentStatus, Speciality, WorkOrder, ElectricianQualification } from '../backend';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPriorityLabel(priority: bigint | number): string {
  const p = Number(priority);
  switch (p) {
    case 1: return 'Low';
    case 2: return 'Medium';
    case 3: return 'High';
    case 4: return 'Urgent';
    default: return `P${p}`;
  }
}

export function getPriorityClass(priority: bigint | number): string {
  const p = Number(priority);
  switch (p) {
    case 1: return 'badge-priority-low';
    case 2: return 'badge-priority-medium';
    case 3: return 'badge-priority-high';
    case 4: return 'badge-priority-urgent';
    default: return 'badge-priority-low';
  }
}

export function getStatusLabel(status: WorkOrderStatus): string {
  switch (status) {
    case WorkOrderStatus.open: return 'Open';
    case WorkOrderStatus.inProgress: return 'In Progress';
    case WorkOrderStatus.completed: return 'Completed';
    case WorkOrderStatus.cancelled: return 'Cancelled';
    default: return String(status);
  }
}

export function getStatusClass(status: WorkOrderStatus): string {
  switch (status) {
    case WorkOrderStatus.open: return 'badge-open';
    case WorkOrderStatus.inProgress: return 'badge-in-progress';
    case WorkOrderStatus.completed: return 'badge-completed';
    case WorkOrderStatus.cancelled: return 'badge-cancelled';
    default: return 'badge-open';
  }
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  switch (status.__kind__) {
    case 'paid': return 'Paid';
    case 'confirmed': return 'Confirmed';
    case 'flagged': return `Flagged`;
    case 'pending':
    default: return 'Pending';
  }
}

export function getPaymentStatusClass(status: PaymentStatus): string {
  switch (status.__kind__) {
    case 'paid': return 'badge-paid';
    case 'confirmed': return 'badge-paid';
    case 'flagged': return 'badge-cancelled';
    case 'pending':
    default: return 'badge-payment-pending';
  }
}

export function getSpecialityLabel(speciality: Speciality): string {
  switch (speciality) {
    case Speciality.residential: return 'Residential';
    case Speciality.commercial: return 'Commercial';
    case Speciality.industrial: return 'Industrial';
    default: return String(speciality);
  }
}

export function getQualificationLabel(qualification: ElectricianQualification): string {
  switch (qualification) {
    case ElectricianQualification.itiElectrician: return 'ITI Electrician';
    case ElectricianQualification.electronicElectricalEngineering: return 'Electronic Electrical Engineering';
    case ElectricianQualification.eeeDiploma: return 'EEE Diploma';
    default: return String(qualification);
  }
}

export function formatTimestamp(time: bigint): string {
  const ms = Number(time) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  return ratings.reduce((a, b) => a + b, 0) / ratings.length;
}

export function formatRatingText(avg: number, count: number): string {
  if (count === 0) return 'No ratings yet';
  return `${avg.toFixed(1)} / 5 (${count} review${count !== 1 ? 's' : ''})`;
}

export function validateRating(rating: number): boolean {
  return rating >= 1 && rating <= 5;
}

export function calculateElectricianRating(electricianId: bigint, workOrders: WorkOrder[]): { avg: number; count: number } {
  const completed = workOrders.filter(
    (wo) => wo.issuedElectrician === electricianId && wo.status === WorkOrderStatus.completed && wo.workerRating
  );
  if (completed.length === 0) return { avg: 0, count: 0 };
  const sum = completed.reduce((acc, wo) => acc + Number(wo.workerRating!.rating), 0);
  return { avg: sum / completed.length, count: completed.length };
}
