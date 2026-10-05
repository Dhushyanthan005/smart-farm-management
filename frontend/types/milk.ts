export type MilkShift = "MORNING" | "EVENING";

export type MilkRecordStatus =
  | "BULK"
  | "APPROVED"
  | "WASTE"
  | "COLOSTRUM"
  | "WITHHELD"
  | "DISCARDED";

export interface MilkRecord {
  id: string;
  cowId: string;
  cowTagNumber: string;
  cowName?: string | null;
  productionDate: string;
  shift: MilkShift;
  quantityLiters: number;
  status: MilkRecordStatus;
  fatPercentage?: number | null;
  proteinPercentage?: number | null;
  somaticCellCount?: number | null;
  conductivity?: number | null;
  milkingStation?: string | null;
  operatorId?: string | null;
  operatorName?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DailyMilkSummary {
  date: string;
  morningLiters: number;
  eveningLiters: number;
  totalLiters: number;
  bulkLiters: number;
  withheldLiters: number;
  cowsMilked: number;
  averageYield: number;
}

export interface ShiftMilkSummary {
  date: string;
  shift: MilkShift;
  totalYield: number;
  bulkYield: number;
  withheldYield: number;
  cowsMilked: number;
  averageYield: number;
  highestYield: number;
  lowestYield: number;
}

export interface CreateMilkRecordInput {
  cowId?: string;
  cowTagNumber?: string;
  productionDate: string;
  shift: MilkShift;
  quantityLiters: number;
  status?: MilkRecordStatus;
  fatPercentage?: number | null;
  proteinPercentage?: number | null;
  somaticCellCount?: number | null;
  conductivity?: number | null;
  notes?: string | null;
}

export interface BatchMilkEntryItem {
  cowId?: string;
  cowTagNumber?: string;
  quantityLiters: number;
  status?: MilkRecordStatus;
  fatPercentage?: number | null;
  proteinPercentage?: number | null;
  somaticCellCount?: number | null;
  conductivity?: number | null;
  notes?: string | null;
}

export interface BatchMilkRecordInput {
  productionDate: string;
  shift: MilkShift;
  records: BatchMilkEntryItem[];
}

export interface UpdateMilkRecordInput {
  quantityLiters?: number;
  status?: MilkRecordStatus;
  fatPercentage?: number | null;
  proteinPercentage?: number | null;
  somaticCellCount?: number | null;
  conductivity?: number | null;
  notes?: string | null;
}

export interface MilkFilterParams {
  page?: number;
  size?: number;
  sort?: string;
  date?: string;
  fromDate?: string;
  toDate?: string;
  shift?: MilkShift;
  status?: MilkRecordStatus;
  cowId?: string;
  cowTagNumber?: string;
  search?: string;
}
