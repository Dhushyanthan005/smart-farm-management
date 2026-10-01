import { apiClient } from "./client";
import { ApiResponse, PageResponse } from "@/types/api";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  status: "ACTIVE" | "INACTIVE";
}

export const customerApi = {
  list: (page = 0, size = 20): Promise<ApiResponse<PageResponse<Customer>>> => {
    return apiClient.get<ApiResponse<PageResponse<Customer>>>("/customers", { page, size });
  },
};
