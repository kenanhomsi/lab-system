import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type PriceCalculatorUiState } from "./state";
import { initialApiState, type PriceCalculatorApiSliceState } from "./api";
import { initialUtilsState, type PriceCalculatorUtilsState } from "./utils";

export type PriceCalculatorStoreState = PriceCalculatorUiState &
  PriceCalculatorApiSliceState &
  PriceCalculatorUtilsState;

export function createInitialPriceCalculatorState(): PriceCalculatorStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createPriceCalculatorStore() {
  return createStoreApi<PriceCalculatorStoreState>(
    createInitialPriceCalculatorState(),
  );
}
