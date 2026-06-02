import type { ContractDuration, ContractType } from "@/types/contract-service-request";

export const CONTRACT_TYPES = ["Individual", "Organization"] as const satisfies readonly ContractType[];

export const CONTRACT_DURATIONS = [
  "ThreeMonths",
  "SixMonths",
  "OneYear",
] as const satisfies readonly ContractDuration[];
