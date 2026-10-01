import { apiClient } from "./client";
import { ApiResponse, PageResponse } from "@/types/api";

export interface InventoryItem {
  id: string;
  name: string;
  category: "FEED" | "MEDICINE" | "EQUIPMENT" | "GENERAL";
  quantity: number;
  unit: string;
  minThreshold: number;
  isLowStock: boolean;
}

export const inventoryApi = {
  list: (page = 0, size = 20): Promise<ApiResponse<PageResponse<InventoryItem>>> => {
    return apiClient.get<ApiResponse<PageResponse<InventoryItem>>>("/inventory", { page, size });
  },
};
