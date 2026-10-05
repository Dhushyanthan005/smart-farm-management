export type Breed =
  | "HOLSTEIN_FRIESIAN"
  | "HOLSTEIN"
  | "JERSEY"
  | "GUERNSEY"
  | "AYRSHIRE"
  | "BROWN_SWISS"
  | "SIMMENTAL"
  | "OTHER";

export type CowGender = "FEMALE" | "MALE";

export type HealthStatus =
  | "HEALTHY"
  | "UNDER_TREATMENT"
  | "PREGNANT"
  | "QUARANTINED"
  | "RECOVERING";

export type LifecycleStatus =
  | "ACTIVE"
  | "SOLD"
  | "DECEASED"
  | "TRANSFERRED";

export type CowSource = "BORN" | "PURCHASED" | "BOUGHT";

export interface Cow {
  id: string;
  tagNumber: string;
  rfid?: string | null;
  name?: string | null;
  breed: Breed;
  gender: CowGender;
  dateOfBirth: string;
  age?: string;
  ageInYears?: number | null;
  parity: number;
  healthStatus: HealthStatus;
  lifecycleStatus: LifecycleStatus;
  status?: string;
  source: CowSource;
  barn?: string | null;
  pen?: string | null;
  expectedMilkCapacity?: number | null;
  currentMilkStatus?: string | null;
  motherId?: string | null;
  fatherId?: string | null;
  acquisitionDate?: string | null;
  acquisitionPlace?: string | null;
  photoUrl?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface CowStats {
  totalHead: number;
  inMilk: number;
  dry: number;
  heifers: number;
  quarantine: number;
}

export interface CreateCowInput {
  tagNumber: string;
  rfid?: string | null;
  name?: string | null;
  breed: Breed;
  gender: CowGender;
  dateOfBirth: string;
  parity?: number;
  healthStatus?: HealthStatus;
  lifecycleStatus?: LifecycleStatus;
  source?: CowSource;
  barn?: string | null;
  pen?: string | null;
  expectedMilkCapacity?: number | null;
  currentMilkStatus?: string | null;
  motherId?: string | null;
  fatherId?: string | null;
  acquisitionDate?: string | null;
  acquisitionPlace?: string | null;
  photoUrl?: string | null;
  notes?: string | null;
}

export interface UpdateCowInput {
  rfid?: string | null;
  name?: string | null;
  breed?: Breed;
  gender?: CowGender;
  dateOfBirth?: string;
  parity?: number;
  healthStatus?: HealthStatus;
  lifecycleStatus?: LifecycleStatus;
  source?: CowSource;
  barn?: string | null;
  pen?: string | null;
  expectedMilkCapacity?: number | null;
  currentMilkStatus?: string | null;
  motherId?: string | null;
  fatherId?: string | null;
  acquisitionDate?: string | null;
  acquisitionPlace?: string | null;
  photoUrl?: string | null;
  notes?: string | null;
}

export interface CowFilterParams {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
  healthStatus?: HealthStatus;
  lifecycleStatus?: LifecycleStatus;
  breed?: Breed;
  gender?: CowGender;
  barn?: string;
  pen?: string;
  parity?: number;
  minParity?: number;
  stage?: string;
}
