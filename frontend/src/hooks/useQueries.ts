import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Electrician, WorkOrder, UserProfile, PaymentStatus } from '../backend';
import { WorkOrderStatus, Speciality } from '../backend';

// ─── Electricians ────────────────────────────────────────────────────────────

export function useGetElectricians() {
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
    mutationFn: async (data: {
      name: string;
      specialist: Speciality;
      email: string;
      address: string;
      hourlyRate: bigint;
      currency: string;
      paymentMethod: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addElectrician(
        data.name,
        data.specialist,
        data.email,
        data.address,
        data.hourlyRate,
        data.currency,
        data.paymentMethod,
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
    mutationFn: async (data: {
      id: bigint;
      name?: string;
      specialist?: Speciality;
      isAvailable?: boolean;
      email?: string;
      address?: string;
      hourlyRate?: bigint;
      currency?: string;
      paymentMethod?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateElectrician(
        data.id,
        data.name ?? null,
        data.specialist ?? null,
        data.isAvailable ?? null,
        data.email ?? null,
        data.address ?? null,
        data.hourlyRate ?? null,
        data.currency ?? null,
        data.paymentMethod ?? null,
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

// ─── Work Orders ─────────────────────────────────────────────────────────────

export function useGetWorkOrders() {
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

export function useGetWorkOrdersByElectrician(electricianId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<WorkOrder[]>({
    queryKey: ['workOrdersByElectrician', String(electricianId)],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkOrdersByElectrician(electricianId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateWorkOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      location: string;
      priority: bigint;
      issuedElectrician: bigint;
      customerEmail: string;
      customerAddress: string;
      paymentAmount: bigint;
      paymentMethod: string;
      preferredEducation: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createWorkOrder(
        data.title,
        data.description,
        data.location,
        data.priority,
        data.issuedElectrician,
        data.customerEmail,
        data.customerAddress,
        data.paymentAmount,
        data.paymentMethod,
        data.preferredEducation,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
    },
  });
}

export function useUpdateWorkOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; status: WorkOrderStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateWorkOrderStatus(data.id, data.status);
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
    mutationFn: async (data: { workOrderId: bigint; issuedElectrician: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignElectricianToWorkOrder(data.workOrderId, data.issuedElectrician);
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
    mutationFn: async (data: {
      id: bigint;
      paymentAmount: bigint;
      paymentMethod: string;
      paymentStatus: PaymentStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateWorkOrderPayment(
        data.id,
        data.paymentAmount,
        data.paymentMethod,
        data.paymentStatus,
      );
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
    mutationFn: async (data: { workOrderId: bigint; rating: bigint; comment: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitWorkerRating(data.workOrderId, data.rating, data.comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['workOrdersByElectrician'] });
    },
  });
}

export function useSubmitCustomerRating() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { workOrderId: bigint; rating: bigint; comment: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitCustomerRating(data.workOrderId, data.rating, data.comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
    },
  });
}

// ─── User Profile ─────────────────────────────────────────────────────────────

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
