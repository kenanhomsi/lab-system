/**
 * Store initialization for appointments page
 * Defines initial state structure
 */

import type { AppointmentsPageState } from "../type";

const store = (): AppointmentsPageState => ({
  appointments: [],
  selectedAppointment: null,
  isCreateModalOpen: false,
  isCancelModalOpen: false,
  isCancelConfirmOpen: false,
  isDetailsModalOpen: false,
  isLoading: false,
  error: null,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  statusFilter: "all",
});

export { store as initStore };
export type { AppointmentsPageState as initParams };
