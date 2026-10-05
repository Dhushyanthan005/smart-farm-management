import { apiClient } from "./client";
import { ApiResponse, PageResponse } from "@/types/api";
import {
  HeatRecord,
  CreateHeatRecordInput,
  UpdateHeatRecordInput,
  HeatFilterParams,
  BreedingRecord,
  CreateBreedingRecordInput,
  UpdateBreedingRecordInput,
  BreedingFilterParams,
  PregnancyRecord,
  CreatePregnancyRecordInput,
  ConfirmPregnancyInput,
  UpdatePregnancyRecordInput,
  PregnancyFilterParams,
  CalvingRecord,
  CreateCalvingRecordInput,
  UpdateCalvingRecordInput,
  CalvingFilterParams,
  BreedingSummary,
  CowReproductiveSummary,
} from "@/types/breeding";

export const breedingApi = {
  // ==========================================
  // SUMMARY / KPIS
  // ==========================================
  getSummary: (): Promise<ApiResponse<BreedingSummary>> => {
    return apiClient.get<ApiResponse<BreedingSummary>>("/breeding/summary");
  },

  // ==========================================
  // HEAT DETECTION
  // ==========================================
  listHeatRecords: (
    params: HeatFilterParams = {}
  ): Promise<ApiResponse<PageResponse<HeatRecord>>> => {
    const queryParams: Record<string, string | number | undefined> = {};
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.size !== undefined) queryParams.size = params.size;
    if (params.sort) queryParams.sort = params.sort;
    if (params.cowId) queryParams.cowId = params.cowId;
    if (params.cowTag?.trim()) queryParams.cowTag = params.cowTag.trim();
    if (params.detectionMethod) queryParams.detectionMethod = params.detectionMethod;
    if (params.confidence) queryParams.confidence = params.confidence;
    if (params.fromDate) queryParams.fromDate = params.fromDate;
    if (params.toDate) queryParams.toDate = params.toDate;
    if (params.search?.trim()) queryParams.search = params.search.trim();

    return apiClient.get<ApiResponse<PageResponse<HeatRecord>>>("/breeding/heat", queryParams);
  },

  getHeatRecordById: (id: string): Promise<ApiResponse<HeatRecord>> => {
    return apiClient.get<ApiResponse<HeatRecord>>(`/breeding/heat/${id}`);
  },

  createHeatRecord: (data: CreateHeatRecordInput): Promise<ApiResponse<HeatRecord>> => {
    return apiClient.post<ApiResponse<HeatRecord>>("/breeding/heat", data);
  },

  updateHeatRecord: (
    id: string,
    data: UpdateHeatRecordInput
  ): Promise<ApiResponse<HeatRecord>> => {
    return apiClient.put<ApiResponse<HeatRecord>>(`/breeding/heat/${id}`, data);
  },

  deleteHeatRecord: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/breeding/heat/${id}`);
  },

  // ==========================================
  // BREEDING RECORDS
  // ==========================================
  listBreedingRecords: (
    params: BreedingFilterParams = {}
  ): Promise<ApiResponse<PageResponse<BreedingRecord>>> => {
    const queryParams: Record<string, string | number | undefined> = {};
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.size !== undefined) queryParams.size = params.size;
    if (params.sort) queryParams.sort = params.sort;
    if (params.cowId) queryParams.cowId = params.cowId;
    if (params.cowTag?.trim()) queryParams.cowTag = params.cowTag.trim();
    if (params.breedingMethod) queryParams.breedingMethod = params.breedingMethod;
    if (params.status) queryParams.status = params.status;
    if (params.technicianId) queryParams.technicianId = params.technicianId;
    if (params.veterinarianId) queryParams.veterinarianId = params.veterinarianId;
    if (params.fromDate) queryParams.fromDate = params.fromDate;
    if (params.toDate) queryParams.toDate = params.toDate;
    if (params.search?.trim()) queryParams.search = params.search.trim();

    return apiClient.get<ApiResponse<PageResponse<BreedingRecord>>>("/breeding/records", queryParams);
  },

  getBreedingRecordById: (id: string): Promise<ApiResponse<BreedingRecord>> => {
    return apiClient.get<ApiResponse<BreedingRecord>>(`/breeding/records/${id}`);
  },

  createBreedingRecord: (data: CreateBreedingRecordInput): Promise<ApiResponse<BreedingRecord>> => {
    return apiClient.post<ApiResponse<BreedingRecord>>("/breeding/records", data);
  },

  updateBreedingRecord: (
    id: string,
    data: UpdateBreedingRecordInput
  ): Promise<ApiResponse<BreedingRecord>> => {
    return apiClient.put<ApiResponse<BreedingRecord>>(`/breeding/records/${id}`, data);
  },

  completeBreedingRecord: (id: string): Promise<ApiResponse<BreedingRecord>> => {
    return apiClient.post<ApiResponse<BreedingRecord>>(`/breeding/records/${id}/complete`);
  },

  cancelBreedingRecord: (id: string): Promise<ApiResponse<BreedingRecord>> => {
    return apiClient.post<ApiResponse<BreedingRecord>>(`/breeding/records/${id}/cancel`);
  },

  // ==========================================
  // PREGNANCY RECORDS
  // ==========================================
  listPregnancies: (
    params: PregnancyFilterParams = {}
  ): Promise<ApiResponse<PageResponse<PregnancyRecord>>> => {
    const queryParams: Record<string, string | number | boolean | undefined> = {};
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.size !== undefined) queryParams.size = params.size;
    if (params.sort) queryParams.sort = params.sort;
    if (params.cowId) queryParams.cowId = params.cowId;
    if (params.cowTag?.trim()) queryParams.cowTag = params.cowTag.trim();
    if (params.pregnancyStatus) queryParams.pregnancyStatus = params.pregnancyStatus;
    if (params.fromExpectedDate) queryParams.fromExpectedDate = params.fromExpectedDate;
    if (params.toExpectedDate) queryParams.toExpectedDate = params.toExpectedDate;
    if (params.fromConfirmationDate) queryParams.fromConfirmationDate = params.fromConfirmationDate;
    if (params.toConfirmationDate) queryParams.toConfirmationDate = params.toConfirmationDate;
    if (params.overdueOnly !== undefined) queryParams.overdueOnly = params.overdueOnly;
    if (params.search?.trim()) queryParams.search = params.search.trim();

    return apiClient.get<ApiResponse<PageResponse<PregnancyRecord>>>("/breeding/pregnancies", queryParams);
  },

  getPregnancyRecordById: (id: string): Promise<ApiResponse<PregnancyRecord>> => {
    return apiClient.get<ApiResponse<PregnancyRecord>>(`/breeding/pregnancies/${id}`);
  },

  createPregnancyRecord: (data: CreatePregnancyRecordInput): Promise<ApiResponse<PregnancyRecord>> => {
    return apiClient.post<ApiResponse<PregnancyRecord>>("/breeding/pregnancies", data);
  },

  updatePregnancyRecord: (
    id: string,
    data: UpdatePregnancyRecordInput
  ): Promise<ApiResponse<PregnancyRecord>> => {
    return apiClient.put<ApiResponse<PregnancyRecord>>(`/breeding/pregnancies/${id}`, data);
  },

  confirmPregnancy: (
    id: string,
    data: ConfirmPregnancyInput
  ): Promise<ApiResponse<PregnancyRecord>> => {
    return apiClient.post<ApiResponse<PregnancyRecord>>(`/breeding/pregnancies/${id}/confirm`, data);
  },

  markNotPregnant: (id: string): Promise<ApiResponse<PregnancyRecord>> => {
    return apiClient.post<ApiResponse<PregnancyRecord>>(`/breeding/pregnancies/${id}/mark-not-pregnant`);
  },

  markPregnancyLost: (id: string): Promise<ApiResponse<PregnancyRecord>> => {
    return apiClient.post<ApiResponse<PregnancyRecord>>(`/breeding/pregnancies/${id}/mark-lost`);
  },

  // ==========================================
  // CALVING RECORDS
  // ==========================================
  listCalvings: (
    params: CalvingFilterParams = {}
  ): Promise<ApiResponse<PageResponse<CalvingRecord>>> => {
    const queryParams: Record<string, string | number | boolean | undefined> = {};
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.size !== undefined) queryParams.size = params.size;
    if (params.sort) queryParams.sort = params.sort;
    if (params.cowId) queryParams.cowId = params.cowId;
    if (params.cowTag?.trim()) queryParams.cowTag = params.cowTag.trim();
    if (params.calvingType) queryParams.calvingType = params.calvingType;
    if (params.complicationsOnly !== undefined) queryParams.complicationsOnly = params.complicationsOnly;
    if (params.fromDate) queryParams.fromDate = params.fromDate;
    if (params.toDate) queryParams.toDate = params.toDate;
    if (params.search?.trim()) queryParams.search = params.search.trim();

    return apiClient.get<ApiResponse<PageResponse<CalvingRecord>>>("/breeding/calvings", queryParams);
  },

  getCalvingRecordById: (id: string): Promise<ApiResponse<CalvingRecord>> => {
    return apiClient.get<ApiResponse<CalvingRecord>>(`/breeding/calvings/${id}`);
  },

  createCalvingRecord: (data: CreateCalvingRecordInput): Promise<ApiResponse<CalvingRecord>> => {
    return apiClient.post<ApiResponse<CalvingRecord>>("/breeding/calvings", data);
  },

  updateCalvingRecord: (
    id: string,
    data: UpdateCalvingRecordInput
  ): Promise<ApiResponse<CalvingRecord>> => {
    return apiClient.put<ApiResponse<CalvingRecord>>(`/breeding/calvings/${id}`, data);
  },

  // ==========================================
  // COW-SPECIFIC REPRODUCTIVE PROFILE & HISTORY
  // ==========================================
  getCowBreedingSummary: (cowId: string): Promise<ApiResponse<CowReproductiveSummary>> => {
    return apiClient.get<ApiResponse<CowReproductiveSummary>>(`/cows/${cowId}/breeding`);
  },

  getCowHeatHistory: (
    cowId: string,
    page = 0,
    size = 20
  ): Promise<ApiResponse<PageResponse<HeatRecord>>> => {
    return apiClient.get<ApiResponse<PageResponse<HeatRecord>>>(`/cows/${cowId}/heat-history`, {
      page,
      size,
    });
  },

  getCowPregnancyHistory: (
    cowId: string,
    page = 0,
    size = 20
  ): Promise<ApiResponse<PageResponse<PregnancyRecord>>> => {
    return apiClient.get<ApiResponse<PageResponse<PregnancyRecord>>>(`/cows/${cowId}/pregnancy-history`, {
      page,
      size,
    });
  },

  getCowCalvingHistory: (
    cowId: string,
    page = 0,
    size = 20
  ): Promise<ApiResponse<PageResponse<CalvingRecord>>> => {
    return apiClient.get<ApiResponse<PageResponse<CalvingRecord>>>(`/cows/${cowId}/calving-history`, {
      page,
      size,
    });
  },
};
