import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type RequestTestsUiState } from "./state";
import { initialApiState, type RequestTestsApiSliceState } from "./api";
import { initialUtilsState, type RequestTestsUtilsState } from "./utils";

export type RequestTestsStoreState = RequestTestsUiState &
  RequestTestsApiSliceState &
  RequestTestsUtilsState;

export function createInitialRequestTestsState(): RequestTestsStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createRequestTestsStore() {
  return createStoreApi<RequestTestsStoreState>(createInitialRequestTestsState());
}
