import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { healthApi } from "@/lib/api/health-api";
import {
  HealthFilterParams,
  TreatmentFilterParams,
  QuarantineFilterParams,
  CreateHealthRecordInput,
  UpdateHealthRecordInput,
  CreateTreatmentInput,
  UpdateTreatmentInput,
  CompleteTreatmentInput,
  CreateQuarantineInput,
  UpdateQuarantineInput,
  ReleaseQuarantineInput,
} from "@/types/health";

export const HEALTH_QUERY_KEYS = {
  all: ["health"] as const,

  // Records
  records: () => [...HEALTH_QUERY_KEYS.all, "records"] as const,
  recordList: (params: HealthFilterParams = {}) =>
    [...HEALTH_QUERY_KEYS.records(), "list", params] as const,
  recordDetail: (id: string) =>
    [...HEALTH_QUERY_KEYS.records(), "detail", id] as const,

  // Treatments
  treatments: () => [...HEALTH_QUERY_KEYS.all, "treatments"] as const,
  treatmentList: (params: TreatmentFilterParams = {}) =>
    [...HEALTH_QUERY_KEYS.treatments(), "list", params] as const,
  treatmentDetail: (id: string) =>
    [...HEALTH_QUERY_KEYS.treatments(), "detail", id] as const,

  // Quarantine
  quarantines: () => [...HEALTH_QUERY_KEYS.all, "quarantines"] as const,
  quarantineList: (params: QuarantineFilterParams = {}) =>
    [...HEALTH_QUERY_KEYS.quarantines(), "list", params] as const,
  quarantineDetail: (id: string) =>
    [...HEALTH_QUERY_KEYS.quarantines(), "detail", id] as const,

  // Withdrawals & Summary
  withdrawals: () => [...HEALTH_QUERY_KEYS.all, "withdrawals"] as const,
  summary: () => [...HEALTH_QUERY_KEYS.all, "summary"] as const,

  // Cow-specific
  cowHealth: (cowId: string, page = 0, size = 10) =>
    [...HEALTH_QUERY_KEYS.all, "cow", cowId, "records", page, size] as const,
  cowTreatments: (cowId: string, page = 0, size = 10) =>
    [...HEALTH_QUERY_KEYS.all, "cow", cowId, "treatments", page, size] as const,
  cowQuarantines: (cowId: string, page = 0, size = 10) =>
    [...HEALTH_QUERY_KEYS.all, "cow", cowId, "quarantine", page, size] as const,
  cowWithdrawalStatus: (cowId: string) =>
    [...HEALTH_QUERY_KEYS.all, "cow", cowId, "withdrawal-status"] as const,
};

// ==========================================
// SUMMARY HOOK
// ==========================================
export function useHealthSummary() {
  return useQuery({
    queryKey: HEALTH_QUERY_KEYS.summary(),
    queryFn: () => healthApi.getSummary(),
    staleTime: 15_000,
  });
}

// ==========================================
// HEALTH RECORD HOOKS
// ==========================================
export function useHealthRecords(params: HealthFilterParams = {}) {
  return useQuery({
    queryKey: HEALTH_QUERY_KEYS.recordList(params),
    queryFn: () => healthApi.listHealthRecords(params),
    staleTime: 15_000,
  });
}

export function useHealthRecord(id?: string) {
  return useQuery({
    queryKey: HEALTH_QUERY_KEYS.recordDetail(id || ""),
    queryFn: () => healthApi.getHealthRecordById(id!),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useCreateHealthRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateHealthRecordInput) =>
      healthApi.createHealthRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["cows"] });
    },
  });
}

export function useUpdateHealthRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHealthRecordInput }) =>
      healthApi.updateHealthRecord(id, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEYS.recordDetail(vars.id) });
      queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEYS.records() });
      queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEYS.summary() });
    },
  });
}

export function useDeleteHealthRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => healthApi.deleteHealthRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["cows"] });
    },
  });
}

// ==========================================
// TREATMENT HOOKS
// ==========================================
export function useTreatments(params: TreatmentFilterParams = {}) {
  return useQuery({
    queryKey: HEALTH_QUERY_KEYS.treatmentList(params),
    queryFn: () => healthApi.listTreatments(params),
    staleTime: 15_000,
  });
}

export function useTreatment(id?: string) {
  return useQuery({
    queryKey: HEALTH_QUERY_KEYS.treatmentDetail(id || ""),
    queryFn: () => healthApi.getTreatmentById(id!),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useCreateTreatment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTreatmentInput) => healthApi.createTreatment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["cows"] });
    },
  });
}

export function useUpdateTreatment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTreatmentInput }) =>
      healthApi.updateTreatment(id, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEYS.treatmentDetail(vars.id) });
      queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEYS.treatments() });
      queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEYS.withdrawals() });
      queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEYS.summary() });
    },
  });
}

export function useCompleteTreatment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: CompleteTreatmentInput }) =>
      healthApi.completeTreatment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["cows"] });
    },
  });
}

// ==========================================
// QUARANTINE HOOKS
// ==========================================
export function useQuarantineRecords(params: QuarantineFilterParams = {}) {
  return useQuery({
    queryKey: HEALTH_QUERY_KEYS.quarantineList(params),
    queryFn: () => healthApi.listQuarantines(params),
    staleTime: 15_000,
  });
}

export function useQuarantineRecord(id?: string) {
  return useQuery({
    queryKey: HEALTH_QUERY_KEYS.quarantineDetail(id || ""),
    queryFn: () => healthApi.getQuarantineById(id!),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useCreateQuarantine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateQuarantineInput) =>
      healthApi.createQuarantine(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["cows"] });
    },
  });
}

export function useUpdateQuarantine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuarantineInput }) =>
      healthApi.updateQuarantine(id, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEYS.quarantineDetail(vars.id) });
      queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEYS.quarantines() });
      queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEYS.summary() });
    },
  });
}

export function useReleaseQuarantine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: ReleaseQuarantineInput }) =>
      healthApi.releaseQuarantine(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HEALTH_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["cows"] });
    },
  });
}

// ==========================================
// WITHDRAWAL HOOKS
// ==========================================
export function useWithdrawals() {
  return useQuery({
    queryKey: HEALTH_QUERY_KEYS.withdrawals(),
    queryFn: () => healthApi.getWithdrawals(),
    staleTime: 15_000,
  });
}

export function useCowWithdrawalStatus(cowId?: string) {
  return useQuery({
    queryKey: HEALTH_QUERY_KEYS.cowWithdrawalStatus(cowId || ""),
    queryFn: () => healthApi.getCowWithdrawalStatus(cowId!),
    enabled: !!cowId,
    staleTime: 15_000,
  });
}

// ==========================================
// COW PROFILE INTEGRATION HOOKS
// ==========================================
export function useCowHealthHistory(cowId?: string, page = 0, size = 10) {
  return useQuery({
    queryKey: HEALTH_QUERY_KEYS.cowHealth(cowId || "", page, size),
    queryFn: () => healthApi.getCowHealthHistory(cowId!, page, size),
    enabled: !!cowId,
    staleTime: 30_000,
  });
}

export function useCowTreatmentHistory(cowId?: string, page = 0, size = 10) {
  return useQuery({
    queryKey: HEALTH_QUERY_KEYS.cowTreatments(cowId || "", page, size),
    queryFn: () => healthApi.getCowTreatmentHistory(cowId!, page, size),
    enabled: !!cowId,
    staleTime: 30_000,
  });
}

export function useCowQuarantineHistory(cowId?: string, page = 0, size = 10) {
  return useQuery({
    queryKey: HEALTH_QUERY_KEYS.cowQuarantines(cowId || "", page, size),
    queryFn: () => healthApi.getCowQuarantineHistory(cowId!, page, size),
    enabled: !!cowId,
    staleTime: 30_000,
  });
}
