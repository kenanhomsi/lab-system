export const CLIENT_JOIN_REQUEST_STATUSES = [
  "New",
  "Approved",
  "Rejected",
] as const;

export type ClientJoinRequestStatus =
  (typeof CLIENT_JOIN_REQUEST_STATUSES)[number];

export function normalizeClientJoinRequestStatus(
  value: string,
): ClientJoinRequestStatus | null {
  const match = CLIENT_JOIN_REQUEST_STATUSES.find(
    (status) => status.toLowerCase() === value.trim().toLowerCase(),
  );
  return match ?? null;
}
