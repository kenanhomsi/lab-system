import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type ComplaintUiState } from "./state";
import { initialApiState, type ComplaintApiSliceState } from "./api";
import { initialUtilsState, type ComplaintUtilsState } from "./utils";

export type ComplaintStoreState = ComplaintUiState &
  ComplaintApiSliceState &
  ComplaintUtilsState;

export function createInitialComplaintState(): ComplaintStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createComplaintStore() {
  return createStoreApi<ComplaintStoreState>(createInitialComplaintState());
}
