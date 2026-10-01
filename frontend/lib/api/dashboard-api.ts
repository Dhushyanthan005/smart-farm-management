import { apiClient } from "./client";
import { ApiResponse } from "@/types/api";

export interface DashboardMetrics {
  totalCows: number;
  lactatingCows: number;
  dailyMilkYieldLiters: number;
  activeSubscriptions: number;
  pendingDeliveries: number;
  lowStockItemsCount: number;
}

export const dashboardApi = {
  getMetrics: (): Promise<ApiResponse<DashboardMetrics>> => {
    return apiClient.get<ApiResponse<DashboardMetrics>>("/dashboard/metrics");
  },
};
