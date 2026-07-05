import type {
  AvailabilitiesPage,
  AvailabilitiesResponse,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
} from "../types";

type Params = {
  availabilitiesData: AvailabilitiesResponse;
  availabilitiesPage: AvailabilitiesPage;
  isPending: boolean;
  refetchAvailabilities: () => void;
  createAvailability: (payload: CreateAvailabilityRequest) => Promise<unknown>;
  updateAvailability: (payload: UpdateAvailabilityRequest) => Promise<unknown>;
  deleteAvailability: (id: number) => Promise<unknown>;
};

const store = (): Params => ({
  availabilitiesData: [],
  availabilitiesPage: {
    items: [],
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  isPending: false,
  refetchAvailabilities: () => {},
  createAvailability: async () => null,
  updateAvailability: async () => null,
  deleteAvailability: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
