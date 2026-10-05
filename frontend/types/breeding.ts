export type HeatDetectionMethod = "MANUAL" | "OBSERVATION" | "DEVICE" | "OTHER";
export type HeatConfidence = "LOW" | "MEDIUM" | "HIGH";
export type BreedingMethod = "NATURAL" | "ARTIFICIAL_INSEMINATION";
export type BreedingStatus = "PLANNED" | "COMPLETED" | "CANCELLED";
export type PregnancyStatus = "PENDING" | "CONFIRMED" | "NOT_PREGNANT" | "LOST" | "COMPLETED";
export type PregnancyConfirmationMethod = "VETERINARY_EXAM" | "ULTRASOUND" | "MANUAL_EXAMINATION" | "OTHER";
export type CalvingType = "NORMAL" | "ASSISTED" | "CESAREAN" | "OTHER";
export type ReproductiveStatus = "OPEN" | "IN_HEAT" | "BREEDING" | "PREGNANT" | "NEAR_CALVING" | "RECENTLY_CALVED";

// --- Heat Records ---
export interface HeatRecord {
  id: string;
  cowId: string;
  cowTagNumber: string;
  cowName?: string | null;
  detectedAt: string;
  detectionMethod: HeatDetectionMethod;
  signsObserved: string;
  confidence: HeatConfidence;
  notes?: string | null;
  detectedById?: string | null;
  detectedByName?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
}

export interface CreateHeatRecordInput {
  cowId?: string;
  cowTagNumber?: string;
  detectedAt: string;
  detectionMethod: HeatDetectionMethod;
  signsObserved: string;
  confidence?: HeatConfidence;
  notes?: string;
  detectedById?: string;
  detectedByName?: string;
}

export interface UpdateHeatRecordInput {
  detectedAt?: string;
  detectionMethod?: HeatDetectionMethod;
  signsObserved?: string;
  confidence?: HeatConfidence;
  notes?: string;
  detectedById?: string;
  detectedByName?: string;
}

export interface HeatFilterParams {
  page?: number;
  size?: number;
  sort?: string;
  cowId?: string;
  cowTag?: string;
  detectionMethod?: HeatDetectionMethod;
  confidence?: HeatConfidence;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

// --- Breeding Records ---
export interface BreedingRecord {
  id: string;
  cowId: string;
  cowTagNumber: string;
  cowName?: string | null;
  heatRecordId?: string | null;
  breedingDate: string;
  breedingMethod: BreedingMethod;
  bullId?: string | null;
  bullTagNumber?: string | null;
  bullName?: string | null;
  semenReference?: string | null;
  technicianId?: string | null;
  technicianName?: string | null;
  veterinarianId?: string | null;
  veterinarianName?: string | null;
  notes?: string | null;
  status: BreedingStatus;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
}

export interface CreateBreedingRecordInput {
  cowId?: string;
  cowTagNumber?: string;
  breedingDate: string;
  breedingMethod: BreedingMethod;
  bullId?: string;
  bullTagNumber?: string;
  semenReference?: string;
  technicianId?: string;
  technicianName?: string;
  veterinarianId?: string;
  veterinarianName?: string;
  heatRecordId?: string;
  notes?: string;
  status?: BreedingStatus;
}

export interface UpdateBreedingRecordInput {
  breedingDate?: string;
  breedingMethod?: BreedingMethod;
  bullId?: string;
  bullTagNumber?: string;
  semenReference?: string;
  technicianId?: string;
  technicianName?: string;
  veterinarianId?: string;
  veterinarianName?: string;
  heatRecordId?: string;
  notes?: string;
  status?: BreedingStatus;
}

export interface BreedingFilterParams {
  page?: number;
  size?: number;
  sort?: string;
  cowId?: string;
  cowTag?: string;
  breedingMethod?: BreedingMethod;
  status?: BreedingStatus;
  technicianId?: string;
  veterinarianId?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

// --- Pregnancy Records ---
export interface PregnancyRecord {
  id: string;
  cowId: string;
  cowTagNumber: string;
  cowName?: string | null;
  breedingId?: string | null;
  breedingDate?: string | null;
  breedingMethod?: BreedingMethod | null;
  confirmationDate?: string | null;
  confirmationMethod?: PregnancyConfirmationMethod | null;
  expectedCalvingDate?: string | null;
  pregnancyStatus: PregnancyStatus;
  confirmedById?: string | null;
  confirmedByName?: string | null;
  notes?: string | null;
  daysRemaining?: number | null;
  isOverdue?: boolean;
  gestationDays?: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
}

export interface CreatePregnancyRecordInput {
  cowId?: string;
  cowTagNumber?: string;
  breedingId?: string;
  confirmationDate?: string;
  confirmationMethod?: PregnancyConfirmationMethod;
  expectedCalvingDate?: string;
  pregnancyStatus?: PregnancyStatus;
  confirmedById?: string;
  confirmedByName?: string;
  notes?: string;
}

export interface ConfirmPregnancyInput {
  confirmationDate: string;
  confirmationMethod: PregnancyConfirmationMethod;
  expectedCalvingDate?: string;
  confirmedById?: string;
  confirmedByName?: string;
  notes?: string;
}

export interface UpdatePregnancyRecordInput {
  confirmationDate?: string;
  confirmationMethod?: PregnancyConfirmationMethod;
  expectedCalvingDate?: string;
  pregnancyStatus?: PregnancyStatus;
  confirmedById?: string;
  confirmedByName?: string;
  notes?: string;
}

export interface PregnancyFilterParams {
  page?: number;
  size?: number;
  sort?: string;
  cowId?: string;
  cowTag?: string;
  pregnancyStatus?: PregnancyStatus;
  fromExpectedDate?: string;
  toExpectedDate?: string;
  fromConfirmationDate?: string;
  toConfirmationDate?: string;
  overdueOnly?: boolean;
  search?: string;
}

// --- Calving Records ---
export interface CalvingRecord {
  id: string;
  cowId: string;
  cowTagNumber: string;
  cowName?: string | null;
  pregnancyId?: string | null;
  calvingDate: string;
  calvingType: CalvingType;
  calfCount: number;
  calfDetails?: string | null;
  complications?: string | null;
  assistanceRequired: boolean;
  veterinarianId?: string | null;
  veterinarianName?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
}

export interface CreateCalvingRecordInput {
  cowId?: string;
  cowTagNumber?: string;
  pregnancyId?: string;
  calvingDate: string;
  calvingType?: CalvingType;
  calfCount: number;
  calfDetails?: string;
  complications?: string;
  assistanceRequired?: boolean;
  veterinarianId?: string;
  veterinarianName?: string;
  notes?: string;
}

export interface UpdateCalvingRecordInput {
  calvingDate?: string;
  calvingType?: CalvingType;
  calfCount?: number;
  calfDetails?: string;
  complications?: string;
  assistanceRequired?: boolean;
  veterinarianId?: string;
  veterinarianName?: string;
  notes?: string;
}

export interface CalvingFilterParams {
  page?: number;
  size?: number;
  sort?: string;
  cowId?: string;
  cowTag?: string;
  calvingType?: CalvingType;
  complicationsOnly?: boolean;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

// --- Summary & Timeline ---
export interface BreedingSummary {
  cowsInHeat: number;
  breedingDue: number;
  pregnantCows: number;
  upcomingCalvings: number;
  overduePregnancies: number;
  recentCalvings: number;
  openCows: number;
  conceptionRate: number;
}

export interface ReproductiveTimelineEvent {
  id: string;
  eventType: string;
  eventDate: string;
  title: string;
  description: string;
  status: string;
  performedBy?: string | null;
  notes?: string | null;
}

export interface CowReproductiveSummary {
  cowId: string;
  cowTagNumber: string;
  cowName?: string | null;
  reproductiveStatus: ReproductiveStatus;
  parity: number;
  latestHeat?: HeatRecord | null;
  latestBreeding?: BreedingRecord | null;
  activePregnancy?: PregnancyRecord | null;
  latestCalving?: CalvingRecord | null;
  timeline: ReproductiveTimelineEvent[];
}
