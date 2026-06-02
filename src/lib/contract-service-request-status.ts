export const CONTRACT_SERVICE_REQUEST_STATUSES = [
  "New",
  "Approved",
  "Rejected",
] as const;

export type ContractServiceRequestStatus =
  (typeof CONTRACT_SERVICE_REQUEST_STATUSES)[number];

export function normalizeContractServiceRequestStatus(
  value: string,
): ContractServiceRequestStatus | null {
  const match = CONTRACT_SERVICE_REQUEST_STATUSES.find(
    (status) => status.toLowerCase() === value.trim().toLowerCase(),
  );
  return match ?? null;
}
