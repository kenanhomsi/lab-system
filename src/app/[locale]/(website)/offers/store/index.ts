import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type OffersUiState } from "./state";
import {
  initialApiState,
  type OffersApiSliceState,
  type Offer,
} from "./api";
import { initialUtilsState, type OffersUtilsState } from "./utils";

export type OffersStoreState = OffersUiState &
  OffersApiSliceState &
  OffersUtilsState;

export type OffersPageExtras = {
  offers: Offer[];
  locale: string;
};

export function createInitialOffersState(): OffersStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createOffersStore(extras?: OffersPageExtras) {
  const base = createInitialOffersState();
  if (extras) {
    return createStoreApi<OffersStoreState>({
      ...base,
      offers: extras.offers,
      locale: extras.locale,
    });
  }
  return createStoreApi<OffersStoreState>(base);
}
