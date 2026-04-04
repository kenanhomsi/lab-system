import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type LabEncyclopediaUiState } from "./state";
import { initialApiState, type LabEncyclopediaApiSliceState } from "./api";
import { initialUtilsState, type LabEncyclopediaUtilsState } from "./utils";

export type LabEncyclopediaStoreState = LabEncyclopediaUiState &
  LabEncyclopediaApiSliceState &
  LabEncyclopediaUtilsState;

export function createInitialLabEncyclopediaState(): LabEncyclopediaStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createLabEncyclopediaStore() {
  return createStoreApi<LabEncyclopediaStoreState>(
    createInitialLabEncyclopediaState(),
  );
}
