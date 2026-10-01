import { apiClient } from "./client";
import { ApiResponse } from "@/types/api";

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  period: string;
}

export const financeApi = {
  getSummary: (period = "CURRENT_MONTH"): Promise<ApiResponse<FinancialSummary>> => {
    return apiClient.get<ApiResponse<FinancialSummary>>("/finance/summary", { period });
  },
};
