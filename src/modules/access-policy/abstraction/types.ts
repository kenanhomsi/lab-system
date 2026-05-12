type AccessPolicyDto = {
  createdAt: string;
  updatedAt: string;
  createdByUserId: string | null;
  id: string;
  resource: string;
  action: string;
  effect: string;
  subjectType: string;
  subjectKey: string;
  condition: string;
  priority: number;
  isEnabled: boolean;
  description: string;
  validFrom?: string | null;
  validTo?: string | null;
  deletedAt?: string | null;
  updatedByUserId?: string | null;
};

/** Request body for create, update, and validate. */
type AccessPolicyWritePayload = {
  resource: string;
  action: string;
  effect: string;
  subjectType: string;
  subjectKey: string;
  condition: string;
  priority: number;
  isEnabled: boolean;
  description: string;
};

export type { AccessPolicyDto, AccessPolicyWritePayload };
