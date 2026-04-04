import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type DailyTasksUiState } from "./state";
import { initialApiState, type DailyTasksApiSliceState } from "./api";
import { initialUtilsState, type DailyTasksUtilsState } from "./utils";

export type DailyTasksStoreState = DailyTasksUiState &
  DailyTasksApiSliceState &
  DailyTasksUtilsState;

export function createInitialDailyTasksState(): DailyTasksStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createDailyTasksStore() {
  return createStoreApi<DailyTasksStoreState>(createInitialDailyTasksState());
}
