import { TargetAudience } from "../types";

type Params = {
  audienceOptions: TargetAudience[];
};

const store = (): Params => ({
  audienceOptions: ["All", "Patient", "Doctor", "LabPartner"],
});

export { store as utilsStore };
export type { Params as utilsParams };
