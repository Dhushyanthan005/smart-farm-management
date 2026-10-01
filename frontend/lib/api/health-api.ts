import { apiClient } from "./client";
import { ApiResponse, PageResponse } from "@/types/api";

export interface HealthRecord {
  id: string;
  cowId: string;
  cowTagNumber: string;
  diagnosis: string;
  treatment: string;
  veterinarianName: string;
  status: "ONGOING" | "RECOVERED" | "CHRONIC";
  recordedAt: string;
}

export const healthApi = {
  list: (page = 0, size = 20, cowId?: string): Promise<ApiResponse<PageResponse<HealthRecord>>> => {
    return apiClient.get<ApiResponse<PageResponse<HealthRecord>>>("/health", { page, size, cowId });
  },

  create: (data: Omit<HealthRecord, "id" | "recordedAt">): Promise<ApiResponse<HealthRecord>> => {
    return apiClient.post<ApiResponse<HealthRecord>>("/health", data);
  },
};
