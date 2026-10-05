export type CowHealthStatus =
  | "HEALTHY"
  | "OBSERVATION"
  | "UNDER_TREATMENT"
  | "RECOVERING"
  | "QUARANTINED"
  | "CRITICAL";

export type TreatmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export type QuarantineStatus = "ACTIVE" | "RELEASED";

export interface HealthRecord {
  id: string;
  cowId: string;
  cowTagNumber: string;
  cowName?: string | null;
  recordDate: string;
  healthStatus: CowHealthStatus;
  diagnosis?: string | null;
  symptoms?: string | null;
  temperature?: number | null;
  weight?: number | null;
  veterinarianId?: string | null;
  veterinarianName?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Treatment {
  id: string;
  cowId: string;
  cowTagNumber: string;
  cowName?: string | null;
  healthRecordId?: string | null;
  treatmentDate: string;
  diagnosis: string;
  treatmentType: string;
  medication: string;
  dosage: string;
  frequency?: string | null;
  route?: string | null;
  startDate: string;
  endDate: string;
  withdrawalDays: number;
  withdrawalEndDate?: string | null;
  withdrawalActive: boolean;
  withdrawalDaysRemaining: number;
  veterinarianId?: string | null;
  veterinarianName?: string | null;
  instructions?: string | null;
  notes?: string | null;
  status: TreatmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface QuarantineRecord {
  id: string;
  cowId: string;
  cowTagNumber: string;
  cowName?: string | null;
  startDate: string;
  expectedReleaseDate?: string | null;
  actualReleaseDate?: string | null;
  reason: string;
  location: string;
  status: QuarantineStatus;
  veterinarianId?: string | null;
  veterinarianName?: string | null;
  notes?: string | null;
  daysInIsolation: number;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalCase {
  cowId: string;
  cowTagNumber: string;
  cowName?: string | null;
  treatmentId: string;
  medication: string;
  treatmentEndDate: string;
  withdrawalDays: number;
  withdrawalEndDate: string;
  hoursRemaining: number;
  daysRemaining: number;
  milkEligible: boolean;
  veterinarianName?: string | null;
}

export interface CowWithdrawalStatus {
  cowId: string;
  cowTagNumber: string;
  milkEligible: boolean;
  activeWithdrawalsCount: number;
  earliestClearanceDate?: string | null;
  activeMedications: string[];
}

export interface HealthSummary {
  totalCows: number;
  healthyCount: number;
  observationCount: number;
  underTreatmentCount: number;
  recoveringCount: number;
  quarantinedCount: number;
  criticalCount: number;
  activeTreatmentsCount: number;
  activeWithdrawalsCount: number;
  occupiedBaysCount: number;
  pendingReviewsCount: number;
  activeTreatments?: number;
  activeWithdrawals?: number;
  herdHealthScore?: number;
}

export interface CreateHealthRecordInput {
  cowId?: string;
  cowTagNumber?: string;
  recordDate: string;
  healthStatus: CowHealthStatus;
  diagnosis?: string;
  symptoms?: string;
  temperature?: number;
  weight?: number;
  veterinarianId?: string;
  veterinarianName?: string;
  notes?: string;
}

export interface UpdateHealthRecordInput {
  recordDate?: string;
  healthStatus?: CowHealthStatus;
  diagnosis?: string;
  symptoms?: string;
  temperature?: number;
  weight?: number;
  veterinarianId?: string;
  veterinarianName?: string;
  notes?: string;
}

export interface CreateTreatmentInput {
  cowId?: string;
  cowTagNumber?: string;
  healthRecordId?: string;
  treatmentDate?: string;
  diagnosis: string;
  treatmentType: string;
  medication: string;
  dosage: string;
  frequency?: string;
  route?: string;
  startDate: string;
  endDate: string;
  withdrawalDays?: number;
  veterinarianId?: string;
  veterinarianName?: string;
  instructions?: string;
  notes?: string;
}

export interface UpdateTreatmentInput {
  diagnosis?: string;
  treatmentType?: string;
  medication?: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  startDate?: string;
  endDate?: string;
  withdrawalDays?: number;
  veterinarianId?: string;
  veterinarianName?: string;
  instructions?: string;
  notes?: string;
  status?: TreatmentStatus;
}

export interface CompleteTreatmentInput {
  completionDate?: string;
  notes?: string;
}

export interface CreateQuarantineInput {
  cowId?: string;
  cowTagNumber?: string;
  startDate: string;
  expectedReleaseDate?: string;
  reason: string;
  location: string;
  veterinarianId?: string;
  veterinarianName?: string;
  notes?: string;
}

export interface UpdateQuarantineInput {
  expectedReleaseDate?: string;
  reason?: string;
  location?: string;
  veterinarianId?: string;
  veterinarianName?: string;
  notes?: string;
}

export interface ReleaseQuarantineInput {
  actualReleaseDate?: string;
  nextHealthStatus?: CowHealthStatus;
  notes?: string;
}

export interface HealthFilterParams {
  cowId?: string;
  cowTagNumber?: string;
  healthStatus?: CowHealthStatus;
  fromDate?: string;
  toDate?: string;
  diagnosis?: string;
  veterinarianId?: string;
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface TreatmentFilterParams {
  cowId?: string;
  cowTagNumber?: string;
  status?: TreatmentStatus;
  treatmentType?: string;
  medication?: string;
  veterinarianId?: string;
  withdrawalActiveOnly?: boolean;
  fromDate?: string;
  toDate?: string;
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface QuarantineFilterParams {
  cowId?: string;
  cowTagNumber?: string;
  status?: QuarantineStatus;
  location?: string;
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
}
