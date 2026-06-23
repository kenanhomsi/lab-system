import type { Availability, UpsertAvailabilityInput } from "@/modules/appointments";

export type AvailabilityModalType = "create" | "edit" | "delete" | null;

export type AvailabilityRow = Availability;

export type CreateAvailabilityRequest = UpsertAvailabilityInput;

export type UpdateAvailabilityRequest = UpsertAvailabilityInput & {
  id: number;
};

export type AvailabilitiesResponse = AvailabilityRow[];
