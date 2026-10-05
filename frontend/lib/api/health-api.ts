import { apiClient } from "./client";
import { ApiResponse, PageResponse } from "@/types/api";
import {
  HealthRecord,
  Treatment,
  QuarantineRecord,
  WithdrawalCase,
  CowWithdrawalStatus,
  HealthSummary,
  CreateHealthRecordInput,
  UpdateHealthRecordInput,
  CreateTreatmentInput,
  UpdateTreatmentInput,
  CompleteTreatmentInput,
  CreateQuarantineInput,
  UpdateQuarantineInput,
  ReleaseQuarantineInput,
  HealthFilterParams,
  TreatmentFilterParams,
  QuarantineFilterParams,
} from "@/types/health";

export const healthApi = {
  // ==========================================
  // HEALTH RECORDS
  // ==========================================
  listHealthRecords: (
    params: HealthFilterParams = {}
  ): Promise<ApiResponse<PageResponse<HealthRecord>>> => {
    const queryParams: Record<string, string | number | undefined> = {};
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.size !== undefined) queryParams.size = params.size;
    if (params.sort) queryParams.sort = params.sort;
    if (params.cowId) queryParams.cowId = params.cowId;
    if (params.cowTagNumber?.trim()) queryParams.cowTagNumber = params.cowTagNumber.trim();
    if (params.healthStatus) queryParams.healthStatus = params.healthStatus;
    if (params.fromDate) queryParams.fromDate = params.fromDate;
    if (params.toDate) queryParams.toDate = params.toDate;
    if (params.diagnosis?.trim()) queryParams.diagnosis = params.diagnosis.trim();
    if (params.veterinarianId) queryParams.veterinarianId = params.veterinarianId;
    if (params.search?.trim()) queryParams.search = params.search.trim();

    return apiClient.get<ApiResponse<PageResponse<HealthRecord>>>(
      "/health/records",
      queryParams
    );
  },

  getHealthRecordById: (id: string): Promise<ApiResponse<HealthRecord>> => {
    return apiClient.get<ApiResponse<HealthRecord>>(`/health/records/${id}`);
  },

  createHealthRecord: (
    data: CreateHealthRecordInput
  ): Promise<ApiResponse<HealthRecord>> => {
    return apiClient.post<ApiResponse<HealthRecord>>("/health/records", data);
  },

  updateHealthRecord: (
    id: string,
    data: UpdateHealthRecordInput
  ): Promise<ApiResponse<HealthRecord>> => {
    return apiClient.put<ApiResponse<HealthRecord>>(`/health/records/${id}`, data);
  },

  deleteHealthRecord: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/health/records/${id}`);
  },

  // ==========================================
  // TREATMENTS
  // ==========================================
  listTreatments: (
    params: TreatmentFilterParams = {}
  ): Promise<ApiResponse<PageResponse<Treatment>>> => {
    const queryParams: Record<string, string | number | boolean | undefined> = {};
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.size !== undefined) queryParams.size = params.size;
    if (params.sort) queryParams.sort = params.sort;
    if (params.cowId) queryParams.cowId = params.cowId;
    if (params.cowTagNumber?.trim()) queryParams.cowTagNumber = params.cowTagNumber.trim();
    if (params.status) queryParams.status = params.status;
    if (params.treatmentType?.trim()) queryParams.treatmentType = params.treatmentType.trim();
    if (params.medication?.trim()) queryParams.medication = params.medication.trim();
    if (params.veterinarianId) queryParams.veterinarianId = params.veterinarianId;
    if (params.withdrawalActiveOnly !== undefined) queryParams.withdrawalActiveOnly = params.withdrawalActiveOnly;
    if (params.fromDate) queryParams.fromDate = params.fromDate;
    if (params.toDate) queryParams.toDate = params.toDate;
    if (params.search?.trim()) queryParams.search = params.search.trim();

    return apiClient.get<ApiResponse<PageResponse<Treatment>>>(
      "/health/treatments",
      queryParams
    );
  },

  getTreatmentById: (id: string): Promise<ApiResponse<Treatment>> => {
    return apiClient.get<ApiResponse<Treatment>>(`/health/treatments/${id}`);
  },

  createTreatment: (
    data: CreateTreatmentInput
  ): Promise<ApiResponse<Treatment>> => {
    return apiClient.post<ApiResponse<Treatment>>("/health/treatments", data);
  },

  updateTreatment: (
    id: string,
    data: UpdateTreatmentInput
  ): Promise<ApiResponse<Treatment>> => {
    return apiClient.put<ApiResponse<Treatment>>(`/health/treatments/${id}`, data);
  },

  completeTreatment: (
    id: string,
    data: CompleteTreatmentInput = {}
  ): Promise<ApiResponse<Treatment>> => {
    return apiClient.post<ApiResponse<Treatment>>(
      `/health/treatments/${id}/complete`,
      data
    );
  },

  // ==========================================
  // QUARANTINE
  // ==========================================
  listQuarantines: (
    params: QuarantineFilterParams = {}
  ): Promise<ApiResponse<PageResponse<QuarantineRecord>>> => {
    const queryParams: Record<string, string | number | undefined> = {};
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.size !== undefined) queryParams.size = params.size;
    if (params.sort) queryParams.sort = params.sort;
    if (params.cowId) queryParams.cowId = params.cowId;
    if (params.cowTagNumber?.trim()) queryParams.cowTagNumber = params.cowTagNumber.trim();
    if (params.status) queryParams.status = params.status;
    if (params.location?.trim()) queryParams.location = params.location.trim();
    if (params.search?.trim()) queryParams.search = params.search.trim();

    return apiClient.get<ApiResponse<PageResponse<QuarantineRecord>>>(
      "/health/quarantine",
      queryParams
    );
  },

  getQuarantineById: (id: string): Promise<ApiResponse<QuarantineRecord>> => {
    return apiClient.get<ApiResponse<QuarantineRecord>>(`/health/quarantine/${id}`);
  },

  createQuarantine: (
    data: CreateQuarantineInput
  ): Promise<ApiResponse<QuarantineRecord>> => {
    return apiClient.post<ApiResponse<QuarantineRecord>>("/health/quarantine", data);
  },

  updateQuarantine: (
    id: string,
    data: UpdateQuarantineInput
  ): Promise<ApiResponse<QuarantineRecord>> => {
    return apiClient.put<ApiResponse<QuarantineRecord>>(
      `/health/quarantine/${id}`,
      data
    );
  },

  releaseQuarantine: (
    id: string,
    data: ReleaseQuarantineInput = {}
  ): Promise<ApiResponse<QuarantineRecord>> => {
    return apiClient.post<ApiResponse<QuarantineRecord>>(
      `/health/quarantine/${id}/release`,
      data
    );
  },

  // ==========================================
  // WITHDRAWALS & SUMMARY
  // ==========================================
  getWithdrawals: (): Promise<ApiResponse<WithdrawalCase[]>> => {
    return apiClient.get<ApiResponse<WithdrawalCase[]>>("/health/withdrawals");
  },

  getSummary: (): Promise<ApiResponse<HealthSummary>> => {
    return apiClient.get<ApiResponse<HealthSummary>>("/health/summary");
  },

  // ==========================================
  // COW SPECIFIC HEALTH INTEGRATION
  // ==========================================
  getCowWithdrawalStatus: (
    cowId: string
  ): Promise<ApiResponse<CowWithdrawalStatus>> => {
    return apiClient.get<ApiResponse<CowWithdrawalStatus>>(
      `/cows/${cowId}/withdrawal-status`
    );
  },

  getCowHealthHistory: (
    cowId: string,
    page = 0,
    size = 20
  ): Promise<ApiResponse<PageResponse<HealthRecord>>> => {
    return apiClient.get<ApiResponse<PageResponse<HealthRecord>>>(
      `/cows/${cowId}/health`,
      { page, size }
    );
  },

  getCowTreatmentHistory: (
    cowId: string,
    page = 0,
    size = 20
  ): Promise<ApiResponse<PageResponse<Treatment>>> => {
    return apiClient.get<ApiResponse<PageResponse<Treatment>>>(
      `/cows/${cowId}/treatments`,
      { page, size }
    );
  },

  getCowQuarantineHistory: (
    cowId: string,
    page = 0,
    size = 20
  ): Promise<ApiResponse<PageResponse<QuarantineRecord>>> => {
    return apiClient.get<ApiResponse<PageResponse<QuarantineRecord>>>(
      `/cows/${cowId}/quarantine`,
      { page, size }
    );
  },
};
