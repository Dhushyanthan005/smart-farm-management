import { Cow } from "@/types/cow";

export type LactationStage = "Early" | "Peak" | "Mid" | "Late" | "Dry";

export type CowHealthStatus = "Healthy" | "Observation" | "Quarantined" | "Withdrawal";

export interface StitchCow {
  id: string;
  tagNumber: string;
  name: string;
  rfid: string;
  breed: string;
  age: string;
  parity: number;
  dim: number | null; // Days in Milk, null for Dry
  dimStage: string;
  lactationStage: LactationStage;
  todayYield: number | null;
  yieldDiff: string | null;
  sevenDayAvg: number | null;
  sccValue: string;
  sccStatus: "normal" | "warning" | "danger" | "resolving";
  reproStatus: string;
  reproVariant: "success" | "warning" | "info" | "neutral" | "danger";
  currentPen: string;
  healthStatus: CowHealthStatus;
  statusDot: "green" | "amber" | "red" | "gray";
  isWithheld?: boolean;
  estrusAlert?: boolean;
  rawCow?: Cow;
}
