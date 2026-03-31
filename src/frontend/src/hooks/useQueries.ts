import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ElectricianQualification,
  ElectricianView,
  Speciality,
  UserProfile,
  WorkAvailability,
} from "../backend";
import type {
  ApplicationProcessStatus,
  PaymentStatus,
  PaymentStatusKind,
  WorkOrder,
  WorkOrderPriority,
  WorkOrderStatus,
} from "../lib/types";
import { useActor } from "./useActor";

export type {
  WorkOrder,
  WorkOrderStatus,
  WorkOrderPriority,
  ApplicationProcessStatus,
  PaymentStatus,
  PaymentStatusKind,
};

// ── User Profile ──────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ── Admin check ───────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Electricians ──────────────────────────────────────────────────────────────

export function useGetAllElectricians() {
  const { actor, isFetching } = useActor();

  return useQuery<ElectricianView[]>({
    queryKey: ["electricians"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllElectricians();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddElectrician() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      specialist: Speciality;
      workAvailability: WorkAvailability;
      qualification: ElectricianQualification;
      email: string;
      address: string;
      hourlyRate: bigint;
      currency: string;
      paymentMethod: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addElectrician(
        params.name,
        params.specialist,
        params.workAvailability,
        params.qualification,
        params.email,
        params.address,
        params.hourlyRate,
        params.currency,
        params.paymentMethod,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["electricians"] });
      queryClient.invalidateQueries({ queryKey: ["pendingElectricians"] });
    },
  });
}

export function useUpdateElectrician() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      name?: string;
      specialist?: Speciality;
      isAvailable?: boolean;
      workAvailability?: WorkAvailability;
      qualification?: ElectricianQualification;
      email?: string;
      address?: string;
      hourlyRate?: bigint;
      currency?: string;
      paymentMethod?: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateElectrician(
        params.id,
        params.name ?? null,
        params.specialist ?? null,
        params.isAvailable ?? null,
        params.workAvailability ?? null,
        params.qualification ?? null,
        params.email ?? null,
        params.address ?? null,
        params.hourlyRate ?? null,
        params.currency ?? null,
        params.paymentMethod ?? null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["electricians"] });
    },
  });
}

export function useRemoveElectrician() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeElectrician(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["electricians"] });
    },
  });
}

// ── Work Orders (localStorage-persisted simulation) ───────────────────────────

const STORAGE_KEY = "tt_work_orders";
const STORAGE_ID_KEY = "tt_work_order_next_id";

function loadWorkOrders(): WorkOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Restore Date objects from ISO strings
    return parsed.map((wo: any) => ({
      ...wo,
      createdAt: new Date(wo.createdAt),
    }));
  } catch {
    return [];
  }
}

function saveWorkOrders(orders: WorkOrder[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {}
}

function loadNextId(): number {
  try {
    const raw = localStorage.getItem(STORAGE_ID_KEY);
    return raw ? Number.parseInt(raw, 10) : 1;
  } catch {
    return 1;
  }
}

function saveNextId(id: number) {
  try {
    localStorage.setItem(STORAGE_ID_KEY, String(id));
  } catch {}
}

let workOrderStore: WorkOrder[] = loadWorkOrders();
let nextWorkOrderId = loadNextId();

export function useGetAllWorkOrders() {
  return useQuery<WorkOrder[]>({
    queryKey: ["workOrders"],
    queryFn: async () => {
      return [...workOrderStore];
    },
  });
}

export function useGetCurrentUserWorkOrders() {
  return useQuery<WorkOrder[]>({
    queryKey: ["myWorkOrders"],
    queryFn: async () => {
      return workOrderStore.filter((wo) => wo.status !== "cancelled");
    },
  });
}

export function useCreateFixedPriceWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      location: string;
      priority: WorkOrderPriority;
      customerEmail: string;
      customerAddress: string;
      customerContactNumber: string;
      paymentMethod: string;
      preferredEducation: ElectricianQualification;
    }) => {
      const newOrder: WorkOrder = {
        id: nextWorkOrderId++,
        title: params.title,
        description: params.description,
        location: params.location,
        priority: params.priority,
        status: "open",
        applicationStatus: "pending",
        createdAt: new Date(),
        customerEmail: params.customerEmail,
        customerAddress: params.customerAddress,
        customerContactNumber: params.customerContactNumber,
        paymentAmount: 1200,
        paymentStatus: { __kind__: "pending" },
        paymentMethod: params.paymentMethod,
        preferredEducation: params.preferredEducation,
        verificationStatus: "pending",
      };
      workOrderStore.push(newOrder);
      saveWorkOrders(workOrderStore);
      saveNextId(nextWorkOrderId);
      return newOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["myWorkOrders"] });
      queryClient.invalidateQueries({ queryKey: ["pendingWorkOrders"] });
    },
  });
}

export function useUpdateWorkOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: number; status: WorkOrderStatus }) => {
      const order = workOrderStore.find((wo) => wo.id === params.id);
      if (!order) throw new Error("Work order not found");
      order.status = params.status;
      saveWorkOrders(workOrderStore);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["myWorkOrders"] });
    },
  });
}

export function useUpdateWorkOrderPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: number;
      paymentStatus: PaymentStatus;
      paymentAmount?: number;
    }) => {
      const order = workOrderStore.find((wo) => wo.id === params.id);
      if (!order) throw new Error("Work order not found");
      order.paymentStatus = params.paymentStatus;
      if (params.paymentAmount !== undefined) {
        order.paymentAmount = params.paymentAmount;
      }
      saveWorkOrders(workOrderStore);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["pendingPayments"] });
    },
  });
}

export function useApplyToWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { workOrderId: number }) => {
      const order = workOrderStore.find((wo) => wo.id === params.workOrderId);
      if (!order) throw new Error("Work order not found");
      order.applicationStatus = "pending";
      saveWorkOrders(workOrderStore);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
    },
  });
}

export function useSubmitWorkerRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      orderId: number;
      rating: number;
      comment: string;
    }) => {
      const order = workOrderStore.find((wo) => wo.id === params.orderId);
      if (!order) throw new Error("Work order not found");
      order.workerRating = { rating: params.rating, comment: params.comment };
      saveWorkOrders(workOrderStore);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["myWorkOrders"] });
    },
  });
}

// ── Job Alert Subscriptions ───────────────────────────────────────────────────

export function useIsSubscribedToJobAlerts() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isSubscribedToJobAlerts"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isSubscribedToJobAlerts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubscribeToJobAlerts() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.subscribeToJobAlerts();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isSubscribedToJobAlerts"] });
    },
  });
}

// ── Verification Hooks ────────────────────────────────────────────────────────

export function usePendingWorkOrders() {
  return useQuery<WorkOrder[]>({
    queryKey: ["pendingWorkOrders"],
    queryFn: async () => {
      // Reload from localStorage on each query to get latest data
      workOrderStore = loadWorkOrders();
      return workOrderStore.filter((wo) => wo.verificationStatus === "pending");
    },
  });
}

export function usePendingElectricians() {
  const { actor, isFetching } = useActor();

  return useQuery<ElectricianView[]>({
    queryKey: ["pendingElectricians"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingElectricians();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePendingJobApplications() {
  return useQuery<WorkOrder[]>({
    queryKey: ["pendingJobApplications"],
    queryFn: async () => {
      workOrderStore = loadWorkOrders();
      return workOrderStore.filter((wo) => wo.applicationStatus === "pending");
    },
  });
}

export function usePendingPayments() {
  return useQuery<WorkOrder[]>({
    queryKey: ["pendingPayments"],
    queryFn: async () => {
      workOrderStore = loadWorkOrders();
      return workOrderStore.filter(
        (wo) => wo.paymentStatus.__kind__ === "pending",
      );
    },
  });
}

export function useApproveWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: number }) => {
      const order = workOrderStore.find((wo) => wo.id === params.id);
      if (!order) throw new Error("Work order not found");
      order.verificationStatus = "approved";
      saveWorkOrders(workOrderStore);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["pendingWorkOrders"] });
    },
  });
}

export function useRejectWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: number; reason: string }) => {
      const order = workOrderStore.find((wo) => wo.id === params.id);
      if (!order) throw new Error("Work order not found");
      order.verificationStatus = `rejected:${params.reason}`;
      saveWorkOrders(workOrderStore);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["pendingWorkOrders"] });
    },
  });
}

export function useApproveElectrician() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: bigint }) => {
      return params.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["electricians"] });
      queryClient.invalidateQueries({ queryKey: ["pendingElectricians"] });
    },
  });
}

export function useRejectElectrician() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: bigint; reason: string }) => {
      return params.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["electricians"] });
      queryClient.invalidateQueries({ queryKey: ["pendingElectricians"] });
    },
  });
}

export function useApproveJobApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: number }) => {
      const order = workOrderStore.find((wo) => wo.id === params.id);
      if (!order) throw new Error("Work order not found");
      order.applicationStatus = "verifiedPendingAssignment";
      saveWorkOrders(workOrderStore);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["pendingJobApplications"] });
    },
  });
}

export function useRejectJobApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: number; reason: string }) => {
      const order = workOrderStore.find((wo) => wo.id === params.id);
      if (!order) throw new Error("Work order not found");
      order.applicationStatus = "declined";
      saveWorkOrders(workOrderStore);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["pendingJobApplications"] });
    },
  });
}

export function useApprovePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: number }) => {
      const order = workOrderStore.find((wo) => wo.id === params.id);
      if (!order) throw new Error("Work order not found");
      order.paymentStatus = { __kind__: "confirmed" };
      saveWorkOrders(workOrderStore);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["pendingPayments"] });
    },
  });
}

export function useFlagPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: number; reason: string }) => {
      const order = workOrderStore.find((wo) => wo.id === params.id);
      if (!order) throw new Error("Work order not found");
      order.paymentStatus = { __kind__: "flagged", flagged: params.reason };
      saveWorkOrders(workOrderStore);
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["pendingPayments"] });
    },
  });
}

// ── Assign Electrician to Work Order ─────────────────────────────────────────

export function useAssignElectricianToWorkOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      workOrderId: number;
      electricianId: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.assignElectricianToWorkOrder(
        BigInt(params.workOrderId),
        params.electricianId,
      );
      // Also update local store
      const order = workOrderStore.find((wo) => wo.id === params.workOrderId);
      if (order) {
        order.issuedElectrician = Number(params.electricianId);
        order.status = "inProgress";
        order.applicationStatus = "accepted";
      }
      saveWorkOrders(workOrderStore);
      return params;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      queryClient.invalidateQueries({ queryKey: ["electricians"] });
      queryClient.invalidateQueries({ queryKey: ["pendingJobApplications"] });
      queryClient.invalidateQueries({ queryKey: ["myWorkOrders"] });
    },
  });
}

// ── Worker Checklist (stub — uses string workOrderId to match component usage) ─

export interface ChecklistItem {
  id: string;
  taskLabel: string;
  completed: boolean;
  order: number;
}

export function useGetWorkerChecklist(workOrderId: string) {
  return useQuery<ChecklistItem[]>({
    queryKey: ["checklist", workOrderId],
    queryFn: async () => {
      return [];
    },
    enabled: !!workOrderId,
  });
}

export function useUpdateChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      workOrderId: string;
      itemId: string;
      completed: boolean;
    }) => {
      return params;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["checklist", variables.workOrderId],
      });
    },
  });
}

// ── Work Order Application (stub) ─────────────────────────────────────────────

export function useGetWorkOrderApplication(workOrderId: number) {
  return useQuery<WorkOrder | null>({
    queryKey: ["workOrderApplication", workOrderId],
    queryFn: async () => {
      return workOrderStore.find((wo) => wo.id === workOrderId) ?? null;
    },
  });
}

// ── Standalone Job Applications ───────────────────────────────────────────────

const JOB_APP_KEY = "tt_job_applications";
const JOB_APP_ID_KEY = "tt_job_app_next_id";

export interface JobApplication {
  id: number;
  fullName: string;
  fatherName: string;
  dob: string;
  addressLine1: string;
  addressLine2: string;
  mobileNo: string;
  gmailId: string;
  academicQualification: string;
  otherQualification: string;
  workExperience: string;
  workingTime: string;
  jobType: string;
  salaryPerMonth: string;
  salaryPerWeek: string;
  salaryPerDay: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  submittedAt: string;
}

function loadJobApps(): JobApplication[] {
  try {
    const raw = localStorage.getItem(JOB_APP_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveJobApps(apps: JobApplication[]) {
  try {
    localStorage.setItem(JOB_APP_KEY, JSON.stringify(apps));
  } catch {}
}

function loadJobAppNextId(): number {
  try {
    const raw = localStorage.getItem(JOB_APP_ID_KEY);
    return raw ? Number.parseInt(raw, 10) : 1;
  } catch {
    return 1;
  }
}

function saveJobAppNextId(id: number) {
  try {
    localStorage.setItem(JOB_APP_ID_KEY, String(id));
  } catch {}
}

let jobAppNextId = loadJobAppNextId();

export function useSubmitJobApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      params: Omit<JobApplication, "id" | "status" | "submittedAt">,
    ) => {
      const apps = loadJobApps();
      const newApp: JobApplication = {
        ...params,
        id: jobAppNextId++,
        status: "pending",
        submittedAt: new Date().toISOString(),
      };
      apps.push(newApp);
      saveJobApps(apps);
      saveJobAppNextId(jobAppNextId);
      return newApp;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobApps"] });
      queryClient.invalidateQueries({ queryKey: ["pendingJobAppsFull"] });
      queryClient.invalidateQueries({ queryKey: ["activeEmployees"] });
    },
  });
}

export function useAllJobApplications() {
  return useQuery<JobApplication[]>({
    queryKey: ["jobApps"],
    queryFn: async () => loadJobApps(),
  });
}

export function usePendingJobApplicationsFull() {
  return useQuery<JobApplication[]>({
    queryKey: ["pendingJobAppsFull"],
    queryFn: async () => loadJobApps().filter((a) => a.status === "pending"),
  });
}

export function useActiveEmployees() {
  return useQuery<JobApplication[]>({
    queryKey: ["activeEmployees"],
    queryFn: async () => loadJobApps().filter((a) => a.status === "approved"),
  });
}

export function useApproveJobApplicationFull() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const apps = loadJobApps();
      const app = apps.find((a) => a.id === id);
      if (!app) throw new Error("Application not found");
      // Age check
      const dob = new Date(app.dob);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      if (age < 19)
        throw new Error(
          "Applicant must be at least 19 years old to be approved",
        );
      app.status = "approved";
      saveJobApps(apps);
      return app;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobApps"] });
      queryClient.invalidateQueries({ queryKey: ["pendingJobAppsFull"] });
      queryClient.invalidateQueries({ queryKey: ["activeEmployees"] });
    },
  });
}

export function useRejectJobApplicationFull() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: number; reason: string }) => {
      const apps = loadJobApps();
      const app = apps.find((a) => a.id === params.id);
      if (!app) throw new Error("Application not found");
      app.status = "rejected";
      app.rejectionReason = params.reason;
      saveJobApps(apps);
      return app;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobApps"] });
      queryClient.invalidateQueries({ queryKey: ["pendingJobAppsFull"] });
      queryClient.invalidateQueries({ queryKey: ["activeEmployees"] });
    },
  });
}

// ── Cash Transfers ────────────────────────────────────────────────────────────

const CASH_TRANSFER_KEY = "tt_cash_transfers";
const CASH_TRANSFER_ID_KEY = "tt_cash_transfer_next_id";

export interface CashTransfer {
  id: number;
  amount: number;
  note: string;
  date: string;
  transferType: "incoming" | "outgoing";
  upiId?: string;
  status: "completed" | "pending";
}

function loadCashTransfers(): CashTransfer[] {
  try {
    const raw = localStorage.getItem(CASH_TRANSFER_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCashTransfers(transfers: CashTransfer[]) {
  try {
    localStorage.setItem(CASH_TRANSFER_KEY, JSON.stringify(transfers));
  } catch {}
}

function loadCashTransferNextId(): number {
  try {
    const raw = localStorage.getItem(CASH_TRANSFER_ID_KEY);
    return raw ? Number.parseInt(raw, 10) : 1;
  } catch {
    return 1;
  }
}

function saveCashTransferNextId(id: number) {
  try {
    localStorage.setItem(CASH_TRANSFER_ID_KEY, String(id));
  } catch {}
}

let cashTransferNextId = loadCashTransferNextId();

export function useGetCashTransfers() {
  return useQuery<CashTransfer[]>({
    queryKey: ["cashTransfers"],
    queryFn: async () => loadCashTransfers(),
  });
}

export function useAddCashTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: Omit<CashTransfer, "id">) => {
      const transfers = loadCashTransfers();
      const newTransfer: CashTransfer = { ...params, id: cashTransferNextId++ };
      transfers.push(newTransfer);
      saveCashTransfers(transfers);
      saveCashTransferNextId(cashTransferNextId);
      return newTransfer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashTransfers"] });
    },
  });
}
