import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type PatientListUiState } from "./state";
import { initialApiState, type PatientListApiSliceState } from "./api";
import { initialUtilsState, type PatientListUtilsState } from "./utils";

export type PatientListStoreState = PatientListUiState &
  PatientListApiSliceState &
  PatientListUtilsState;

export function createInitialPatientListState(): PatientListStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createPatientListStore() {
  return createStoreApi<PatientListStoreState>(createInitialPatientListState());
}
