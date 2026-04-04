import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type MyResultsUiState } from "./state";
import { initialApiState, type MyResultsApiSliceState } from "./api";
import { initialUtilsState, type MyResultsUtilsState } from "./utils";

export type MyResultsStoreState = MyResultsUiState &
  MyResultsApiSliceState &
  MyResultsUtilsState;

export function createInitialMyResultsState(): MyResultsStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createMyResultsStore() {
  return createStoreApi<MyResultsStoreState>(createInitialMyResultsState());
}
