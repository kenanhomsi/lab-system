import type {
  AvailabilitiesResponse,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
} from "../types";

type Params = {
  availabilitiesData: AvailabilitiesResponse;
  isPending: boolean;
  refetchAvailabilities: () => void;
  createAvailability: (payload: CreateAvailabilityRequest) => Promise<unknown>;
  updateAvailability: (payload: UpdateAvailabilityRequest) => Promise<unknown>;
  deleteAvailability: (id: number) => Promise<unknown>;
};

const store = (): Params => ({
  availabilitiesData: [],
  isPending: false,
  refetchAvailabilities: () => {},
  createAvailability: async () => null,
  updateAvailability: async () => null,
  deleteAvailability: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
