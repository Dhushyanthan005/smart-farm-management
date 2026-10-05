import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { milkApi } from "@/lib/api/milk-api";
import {
  MilkFilterParams,
  CreateMilkRecordInput,
  BatchMilkRecordInput,
  UpdateMilkRecordInput,
  MilkShift,
} from "@/types/milk";

export const MILK_QUERY_KEYS = {
  all: ["milk"] as const,
  lists: () => [...MILK_QUERY_KEYS.all, "list"] as const,
  list: (params: MilkFilterParams = {}) =>
    [...MILK_QUERY_KEYS.lists(), params] as const,
  details: () => [...MILK_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...MILK_QUERY_KEYS.details(), id] as const,
  dailySummary: (date?: string) =>
    [...MILK_QUERY_KEYS.all, "summary", "daily", date || "today"] as const,
  shiftSummary: (date?: string, shift?: MilkShift) =>
    [...MILK_QUERY_KEYS.all, "summary", "shift", date || "today", shift || "MORNING"] as const,
  cowHistory: (cowId: string, page = 0, size = 10) =>
    [...MILK_QUERY_KEYS.all, "cow", cowId, page, size] as const,
};

export function useMilkRecords(params: MilkFilterParams = {}) {
  return useQuery({
    queryKey: MILK_QUERY_KEYS.list(params),
    queryFn: () => milkApi.list(params),
    staleTime: 15_000,
  });
}

export function useMilkRecord(id?: string) {
  return useQuery({
    queryKey: MILK_QUERY_KEYS.detail(id || ""),
    queryFn: () => milkApi.getById(id!),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useDailyMilkSummary(date?: string) {
  return useQuery({
    queryKey: MILK_QUERY_KEYS.dailySummary(date),
    queryFn: () => milkApi.getDailySummary(date),
    staleTime: 30_000,
  });
}

export function useShiftMilkSummary(date?: string, shift?: MilkShift) {
  return useQuery({
    queryKey: MILK_QUERY_KEYS.shiftSummary(date, shift),
    queryFn: () => milkApi.getShiftSummary(date, shift),
    staleTime: 15_000,
  });
}

export function useCowMilkHistory(cowId?: string, page = 0, size = 10) {
  return useQuery({
    queryKey: MILK_QUERY_KEYS.cowHistory(cowId || "", page, size),
    queryFn: () => milkApi.getCowMilkHistory(cowId!, page, size),
    enabled: !!cowId,
    staleTime: 30_000,
  });
}

export function useCreateMilkRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMilkRecordInput) => milkApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: MILK_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: MILK_QUERY_KEYS.all });
      if (variables.cowId) {
        queryClient.invalidateQueries({ queryKey: ["milk", "cow", variables.cowId] });
      }
    },
  });
}

export function useCreateBatchMilkRecords() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BatchMilkRecordInput) => milkApi.createBatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MILK_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: MILK_QUERY_KEYS.all });
    },
  });
}

export function useUpdateMilkRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMilkRecordInput }) =>
      milkApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: MILK_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: MILK_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: MILK_QUERY_KEYS.all });
    },
  });
}

export function useDeleteMilkRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => milkApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MILK_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: MILK_QUERY_KEYS.all });
    },
  });
}
