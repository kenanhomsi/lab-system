import { createStoreApi } from "@/hooks/store-provider/store-api";
import { initialUiState, type BookAppointmentUiState } from "./state";
import { initialApiState, type BookAppointmentApiSliceState } from "./api";
import { initialUtilsState, type BookAppointmentUtilsState } from "./utils";

export type BookAppointmentStoreState = BookAppointmentUiState &
  BookAppointmentApiSliceState &
  BookAppointmentUtilsState;

export function createInitialBookAppointmentState(): BookAppointmentStoreState {
  return {
    ...initialUiState,
    ...initialApiState,
    ...initialUtilsState,
  };
}

export function createBookAppointmentStore() {
  return createStoreApi<BookAppointmentStoreState>(createInitialBookAppointmentState());
}
