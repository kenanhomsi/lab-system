import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type OrderTrackingUiState } from "./state";
import { initialApiState, type OrderTrackingApiSliceState } from "./api";
import { initialUtilsState, type OrderTrackingUtilsState } from "./utils";

export type OrderTrackingStoreState = OrderTrackingUiState &
  OrderTrackingApiSliceState &
  OrderTrackingUtilsState;

export function createInitialOrderTrackingState(): OrderTrackingStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createOrderTrackingStore() {
  return createStoreApi<OrderTrackingStoreState>(createInitialOrderTrackingState());
}
