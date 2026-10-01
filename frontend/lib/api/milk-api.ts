import { apiClient } from "./client";
import { ApiResponse, PageResponse } from "@/types/api";

export interface MilkRecord {
  id: string;
  cowId: string;
  cowTagNumber: string;
  session: "MORNING" | "EVENING";
  quantityLiters: number;
  fatPercentage?: number;
  snfPercentage?: number;
  recordedAt: string;
}

export const milkApi = {
  list: (page = 0, size = 20, date?: string): Promise<ApiResponse<PageResponse<MilkRecord>>> => {
    return apiClient.get<ApiResponse<PageResponse<MilkRecord>>>("/milk", { page, size, date });
  },

  recordCollection: (data: Omit<MilkRecord, "id" | "recordedAt">): Promise<ApiResponse<MilkRecord>> => {
    return apiClient.post<ApiResponse<MilkRecord>>("/milk", data);
  },
};
