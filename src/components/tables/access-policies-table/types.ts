import type { AccessPolicyDto, AccessPolicyWritePayload } from "@/modules/access-policy";

export type AccessPolicyTableItem = AccessPolicyDto;

export type AccessPoliciesResponse = AccessPolicyTableItem[];

export type CreateAccessPolicyRequest = AccessPolicyWritePayload;

export type UpdateAccessPolicyRequest = AccessPolicyWritePayload;

export type AccessPolicyModalType = "create" | "edit" | "delete" | null;
