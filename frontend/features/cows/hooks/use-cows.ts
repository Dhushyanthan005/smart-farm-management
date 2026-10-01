import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cowApi } from "@/lib/api/cow-api";
import { CreateCowInput, UpdateCowInput } from "@/types/cow";

export const COW_QUERY_KEYS = {
  all: ["cows"] as const,
  lists: () => [...COW_QUERY_KEYS.all, "list"] as const,
  list: (page: number, size: number, status?: string) =>
    [...COW_QUERY_KEYS.lists(), { page, size, status }] as const,
  details: () => [...COW_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...COW_QUERY_KEYS.details(), id] as const,
};

export function useCows(page = 0, size = 20, status?: string) {
  return useQuery({
    queryKey: COW_QUERY_KEYS.list(page, size, status),
    queryFn: () => cowApi.list(page, size, status),
  });
}

export function useCow(id: string) {
  return useQuery({
    queryKey: COW_QUERY_KEYS.detail(id),
    queryFn: () => cowApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCowInput) => cowApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COW_QUERY_KEYS.lists() });
    },
  });
}

export function useUpdateCow(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCowInput) => cowApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COW_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COW_QUERY_KEYS.detail(id) });
    },
  });
}
