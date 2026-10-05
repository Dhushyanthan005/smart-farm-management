import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { breedingApi } from "@/lib/api/breeding-api";
import {
  HeatFilterParams,
  BreedingFilterParams,
  PregnancyFilterParams,
  CalvingFilterParams,
  CreateHeatRecordInput,
  UpdateHeatRecordInput,
  CreateBreedingRecordInput,
  UpdateBreedingRecordInput,
  CreatePregnancyRecordInput,
  ConfirmPregnancyInput,
  UpdatePregnancyRecordInput,
  CreateCalvingRecordInput,
  UpdateCalvingRecordInput,
} from "@/types/breeding";

export const BREEDING_QUERY_KEYS = {
  all: ["breeding"] as const,

  // Summary
  summary: () => [...BREEDING_QUERY_KEYS.all, "summary"] as const,

  // Heat
  heat: () => [...BREEDING_QUERY_KEYS.all, "heat"] as const,
  heatList: (params: HeatFilterParams = {}) =>
    [...BREEDING_QUERY_KEYS.heat(), "list", params] as const,
  heatDetail: (id: string) =>
    [...BREEDING_QUERY_KEYS.heat(), "detail", id] as const,

  // Breeding Records
  records: () => [...BREEDING_QUERY_KEYS.all, "records"] as const,
  recordList: (params: BreedingFilterParams = {}) =>
    [...BREEDING_QUERY_KEYS.records(), "list", params] as const,
  recordDetail: (id: string) =>
    [...BREEDING_QUERY_KEYS.records(), "detail", id] as const,

  // Pregnancy
  pregnancies: () => [...BREEDING_QUERY_KEYS.all, "pregnancies"] as const,
  pregnancyList: (params: PregnancyFilterParams = {}) =>
    [...BREEDING_QUERY_KEYS.pregnancies(), "list", params] as const,
  pregnancyDetail: (id: string) =>
    [...BREEDING_QUERY_KEYS.pregnancies(), "detail", id] as const,

  // Calving
  calvings: () => [...BREEDING_QUERY_KEYS.all, "calvings"] as const,
  calvingList: (params: CalvingFilterParams = {}) =>
    [...BREEDING_QUERY_KEYS.calvings(), "list", params] as const,
  calvingDetail: (id: string) =>
    [...BREEDING_QUERY_KEYS.calvings(), "detail", id] as const,

  // Cow-specific
  cowBreeding: (cowId: string) =>
    [...BREEDING_QUERY_KEYS.all, "cow", cowId, "summary"] as const,
  cowHeat: (cowId: string, page = 0, size = 10) =>
    [...BREEDING_QUERY_KEYS.all, "cow", cowId, "heat", page, size] as const,
  cowPregnancy: (cowId: string, page = 0, size = 10) =>
    [...BREEDING_QUERY_KEYS.all, "cow", cowId, "pregnancy", page, size] as const,
  cowCalving: (cowId: string, page = 0, size = 10) =>
    [...BREEDING_QUERY_KEYS.all, "cow", cowId, "calving", page, size] as const,
};

// ==========================================
// SUMMARY HOOK
// ==========================================
export function useBreedingSummary() {
  return useQuery({
    queryKey: BREEDING_QUERY_KEYS.summary(),
    queryFn: () => breedingApi.getSummary(),
    staleTime: 30 * 1000,
  });
}

// ==========================================
// HEAT HOOKS
// ==========================================
export function useHeatRecords(params: HeatFilterParams = {}) {
  return useQuery({
    queryKey: BREEDING_QUERY_KEYS.heatList(params),
    queryFn: () => breedingApi.listHeatRecords(params),
  });
}

export function useHeatRecord(id?: string) {
  return useQuery({
    queryKey: BREEDING_QUERY_KEYS.heatDetail(id || ""),
    queryFn: () => breedingApi.getHeatRecordById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateHeatRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateHeatRecordInput) => breedingApi.createHeatRecord(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.heat() });
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.summary() });
      if (variables.cowId) {
        queryClient.invalidateQueries({
          queryKey: [...BREEDING_QUERY_KEYS.all, "cow", variables.cowId],
        });
      }
    },
  });
}

export function useUpdateHeatRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHeatRecordInput }) =>
      breedingApi.updateHeatRecord(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.heat() });
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.summary() });
      if (res.data?.cowId) {
        queryClient.invalidateQueries({
          queryKey: [...BREEDING_QUERY_KEYS.all, "cow", res.data.cowId],
        });
      }
    },
  });
}

export function useDeleteHeatRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => breedingApi.deleteHeatRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.heat() });
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.summary() });
    },
  });
}

// ==========================================
// BREEDING HOOKS
// ==========================================
export function useBreedingRecords(params: BreedingFilterParams = {}) {
  return useQuery({
    queryKey: BREEDING_QUERY_KEYS.recordList(params),
    queryFn: () => breedingApi.listBreedingRecords(params),
  });
}

export function useBreedingRecord(id?: string) {
  return useQuery({
    queryKey: BREEDING_QUERY_KEYS.recordDetail(id || ""),
    queryFn: () => breedingApi.getBreedingRecordById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateBreeding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBreedingRecordInput) => breedingApi.createBreedingRecord(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.records() });
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.summary() });
      if (variables.cowId) {
        queryClient.invalidateQueries({
          queryKey: [...BREEDING_QUERY_KEYS.all, "cow", variables.cowId],
        });
      }
    },
  });
}

export function useUpdateBreeding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBreedingRecordInput }) =>
      breedingApi.updateBreedingRecord(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.records() });
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.summary() });
      if (res.data?.cowId) {
        queryClient.invalidateQueries({
          queryKey: [...BREEDING_QUERY_KEYS.all, "cow", res.data.cowId],
        });
      }
    },
  });
}

export function useCompleteBreeding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => breedingApi.completeBreedingRecord(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.records() });
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.summary() });
      if (res.data?.cowId) {
        queryClient.invalidateQueries({
          queryKey: [...BREEDING_QUERY_KEYS.all, "cow", res.data.cowId],
        });
      }
    },
  });
}

export function useCancelBreeding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => breedingApi.cancelBreedingRecord(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.records() });
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.summary() });
      if (res.data?.cowId) {
        queryClient.invalidateQueries({
          queryKey: [...BREEDING_QUERY_KEYS.all, "cow", res.data.cowId],
        });
      }
    },
  });
}

// ==========================================
// PREGNANCY HOOKS
// ==========================================
export function usePregnancies(params: PregnancyFilterParams = {}) {
  return useQuery({
    queryKey: BREEDING_QUERY_KEYS.pregnancyList(params),
    queryFn: () => breedingApi.listPregnancies(params),
  });
}

export function usePregnancy(id?: string) {
  return useQuery({
    queryKey: BREEDING_QUERY_KEYS.pregnancyDetail(id || ""),
    queryFn: () => breedingApi.getPregnancyRecordById(id!),
    enabled: Boolean(id),
  });
}

export function useCreatePregnancy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePregnancyRecordInput) => breedingApi.createPregnancyRecord(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.pregnancies() });
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.summary() });
      queryClient.invalidateQueries({ queryKey: ["cows"] });
      if (variables.cowId) {
        queryClient.invalidateQueries({
          queryKey: [...BREEDING_QUERY_KEYS.all, "cow", variables.cowId],
        });
      }
    },
  });
}

export function useUpdatePregnancy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePregnancyRecordInput }) =>
      breedingApi.updatePregnancyRecord(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.pregnancies() });
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.summary() });
      if (res.data?.cowId) {
        queryClient.invalidateQueries({
          queryKey: [...BREEDING_QUERY_KEYS.all, "cow", res.data.cowId],
        });
      }
    },
  });
}

export function useConfirmPregnancy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ConfirmPregnancyInput }) =>
      breedingApi.confirmPregnancy(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.pregnancies() });
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.summary() });
      queryClient.invalidateQueries({ queryKey: ["cows"] });
      if (res.data?.cowId) {
        queryClient.invalidateQueries({
          queryKey: [...BREEDING_QUERY_KEYS.all, "cow", res.data.cowId],
        });
      }
    },
  });
}

export function useMarkNotPregnant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => breedingApi.markNotPregnant(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.pregnancies() });
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.summary() });
      queryClient.invalidateQueries({ queryKey: ["cows"] });
      if (res.data?.cowId) {
        queryClient.invalidateQueries({
          queryKey: [...BREEDING_QUERY_KEYS.all, "cow", res.data.cowId],
        });
      }
    },
  });
}

export function useMarkPregnancyLost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => breedingApi.markPregnancyLost(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.pregnancies() });
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.summary() });
      queryClient.invalidateQueries({ queryKey: ["cows"] });
      if (res.data?.cowId) {
        queryClient.invalidateQueries({
          queryKey: [...BREEDING_QUERY_KEYS.all, "cow", res.data.cowId],
        });
      }
    },
  });
}

// ==========================================
// CALVING HOOKS
// ==========================================
export function useCalvings(params: CalvingFilterParams = {}) {
  return useQuery({
    queryKey: BREEDING_QUERY_KEYS.calvingList(params),
    queryFn: () => breedingApi.listCalvings(params),
  });
}

export function useCalving(id?: string) {
  return useQuery({
    queryKey: BREEDING_QUERY_KEYS.calvingDetail(id || ""),
    queryFn: () => breedingApi.getCalvingRecordById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateCalving() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCalvingRecordInput) => breedingApi.createCalvingRecord(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.calvings() });
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.pregnancies() });
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.summary() });
      queryClient.invalidateQueries({ queryKey: ["cows"] });
      if (variables.cowId) {
        queryClient.invalidateQueries({
          queryKey: [...BREEDING_QUERY_KEYS.all, "cow", variables.cowId],
        });
      }
    },
  });
}

export function useUpdateCalving() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCalvingRecordInput }) =>
      breedingApi.updateCalvingRecord(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.calvings() });
      queryClient.invalidateQueries({ queryKey: BREEDING_QUERY_KEYS.summary() });
      if (res.data?.cowId) {
        queryClient.invalidateQueries({
          queryKey: [...BREEDING_QUERY_KEYS.all, "cow", res.data.cowId],
        });
      }
    },
  });
}

// ==========================================
// COW-SPECIFIC REPRODUCTIVE HOOKS
// ==========================================
export function useCowBreedingHistory(cowId?: string) {
  return useQuery({
    queryKey: BREEDING_QUERY_KEYS.cowBreeding(cowId || ""),
    queryFn: () => breedingApi.getCowBreedingSummary(cowId!),
    enabled: Boolean(cowId),
  });
}

export function useCowHeatHistory(cowId?: string, page = 0, size = 10) {
  return useQuery({
    queryKey: BREEDING_QUERY_KEYS.cowHeat(cowId || "", page, size),
    queryFn: () => breedingApi.getCowHeatHistory(cowId!, page, size),
    enabled: Boolean(cowId),
  });
}

export function useCowPregnancyHistory(cowId?: string, page = 0, size = 10) {
  return useQuery({
    queryKey: BREEDING_QUERY_KEYS.cowPregnancy(cowId || "", page, size),
    queryFn: () => breedingApi.getCowPregnancyHistory(cowId!, page, size),
    enabled: Boolean(cowId),
  });
}

export function useCowCalvingHistory(cowId?: string, page = 0, size = 10) {
  return useQuery({
    queryKey: BREEDING_QUERY_KEYS.cowCalving(cowId || "", page, size),
    queryFn: () => breedingApi.getCowCalvingHistory(cowId!, page, size),
    enabled: Boolean(cowId),
  });
}
