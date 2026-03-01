import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WorkOrderApplication {
    applicant: Principal;
    appliedAt: Time;
    workOrderId: bigint;
}
export type Time = bigint;
export interface Rating {
    comment: string;
    rating: bigint;
}
export interface WorkOrder {
    id: bigint;
    status: WorkOrderStatus;
    title: string;
    paymentStatus: PaymentStatus;
    paymentMethod: string;
    workerRating?: Rating;
    createdAt: Time;
    customerRating?: Rating;
    preferredEducation: ElectricianQualification;
    description: string;
    applicationStatus: ApplicationProcessStatus;
    customerAddress: string;
    issuedElectrician?: bigint;
    customerContactNumber: string;
    priority: bigint;
    customerEmail: string;
    paymentAmount: bigint;
    location: string;
    verificationStatus: VerificationStatus;
}
export interface PublicJobAlertSubscription {
    subscribedAt: Time;
}
export type VerificationStatus = {
    __kind__: "pending";
    pending: null;
} | {
    __kind__: "approved";
    approved: null;
} | {
    __kind__: "verifiedPendingAssignment";
    verifiedPendingAssignment: null;
} | {
    __kind__: "rejected";
    rejected: string;
};
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface Electrician {
    id: bigint;
    paymentMethod: string;
    name: string;
    hourlyRate: bigint;
    workAvailability: WorkAvailability;
    isAvailable: boolean;
    specialist: Speciality;
    email: string;
    currency: string;
    address: string;
    qualification: ElectricianQualification;
    verificationStatus: VerificationStatus;
}
export interface ChecklistItem {
    id: string;
    order: bigint;
    completed: boolean;
    taskLabel: string;
}
export type PaymentStatus = {
    __kind__: "pending";
    pending: null;
} | {
    __kind__: "paid";
    paid: null;
} | {
    __kind__: "confirmed";
    confirmed: null;
} | {
    __kind__: "flagged";
    flagged: string;
};
export interface UserProfile {
    name: string;
    email: string;
}
export enum ApplicationProcessStatus {
    cancelled = "cancelled",
    pending = "pending",
    verifiedPendingAssignment = "verifiedPendingAssignment",
    accepted = "accepted",
    declined = "declined"
}
export enum ElectricianQualification {
    eeeDiploma = "eeeDiploma",
    electronicElectricalEngineering = "electronicElectricalEngineering",
    itiElectrician = "itiElectrician"
}
export enum RepairServiceType {
    electronicRepair = "electronicRepair",
    electrician = "electrician",
    fridgeRepairWork = "fridgeRepairWork",
    acTechnician = "acTechnician"
}
export enum Speciality {
    commercial = "commercial",
    residential = "residential",
    industrial = "industrial"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum WorkAvailability {
    partTime = "partTime",
    fullTime = "fullTime"
}
export enum WorkOrderStatus {
    cancelled = "cancelled",
    open = "open",
    completed = "completed",
    inProgress = "inProgress"
}
export interface backendInterface {
    acceptWorkOrder(workOrderId: bigint): Promise<void>;
    addElectrician(name: string, specialist: Speciality, workAvailability: WorkAvailability, qualification: ElectricianQualification, email: string, address: string, hourlyRate: bigint, currency: string, paymentMethod: string): Promise<bigint>;
    applyForWorkOrder(workOrderId: bigint): Promise<void>;
    approveElectrician(id: bigint): Promise<void>;
    approveJobApplication(workOrderId: bigint, applicantId: Principal): Promise<void>;
    approvePayment(workOrderId: bigint): Promise<void>;
    approveWorkOrder(id: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignElectricianToWorkOrder(workOrderId: bigint, issuedElectrician: bigint): Promise<void>;
    createFixedPriceWorkOrder(title: string, description: string, location: string, priority: bigint, customerEmail: string, customerAddress: string, customerContactNumber: string, paymentMethod: string, preferredEducation: ElectricianQualification): Promise<bigint>;
    createWorkOrder(title: string, description: string, location: string, priority: bigint, issuedElectrician: bigint | null, customerEmail: string, customerAddress: string, customerContactNumber: string, paymentAmount: bigint, paymentMethod: string, preferredEducation: ElectricianQualification): Promise<bigint>;
    declineWorkOrder(workOrderId: bigint): Promise<void>;
    findElectricianById(id: bigint): Promise<Electrician>;
    findWorkOrderById(id: bigint): Promise<WorkOrder>;
    flagPayment(workOrderId: bigint, note: string): Promise<void>;
    getAllElectricians(): Promise<Array<Electrician>>;
    getAllJobAlertSubscriptions(): Promise<Array<PublicJobAlertSubscription>>;
    getAllWorkOrders(): Promise<Array<WorkOrder>>;
    getAvailableServices(): Promise<Array<RepairServiceType>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCurrentUserWorkOrders(): Promise<Array<WorkOrder>>;
    getPendingElectricians(): Promise<Array<Electrician>>;
    getPendingJobApplications(): Promise<Array<WorkOrder>>;
    getPendingPayments(): Promise<Array<WorkOrder>>;
    getPendingWorkOrders(): Promise<Array<WorkOrder>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVerifiedApplications(): Promise<Array<WorkOrder>>;
    getWorkOrderApplication(workOrderId: bigint): Promise<WorkOrderApplication | null>;
    getWorkOrderConfirmation(workOrderId: bigint): Promise<{
        status: WorkOrderStatus;
        workOrderId: bigint;
    }>;
    getWorkOrdersByApplicationStatus(status: ApplicationProcessStatus): Promise<Array<WorkOrder>>;
    getWorkOrdersByElectrician(electricianId: bigint): Promise<Array<WorkOrder>>;
    getWorkerChecklist(workOrderId: string): Promise<Array<ChecklistItem>>;
    isCallerAdmin(): Promise<boolean>;
    isSubscribedToJobAlerts(): Promise<boolean>;
    rejectElectrician(id: bigint, reason: string): Promise<void>;
    rejectJobApplication(workOrderId: bigint, applicantId: Principal, reason: string): Promise<void>;
    rejectWorkOrder(id: bigint, reason: string): Promise<void>;
    removeElectrician(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitCustomerRating(workOrderId: bigint, rating: bigint, comment: string): Promise<void>;
    submitWorkerRating(workOrderId: bigint, rating: bigint, comment: string): Promise<void>;
    subscribeToJobAlerts(): Promise<void>;
    updateApplicationStatusForWorkOrder(workOrderId: bigint, newStatus: ApplicationProcessStatus): Promise<void>;
    updateChecklistItem(workOrderId: string, itemId: string, completed: boolean): Promise<Result>;
    updateElectrician(id: bigint, name: string | null, specialist: Speciality | null, isAvailable: boolean | null, workAvailability: WorkAvailability | null, qualification: ElectricianQualification | null, email: string | null, address: string | null, hourlyRate: bigint | null, currency: string | null, paymentMethod: string | null): Promise<void>;
    updateWorkOrderPayment(id: bigint, paymentAmount: bigint, paymentMethod: string, paymentStatus: PaymentStatus): Promise<void>;
    updateWorkOrderStatus(id: bigint, status: WorkOrderStatus): Promise<void>;
    verifyAndMoveToQueue(workOrderId: bigint): Promise<void>;
    verifyApplication(workOrderId: bigint): Promise<void>;
}
