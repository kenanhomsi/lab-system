import type { Availability, UpsertAvailabilityInput } from "@/modules/appointments";

export type AvailabilityModalType = "create" | "edit" | "delete" | null;

export type AvailabilityRow = Availability;

export type CreateAvailabilityRequest = UpsertAvailabilityInput;

export type UpdateAvailabilityRequest = UpsertAvailabilityInput & {
  id: number;
};

export type AvailabilitiesResponse = AvailabilityRow[];

export type AvailabilitiesPage = {
  items: AvailabilityRow[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
