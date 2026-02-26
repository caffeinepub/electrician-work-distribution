import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Electrician {
    id: bigint;
    paymentMethod: string;
    name: string;
    hourlyRate: bigint;
    isAvailable: boolean;
    specialist: Speciality;
    email: string;
    currency: string;
    address: string;
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
    preferredEducation: string;
    description: string;
    customerAddress: string;
    issuedElectrician: bigint;
    priority: bigint;
    customerEmail: string;
    paymentAmount: bigint;
    location: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum PaymentStatus {
    pending = "pending",
    paid = "paid"
}
export enum RepairServiceType {
    ac = "ac",
    ceilingFan = "ceilingFan",
    tableFan = "tableFan",
    fridge = "fridge",
    television = "television"
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
export enum WorkOrderStatus {
    cancelled = "cancelled",
    open = "open",
    completed = "completed",
    inProgress = "inProgress"
}
export interface backendInterface {
    addElectrician(name: string, specialist: Speciality, email: string, address: string, hourlyRate: bigint, currency: string, paymentMethod: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignElectricianToWorkOrder(workOrderId: bigint, issuedElectrician: bigint): Promise<void>;
    createWorkOrder(title: string, description: string, location: string, priority: bigint, issuedElectrician: bigint, customerEmail: string, customerAddress: string, paymentAmount: bigint, paymentMethod: string, preferredEducation: string): Promise<bigint>;
    findElectricianById(id: bigint): Promise<Electrician>;
    findWorkOrderById(id: bigint): Promise<WorkOrder>;
    getAllElectricians(): Promise<Array<Electrician>>;
    getAllWorkOrders(): Promise<Array<WorkOrder>>;
    getAvailableServices(): Promise<Array<RepairServiceType>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWorkOrdersByElectrician(electricianId: bigint): Promise<Array<WorkOrder>>;
    isCallerAdmin(): Promise<boolean>;
    removeElectrician(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitCustomerRating(workOrderId: bigint, rating: bigint, comment: string): Promise<void>;
    submitWorkerRating(workOrderId: bigint, rating: bigint, comment: string): Promise<void>;
    updateElectrician(id: bigint, name: string | null, specialist: Speciality | null, isAvailable: boolean | null, email: string | null, address: string | null, hourlyRate: bigint | null, currency: string | null, paymentMethod: string | null): Promise<void>;
    updateWorkOrderPayment(id: bigint, paymentAmount: bigint, paymentMethod: string, paymentStatus: PaymentStatus): Promise<void>;
    updateWorkOrderStatus(id: bigint, status: WorkOrderStatus): Promise<void>;
}
