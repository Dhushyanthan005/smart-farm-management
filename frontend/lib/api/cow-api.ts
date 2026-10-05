import { apiClient } from "./client";
import { ApiResponse, PageResponse } from "@/types/api";
import { Cow, CowFilterParams, CowStats, CreateCowInput, UpdateCowInput } from "@/types/cow";

export const cowApi = {
  list: (params: CowFilterParams = {}): Promise<ApiResponse<PageResponse<Cow>>> => {
    const queryParams: Record<string, string | number | undefined> = {};
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.size !== undefined) queryParams.size = params.size;
    if (params.sort) queryParams.sort = params.sort;
    if (params.search?.trim()) queryParams.search = params.search.trim();
    if (params.healthStatus) queryParams.healthStatus = params.healthStatus;
    if (params.lifecycleStatus) queryParams.lifecycleStatus = params.lifecycleStatus;
    if (params.breed) queryParams.breed = params.breed;
    if (params.gender) queryParams.gender = params.gender;
    if (params.barn?.trim()) queryParams.barn = params.barn.trim();
    if (params.pen?.trim()) queryParams.pen = params.pen.trim();
    if (params.parity !== undefined) queryParams.parity = params.parity;
    if (params.minParity !== undefined) queryParams.minParity = params.minParity;
    if (params.stage?.trim()) queryParams.stage = params.stage.trim();

    return apiClient.get<ApiResponse<PageResponse<Cow>>>("/cows", queryParams);
  },

  getStats: (): Promise<ApiResponse<CowStats>> => {
    return apiClient.get<ApiResponse<CowStats>>("/cows/stats");
  },

  getById: (id: string): Promise<ApiResponse<Cow>> => {
    return apiClient.get<ApiResponse<Cow>>(`/cows/${id}`);
  },

  getByTag: (tagNumber: string): Promise<ApiResponse<Cow>> => {
    return apiClient.get<ApiResponse<Cow>>(`/cows/tag/${encodeURIComponent(tagNumber)}`);
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
