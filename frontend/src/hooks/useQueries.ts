import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import {
  WorkOrder,
  Electrician,
  UserProfile,
  ApplicationProcessStatus,
  PaymentStatus,
  Speciality,
  WorkAvailability,
  WorkOrderStatus,
  ElectricianQualification,
} from '../backend';

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
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
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Electricians ─────────────────────────────────────────────────────────────

export function useGetAllElectricians() {
  const { actor, isFetching } = useActor();

  return useQuery<Electrician[]>({
    queryKey: ['electricians'],
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
    },
  });
}

// ─── Work Orders ──────────────────────────────────────────────────────────────

export function useGetAllWorkOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<WorkOrder[]>({
    queryKey: ['workOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWorkOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCurrentUserWorkOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<WorkOrder[]>({
    queryKey: ['currentUserWorkOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCurrentUserWorkOrders();
    },
    enabled: !!actor && !isFetching,
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
      queryClient.invalidateQueries({ queryKey: ['currentUserWorkOrders'] });
    },
  });
}

export function useUpdateWorkOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: bigint; status: WorkOrderStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateWorkOrderStatus(params.id, params.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
    },
  });
}

export function useAssignElectrician() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { workOrderId: bigint; issuedElectrician: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignElectricianToWorkOrder(params.workOrderId, params.issuedElectrician);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
    },
  });
}

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
    },
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
      queryClient.invalidateQueries({ queryKey: ['currentUserWorkOrders'] });
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
      queryClient.invalidateQueries({ queryKey: ['currentUserWorkOrders'] });
    },
  });
}

export function useVerifyWorkOrderApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workOrderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyWorkOrderApplication(workOrderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
    },
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
    },
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
    },
  });
}

// ─── Job Alerts ───────────────────────────────────────────────────────────────

export function useIsSubscribedToJobAlerts() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['jobAlertSubscription'],
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
      if (!actor) throw new Error('Actor not available');
      return actor.subscribeToJobAlerts();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobAlertSubscription'] });
    },
  });
}
