import { apiClient } from "./client";
import { ApiResponse, PageResponse } from "@/types/api";
import {
  MilkRecord,
  MilkFilterParams,
  DailyMilkSummary,
  ShiftMilkSummary,
  CreateMilkRecordInput,
  BatchMilkRecordInput,
  UpdateMilkRecordInput,
  MilkShift,
} from "@/types/milk";

export const milkApi = {
  list: (params: MilkFilterParams = {}): Promise<ApiResponse<PageResponse<MilkRecord>>> => {
    const queryParams: Record<string, string | number | undefined> = {};
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.size !== undefined) queryParams.size = params.size;
    if (params.sort) queryParams.sort = params.sort;
    if (params.date) queryParams.date = params.date;
    if (params.fromDate) queryParams.fromDate = params.fromDate;
    if (params.toDate) queryParams.toDate = params.toDate;
    if (params.shift) queryParams.shift = params.shift;
    if (params.status) queryParams.status = params.status;
    if (params.cowId) queryParams.cowId = params.cowId;
    if (params.cowTagNumber?.trim()) queryParams.cowTagNumber = params.cowTagNumber.trim();
    if (params.search?.trim()) queryParams.search = params.search.trim();

    return apiClient.get<ApiResponse<PageResponse<MilkRecord>>>("/milk", queryParams);
  },

  getById: (id: string): Promise<ApiResponse<MilkRecord>> => {
    return apiClient.get<ApiResponse<MilkRecord>>(`/milk/${id}`);
  },

  create: (data: CreateMilkRecordInput): Promise<ApiResponse<MilkRecord>> => {
    return apiClient.post<ApiResponse<MilkRecord>>("/milk", data);
  },

  createBatch: (data: BatchMilkRecordInput): Promise<ApiResponse<MilkRecord[]>> => {
    return apiClient.post<ApiResponse<MilkRecord[]>>("/milk/batch", data);
  },

  update: (id: string, data: UpdateMilkRecordInput): Promise<ApiResponse<MilkRecord>> => {
    return apiClient.put<ApiResponse<MilkRecord>>(`/milk/${id}`, data);
  },

  delete: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/milk/${id}`);
  },

  getDailySummary: (date?: string): Promise<ApiResponse<DailyMilkSummary>> => {
    const queryParams: Record<string, string | undefined> = {};
    if (date) queryParams.date = date;
    return apiClient.get<ApiResponse<DailyMilkSummary>>("/milk/summary/daily", queryParams);
  },

  getShiftSummary: (date?: string, shift?: MilkShift): Promise<ApiResponse<ShiftMilkSummary>> => {
    const queryParams: Record<string, string | undefined> = {};
    if (date) queryParams.date = date;
    if (shift) queryParams.shift = shift;
    return apiClient.get<ApiResponse<ShiftMilkSummary>>("/milk/summary/shift", queryParams);
  },

  getCowMilkHistory: (
    cowId: string,
    page = 0,
    size = 10
  ): Promise<ApiResponse<PageResponse<MilkRecord>>> => {
    return apiClient.get<ApiResponse<PageResponse<MilkRecord>>>(`/cows/${cowId}/milk`, {
      page,
      size,
    });
  },
};
