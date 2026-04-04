import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type InsuranceRequestUiState } from "./state";
import { initialApiState, type InsuranceRequestApiSliceState } from "./api";
import { initialUtilsState, type InsuranceRequestUtilsState } from "./utils";

export type InsuranceRequestStoreState = InsuranceRequestUiState &
  InsuranceRequestApiSliceState &
  InsuranceRequestUtilsState;

export function createInitialInsuranceRequestState(): InsuranceRequestStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createInsuranceRequestStore() {
  return createStoreApi<InsuranceRequestStoreState>(createInitialInsuranceRequestState());
}
