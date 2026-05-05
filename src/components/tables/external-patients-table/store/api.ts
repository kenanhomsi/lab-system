import type {
  CreateExternalPatientFrontendParams,
  LinkDirectPatientFrontendParams,
} from "@/modules/ExternalPatients/frontend/types";
import type { ExternalPatientsPageData } from "../types";

type Params = {
  externalPatientsData: ExternalPatientsPageData;
  isPending: boolean;
  refetchExternalPatients: () => void;
  createMutation: {
    mutateAsync: (data: CreateExternalPatientFrontendParams) => Promise<unknown>;
  };
  linkMutation: {
    mutateAsync: (params: LinkDirectPatientFrontendParams) => Promise<unknown>;
  };
};

const emptyPage = (): ExternalPatientsPageData => ({
  items: [],
  page: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
});

const store = (): Params => ({
  externalPatientsData: emptyPage(),
  isPending: false,
  refetchExternalPatients: () => {},
  createMutation: { mutateAsync: async () => {} },
  linkMutation: { mutateAsync: async () => {} },
});

export { store as apiStore };
export type { Params as apiParams };
