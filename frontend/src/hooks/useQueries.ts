import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import {
  WorkOrder,
  Electrician,
  ApplicationProcessStatus,
  WorkOrderStatus,
  PaymentStatus,
  ElectricianQualification,
  Speciality,
  WorkAvailability,
} from '../backend';
import { Principal } from '@dfinity/principal';

// ─── Actor helper ────────────────────────────────────────────────────────────

function useActorReady() {
  const { actor, isFetching } = useActor();
  return { actor, actorReady: !!actor && !isFetching };
}

// ─── Auth / Profile ──────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
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
    mutationFn: async (profile: { name: string; email: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias
export const useIsAdmin = useIsCallerAdmin;

// ─── Electricians ─────────────────────────────────────────────────────────────

export function useGetAllElectricians() {
  const { actor, actorReady } = useActorReady();

  return useQuery<Electrician[]>({
    queryKey: ['electricians'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllElectricians();
    },
    enabled: actorReady,
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
      if (!actor) throw new Error('Actor not available');
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
      queryClient.invalidateQueries({ queryKey: ['electricians'] });
      queryClient.invalidateQueries({ queryKey: ['pendingElectricians'] });
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
      if (!actor) throw new Error('Actor not available');
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
      queryClient.invalidateQueries({ queryKey: ['electricians'] });
      queryClient.invalidateQueries({ queryKey: ['pendingElectricians'] });
    },
  });
}

export function useRemoveElectrician() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeElectrician(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['electricians'] });
      queryClient.invalidateQueries({ queryKey: ['pendingElectricians'] });
    },
  });
}

// ─── Work Orders ──────────────────────────────────────────────────────────────

export function useGetAllWorkOrders() {
  const { actor, actorReady } = useActorReady();

  return useQuery<WorkOrder[]>({
    queryKey: ['workOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWorkOrders();
    },
    enabled: actorReady,
  });
}

export function useCreateWorkOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      location: string;
      priority: bigint;
      issuedElectrician: bigint | null;
      customerEmail: string;
      customerAddress: string;
      customerContactNumber: string;
      paymentAmount: bigint;
      paymentMethod: string;
      preferredEducation: ElectricianQualification;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createWorkOrder(
        params.title,
        params.description,
        params.location,
        params.priority,
        params.issuedElectrician,
        params.customerEmail,
        params.customerAddress,
        params.customerContactNumber,
        params.paymentAmount,
        params.paymentMethod,
        params.preferredEducation,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['pendingWorkOrders'] });
    },
  });
}

export function useCreateFixedPriceWorkOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      location: string;
      priority: bigint;
      customerEmail: string;
      customerAddress: string;
      customerContactNumber: string;
      paymentMethod: string;
      preferredEducation: ElectricianQualification;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createFixedPriceWorkOrder(
        params.title,
        params.description,
        params.location,
        params.priority,
        params.customerEmail,
        params.customerAddress,
        params.customerContactNumber,
        params.paymentMethod,
        params.preferredEducation,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['pendingWorkOrders'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserWorkOrders'] });
    },
  });
}

export function useUpdateWorkOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: bigint; status: WorkOrderStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateWorkOrderStatus(params.id, params.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['pendingWorkOrders'] });
    },
  });
}

export function useAssignElectricianToWorkOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { workOrderId: bigint; electricianId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignElectricianToWorkOrder(params.workOrderId, params.electricianId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['verifiedApplications'] });
    },
  });
}

// Alias
export const useAssignElectrician = useAssignElectricianToWorkOrder;

export function useUpdateWorkOrderPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      paymentAmount: bigint;
      paymentMethod: string;
      paymentStatus: PaymentStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateWorkOrderPayment(
        params.id,
        params.paymentAmount,
        params.paymentMethod,
        params.paymentStatus,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['pendingPayments'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}

export function useVerifyAndMoveToQueue() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workOrderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyAndMoveToQueue(workOrderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['verifiedApplications'] });
      queryClient.invalidateQueries({ queryKey: ['pendingJobApplications'] });
    },
  });
}

export function useAcceptWorkOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workOrderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.acceptWorkOrder(workOrderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['verifiedApplications'] });
    },
  });
}

export function useDeclineWorkOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workOrderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.declineWorkOrder(workOrderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['verifiedApplications'] });
      queryClient.invalidateQueries({ queryKey: ['pendingJobApplications'] });
    },
  });
}

export function useGetVerifiedApplications() {
  const { actor, actorReady } = useActorReady();

  return useQuery<WorkOrder[]>({
    queryKey: ['verifiedApplications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVerifiedApplications();
    },
    enabled: actorReady,
  });
}

export function useGetWorkOrderApplication(workOrderId: bigint) {
  const { actor, actorReady } = useActorReady();

  return useQuery({
    queryKey: ['workOrderApplication', workOrderId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWorkOrderApplication(workOrderId);
    },
    enabled: actorReady,
  });
}

export function useApplyForWorkOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workOrderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.applyForWorkOrder(workOrderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['pendingJobApplications'] });
    },
  });
}

export function useGetCurrentUserWorkOrders() {
  const { actor, actorReady } = useActorReady();

  return useQuery<WorkOrder[]>({
    queryKey: ['currentUserWorkOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCurrentUserWorkOrders();
    },
    enabled: actorReady,
  });
}

export function useSubmitWorkerRating() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { workOrderId: bigint; rating: bigint; comment: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitWorkerRating(params.workOrderId, params.rating, params.comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserWorkOrders'] });
    },
  });
}

export function useSubmitCustomerRating() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { workOrderId: bigint; rating: bigint; comment: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitCustomerRating(params.workOrderId, params.rating, params.comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserWorkOrders'] });
    },
  });
}

export function useGetWorkerChecklist(workOrderId: string) {
  const { actor, actorReady } = useActorReady();

  return useQuery({
    queryKey: ['checklist', workOrderId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkerChecklist(workOrderId);
    },
    enabled: actorReady && !!workOrderId,
  });
}

export function useUpdateChecklistItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { workOrderId: string; itemId: string; completed: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateChecklistItem(params.workOrderId, params.itemId, params.completed);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['checklist', variables.workOrderId] });
    },
  });
}

export function useSubscribeToJobAlerts() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.subscribeToJobAlerts();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isSubscribedToJobAlerts'] });
    },
  });
}

export function useIsSubscribedToJobAlerts() {
  const { actor, actorReady } = useActorReady();

  return useQuery<boolean>({
    queryKey: ['isSubscribedToJobAlerts'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isSubscribedToJobAlerts();
    },
    enabled: actorReady,
  });
}

export function useUpdateApplicationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { workOrderId: bigint; newStatus: ApplicationProcessStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateApplicationStatusForWorkOrder(params.workOrderId, params.newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['pendingJobApplications'] });
      queryClient.invalidateQueries({ queryKey: ['verifiedApplications'] });
    },
  });
}

// ─── Verification Queries ─────────────────────────────────────────────────────

export function usePendingWorkOrders() {
  const { actor, actorReady } = useActorReady();

  return useQuery<WorkOrder[]>({
    queryKey: ['pendingWorkOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingWorkOrders();
    },
    enabled: actorReady,
  });
}

export function usePendingElectricians() {
  const { actor, actorReady } = useActorReady();

  return useQuery<Electrician[]>({
    queryKey: ['pendingElectricians'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingElectricians();
    },
    enabled: actorReady,
  });
}

export function usePendingJobApplications() {
  const { actor, actorReady } = useActorReady();

  return useQuery<WorkOrder[]>({
    queryKey: ['pendingJobApplications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingJobApplications();
    },
    enabled: actorReady,
  });
}

export function usePendingPayments() {
  const { actor, actorReady } = useActorReady();

  return useQuery<WorkOrder[]>({
    queryKey: ['pendingPayments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingPayments();
    },
    enabled: actorReady,
  });
}

// ─── Verification Mutations ───────────────────────────────────────────────────

export function useApproveWorkOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveWorkOrder(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['pendingWorkOrders'] });
    },
  });
}

export function useRejectWorkOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: bigint; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectWorkOrder(params.id, params.reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['pendingWorkOrders'] });
    },
  });
}

export function useApproveElectrician() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveElectrician(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['electricians'] });
      queryClient.invalidateQueries({ queryKey: ['pendingElectricians'] });
    },
  });
}

export function useRejectElectrician() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: bigint; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectElectrician(params.id, params.reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['electricians'] });
      queryClient.invalidateQueries({ queryKey: ['pendingElectricians'] });
    },
  });
}

export function useApproveJobApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { workOrderId: bigint; applicantId: Principal }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveJobApplication(params.workOrderId, params.applicantId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['pendingJobApplications'] });
    },
  });
}

export function useRejectJobApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { workOrderId: bigint; applicantId: Principal; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectJobApplication(params.workOrderId, params.applicantId, params.reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['pendingJobApplications'] });
    },
  });
}

export function useApprovePayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workOrderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approvePayment(workOrderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['pendingPayments'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}

export function useFlagPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { workOrderId: bigint; note: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.flagPayment(params.workOrderId, params.note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['pendingPayments'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}
