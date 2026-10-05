import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cowApi } from "@/lib/api/cow-api";
import { CowFilterParams, CreateCowInput, UpdateCowInput } from "@/types/cow";

export const COW_QUERY_KEYS = {
  all: ["cows"] as const,
  lists: () => [...COW_QUERY_KEYS.all, "list"] as const,
  list: (params: CowFilterParams = {}) =>
    [...COW_QUERY_KEYS.lists(), params] as const,
  details: () => [...COW_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...COW_QUERY_KEYS.details(), id] as const,
  stats: () => [...COW_QUERY_KEYS.all, "stats"] as const,
};

export function useCows(params: CowFilterParams = {}) {
  return useQuery({
    queryKey: COW_QUERY_KEYS.list(params),
    queryFn: () => cowApi.list(params),
    staleTime: 30_000,
  });
}

export function useCow(id?: string) {
  return useQuery({
    queryKey: COW_QUERY_KEYS.detail(id || ""),
    queryFn: () => cowApi.getById(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useCowStats() {
  return useQuery({
    queryKey: COW_QUERY_KEYS.stats(),
    queryFn: () => cowApi.getStats(),
    staleTime: 60_000,
  });
}

export function useCreateCow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCowInput) => cowApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COW_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COW_QUERY_KEYS.stats() });
    },
  });
}

export function useUpdateCow(id?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id: cowId, data }: { id: string; data: UpdateCowInput }) =>
      cowApi.update(cowId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: COW_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COW_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: COW_QUERY_KEYS.stats() });
    },
  });
}

export function useDeleteCow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cowApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COW_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COW_QUERY_KEYS.stats() });
    },
  });
}
