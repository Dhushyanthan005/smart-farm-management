import { apiClient } from "./client";
import { ApiResponse, PageResponse } from "@/types/api";

export interface FeedRecord {
  id: string;
  feedType: string;
  quantityKg: number;
  cost: number;
  date: string;
}

export const feedApi = {
  list: (page = 0, size = 20): Promise<ApiResponse<PageResponse<FeedRecord>>> => {
    return apiClient.get<ApiResponse<PageResponse<FeedRecord>>>("/feed", { page, size });
  },
};
