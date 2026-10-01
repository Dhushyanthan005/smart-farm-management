import { apiClient } from "./client";
import { ApiResponse, PageResponse } from "@/types/api";
import { Cow, CreateCowInput, UpdateCowInput } from "@/types/cow";

export const cowApi = {
  list: (page = 0, size = 20, status?: string): Promise<ApiResponse<PageResponse<Cow>>> => {
    return apiClient.get<ApiResponse<PageResponse<Cow>>>("/cows", { page, size, status });
  },

  getById: (id: string): Promise<ApiResponse<Cow>> => {
    return apiClient.get<ApiResponse<Cow>>(`/cows/${id}`);
  },

  getByTag: (tagNumber: string): Promise<ApiResponse<Cow>> => {
    return apiClient.get<ApiResponse<Cow>>(`/cows/tag/${tagNumber}`);
  },

  create: (data: CreateCowInput): Promise<ApiResponse<Cow>> => {
    return apiClient.post<ApiResponse<Cow>>("/cows", data);
  },

  update: (id: string, data: UpdateCowInput): Promise<ApiResponse<Cow>> => {
    return apiClient.put<ApiResponse<Cow>>(`/cows/${id}`, data);
  },

  delete: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/cows/${id}`);
  },
};
