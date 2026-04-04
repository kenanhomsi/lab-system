import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type JoinAsClientUiState } from "./state";
import { initialApiState, type JoinAsClientApiSliceState } from "./api";
import { initialUtilsState, type JoinAsClientUtilsState } from "./utils";

export type JoinAsClientStoreState = JoinAsClientUiState &
  JoinAsClientApiSliceState &
  JoinAsClientUtilsState;

export function createInitialJoinAsClientState(): JoinAsClientStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createJoinAsClientStore() {
  return createStoreApi<JoinAsClientStoreState>(createInitialJoinAsClientState());
}
