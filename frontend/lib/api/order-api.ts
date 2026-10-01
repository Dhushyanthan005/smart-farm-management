import { apiClient } from "./client";
import { ApiResponse, PageResponse } from "@/types/api";

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  orderDate: string;
}

export const orderApi = {
  list: (page = 0, size = 20): Promise<ApiResponse<PageResponse<Order>>> => {
    return apiClient.get<ApiResponse<PageResponse<Order>>>("/orders", { page, size });
  },
};
