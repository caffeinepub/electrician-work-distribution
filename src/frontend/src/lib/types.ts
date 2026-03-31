import type { ElectricianQualification } from "../backend";

export type WorkOrderPriority = "low" | "medium" | "high" | "urgent";
export type WorkOrderStatus = "open" | "inProgress" | "completed" | "cancelled";
export type ApplicationProcessStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "cancelled"
  | "verifiedPendingAssignment";
export type PaymentStatusKind = "pending" | "paid" | "confirmed" | "flagged";

export interface PaymentStatus {
  __kind__: PaymentStatusKind;
  flagged?: string;
}

export interface Rating {
  rating: number;
  comment: string;
}

export interface ApplicantDetails {
  fullName: string;
  fatherName: string;
  dob: string; // ISO date string YYYY-MM-DD
  addressLine1: string;
  addressLine2?: string;
  mobileNo: string;
  gmailId: string;
  academicQualification: string;
  otherQualification?: string;
  workExperience: string;
  workingTime: string;
  jobType: string;
  salaryPerMonth: string;
  salaryPerWeek: string;
  salaryPerDay: string;
}

export interface WorkOrder {
  id: number;
  title: string;
  description: string;
  location: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  applicationStatus: ApplicationProcessStatus;
  issuedElectrician?: number;
  createdAt: Date;
  customerEmail: string;
  customerAddress: string;
  customerContactNumber: string;
  paymentAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  preferredEducation: ElectricianQualification;
  verificationStatus: string;
  workerRating?: Rating;
  customerRating?: Rating;
  applicantDetails?: ApplicantDetails;
  // Cash transfer tracking
  cashTransferAmount?: number;
  cashTransferNote?: string;
  cashTransferDate?: string;
}

// Re-export as namespace-like constants for components that used enum-style access
export const WorkOrderStatusValues = {
  open: "open" as WorkOrderStatus,
  inProgress: "inProgress" as WorkOrderStatus,
  completed: "completed" as WorkOrderStatus,
  cancelled: "cancelled" as WorkOrderStatus,
};

export const ApplicationProcessStatusValues = {
  pending: "pending" as ApplicationProcessStatus,
  accepted: "accepted" as ApplicationProcessStatus,
  declined: "declined" as ApplicationProcessStatus,
  cancelled: "cancelled" as ApplicationProcessStatus,
  verifiedPendingAssignment:
    "verifiedPendingAssignment" as ApplicationProcessStatus,
};
