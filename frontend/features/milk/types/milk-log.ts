export type MilkStatus = "bulk" | "waste" | "colostrum";

export interface MilkSessionEntry {
  unitNumber: string;
  cowTag: string;
  cowName: string;
  pen: string;
  badge?: string;
  amYield: number;
  status: MilkStatus;
  conductivity: number;
  duration: string;
  sccFlag: "optimal" | "normal" | "marginal" | "danger" | "colostrum";
  notes: string;
  cowId?: string;
  recordId?: string;
}

export interface SiloTank {
  id: string;
  name: string;
  capacity: number;
  currentVolume: number;
  temperature: number;
  status: "Full" | "Empty" | "Receiving";
  subStatus?: string;
}

export interface TankerDispatch {
  route: string;
  pickupTime: string;
  cooperative: string;
  driver: string;
  tankerNumber: string;
  butterfat: number;
  protein: number;
  freezePoint: string;
  scc: string;
  spc: string;
  betaLactam: string;
  assignedTank: string;
  assignedVolume: number;
}
