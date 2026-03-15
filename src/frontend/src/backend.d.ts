import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export type Time = bigint;
export interface ElectricianView {
    id: bigint;
    paymentMethod: string;
    assignedWorkOrders: Array<bigint>;
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
export interface UserProfile {
    name: string;
    email: string;
}
export enum ElectricianQualification {
    eeeDiploma = "eeeDiploma",
    electronicElectricalEngineering = "electronicElectricalEngineering",
    itiElectrician = "itiElectrician"
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
export interface backendInterface {
    addElectrician(name: string, specialist: Speciality, workAvailability: WorkAvailability, qualification: ElectricianQualification, email: string, address: string, hourlyRate: bigint, currency: string, paymentMethod: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignElectricianToWorkOrder(workOrderId: bigint, issuedElectrician: bigint): Promise<void>;
    findElectricianById(id: bigint): Promise<ElectricianView>;
    getAllElectricians(): Promise<Array<ElectricianView>>;
    getAllJobAlertSubscriptions(): Promise<Array<PublicJobAlertSubscription>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPendingElectricians(): Promise<Array<ElectricianView>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isSubscribedToJobAlerts(): Promise<boolean>;
    removeElectrician(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    subscribeToJobAlerts(): Promise<void>;
    updateElectrician(id: bigint, name: string | null, specialist: Speciality | null, isAvailable: boolean | null, workAvailability: WorkAvailability | null, qualification: ElectricianQualification | null, email: string | null, address: string | null, hourlyRate: bigint | null, currency: string | null, paymentMethod: string | null): Promise<void>;
}
