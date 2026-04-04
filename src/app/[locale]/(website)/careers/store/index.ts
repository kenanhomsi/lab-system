import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type CareersUiState } from "./state";
import { initialApiState, type CareersApiSliceState } from "./api";
import { initialUtilsState, type CareersUtilsState } from "./utils";

export type CareersStoreState = CareersUiState &
  CareersApiSliceState &
  CareersUtilsState;

export function createInitialCareersState(): CareersStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createCareersStore() {
  return createStoreApi<CareersStoreState>(createInitialCareersState());
}
