import { Cow } from "@/types/cow";
import { CowHealthStatus, LactationStage, StitchCow } from "../types/stitch-cow";

export function formatBreedName(breed: string): string {
  switch (breed) {
    case "HOLSTEIN_FRIESIAN":
    case "HOLSTEIN":
      return "Holstein Friesian";
    case "JERSEY":
      return "Jersey Purebred";
    case "GUERNSEY":
      return "Guernsey";
    case "AYRSHIRE":
      return "Ayrshire";
    case "BROWN_SWISS":
      return "Brown Swiss";
    case "SIMMENTAL":
      return "Simmental";
    default:
      return breed || "Dairy Cross";
  }
}

export function cowToStitchCow(cow: Cow): StitchCow {
  // Map Health Status & Status Dot
  let healthStatus: CowHealthStatus = "Healthy";
  let statusDot: "green" | "amber" | "red" | "gray" = "green";

  switch (cow.healthStatus) {
    case "HEALTHY":
      healthStatus = "Healthy";
      statusDot = "green";
      break;
    case "UNDER_TREATMENT":
    case "RECOVERING":
      healthStatus = "Observation";
      statusDot = "amber";
      break;
    case "QUARANTINED":
      healthStatus = "Quarantined";
      statusDot = "red";
      break;
    case "PREGNANT":
      healthStatus = "Healthy";
      statusDot = "green";
      break;
    default:
      healthStatus = "Healthy";
      statusDot = cow.lifecycleStatus === "ACTIVE" ? "green" : "gray";
  }

  // Map Lactation Stage
  let lactationStage: LactationStage = "Mid";
  const stageLower = (cow.currentMilkStatus || "").toLowerCase();
  if (stageLower.includes("dry") || cow.healthStatus === "PREGNANT") {
    lactationStage = "Dry";
  } else if (stageLower.includes("early")) {
    lactationStage = "Early";
  } else if (stageLower.includes("peak")) {
    lactationStage = "Peak";
  } else if (stageLower.includes("late")) {
    lactationStage = "Late";
  } else {
    lactationStage = cow.parity > 0 ? "Mid" : "Dry";
  }

  // Location display
  let currentPen = "Unassigned Pen";
  if (cow.barn && cow.pen) {
    currentPen = `${cow.barn} • ${cow.pen}`;
  } else if (cow.barn) {
    currentPen = cow.barn;
  } else if (cow.pen) {
    currentPen = cow.pen;
  }

  // Repro status
  let reproStatus = "Open (Check Heat)";
  let reproVariant: "success" | "warning" | "info" | "neutral" | "danger" = "neutral";
  if (cow.healthStatus === "PREGNANT") {
    reproStatus = "Confirmed Preg";
    reproVariant = "success";
  } else if (cow.healthStatus === "QUARANTINED") {
    reproStatus = "Isolated - Medical";
    reproVariant = "danger";
  } else if (cow.healthStatus === "UNDER_TREATMENT") {
    reproStatus = "Under Treatment";
    reproVariant = "warning";
  } else if (cow.lifecycleStatus !== "ACTIVE") {
    reproStatus = cow.lifecycleStatus;
    reproVariant = "neutral";
  } else {
    reproStatus = "In Production";
    reproVariant = "info";
  }

  const tagDisplay = cow.tagNumber.startsWith("#") ? cow.tagNumber : `#${cow.tagNumber}`;

  return {
    id: cow.id,
    tagNumber: tagDisplay,
    name: cow.name || `Cow ${cow.tagNumber}`,
    rfid: cow.rfid || "RFID Unassigned",
    breed: formatBreedName(cow.breed),
    age: cow.age || "Unknown",
    parity: cow.parity ?? 0,
    dim: lactationStage === "Dry" ? null : 120,
    dimStage: `${lactationStage} Lactation`,
    lactationStage,
    todayYield: cow.expectedMilkCapacity ?? null,
    yieldDiff: cow.expectedMilkCapacity ? "±0.0 L" : null,
    sevenDayAvg: cow.expectedMilkCapacity ?? null,
    sccValue: cow.healthStatus === "QUARANTINED" ? "Flagged" : "Normal",
    sccStatus: cow.healthStatus === "QUARANTINED" ? "danger" : "normal",
    reproStatus,
    reproVariant,
    currentPen,
    healthStatus,
    statusDot,
    isWithheld: cow.healthStatus === "QUARANTINED",
    rawCow: cow,
  };
}
