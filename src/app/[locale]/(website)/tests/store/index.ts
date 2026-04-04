import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type TestsUiState } from "./state";
import { initialApiState, type TestsApiSliceState } from "./api";
import { initialUtilsState, type TestsUtilsState } from "./utils";

export type TestsStoreState = TestsUiState & TestsApiSliceState & TestsUtilsState;

export function createInitialTestsState(): TestsStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createTestsStore() {
  return createStoreApi<TestsStoreState>(createInitialTestsState());
}
