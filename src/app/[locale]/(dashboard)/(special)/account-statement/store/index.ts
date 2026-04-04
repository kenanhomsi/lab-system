import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type AccountStatementUiState } from "./state";
import { initialApiState, type AccountStatementApiSliceState } from "./api";
import { initialUtilsState, type AccountStatementUtilsState } from "./utils";

export type AccountStatementStoreState = AccountStatementUiState &
  AccountStatementApiSliceState &
  AccountStatementUtilsState;

export function createInitialAccountStatementState(): AccountStatementStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createAccountStatementStore() {
  return createStoreApi<AccountStatementStoreState>(createInitialAccountStatementState());
}
