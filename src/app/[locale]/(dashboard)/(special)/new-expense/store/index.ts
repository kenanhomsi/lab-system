import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type NewExpenseUiState } from "./state";
import { initialApiState, type NewExpenseApiSliceState } from "./api";
import { initialUtilsState, type NewExpenseUtilsState } from "./utils";

export type NewExpenseStoreState = NewExpenseUiState &
  NewExpenseApiSliceState &
  NewExpenseUtilsState;

export function createInitialNewExpenseState(): NewExpenseStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createNewExpenseStore() {
  return createStoreApi<NewExpenseStoreState>(createInitialNewExpenseState());
}
