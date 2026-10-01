export type CowStatus =
  | "ACTIVE"
  | "LACTATING"
  | "DRY"
  | "PREGNANT"
  | "SICK"
  | "SOLD"
  | "DECEASED";

export type CowGender = "FEMALE" | "MALE";

export interface Cow {
  id: string;
  tagNumber: string;
  name?: string;
  breed: string;
  dateOfBirth: string;
  gender: CowGender;
  status: CowStatus;
  motherId?: string;
  fatherId?: string;
  photoUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCowInput {
  tagNumber: string;
  name?: string;
  breed: string;
  dateOfBirth: string;
  gender: CowGender;
  status?: CowStatus;
  motherId?: string;
  fatherId?: string;
  notes?: string;
}

export interface UpdateCowInput {
  name?: string;
  breed?: string;
  status?: CowStatus;
  photoUrl?: string;
  notes?: string;
}
