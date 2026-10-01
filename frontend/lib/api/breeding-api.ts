import { apiClient } from "./client";
import { ApiResponse, PageResponse } from "@/types/api";

export interface BreedingRecord {
  id: string;
  cowId: string;
  inseminationDate: string;
  expectedCalvingDate?: string;
  status: "INSEMINATED" | "PREGNANT" | "CALVED" | "FAILED";
}

export const breedingApi = {
  list: (page = 0, size = 20): Promise<ApiResponse<PageResponse<BreedingRecord>>> => {
    return apiClient.get<ApiResponse<PageResponse<BreedingRecord>>>("/breeding", { page, size });
  },
};
