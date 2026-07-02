import {
  paginatedNotificationsSchema,
  userNotificationSchema,
  type PaginatedNotifications,
  type UserNotification,
} from "./schemas";

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric;
  }
  return fallback;
};

const unwrap = (payload: unknown): unknown => {
  const record = asRecord(payload);
  return record && "data" in record ? record.data : payload;
};

export function normalizeNotificationsResponse(
  payload: unknown,
  fallbackPage = 1,
  fallbackPageSize = 20,
): PaginatedNotifications {
  const inner = unwrap(payload);

  if (Array.isArray(inner)) {
    const items = userNotificationSchema.array().parse(inner);
    return {
      items,
      page: fallbackPage,
      pageSize: fallbackPageSize,
      totalCount: items.length,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  const parsed = paginatedNotificationsSchema.parse(inner ?? {});
  const items = userNotificationSchema.array().parse(parsed.items ?? []);
  const pageSize = toNumber(parsed.pageSize, fallbackPageSize);
  const totalCount = toNumber(parsed.totalCount, items.length);
  const page = toNumber(parsed.page, fallbackPage);
  const totalPages = toNumber(
    parsed.totalPages,
    Math.max(1, Math.ceil(totalCount / Math.max(pageSize, 1))),
  );

  return {
    items,
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage:
      typeof parsed.hasNextPage === "boolean" ? parsed.hasNextPage : page < totalPages,
    hasPreviousPage:
      typeof parsed.hasPreviousPage === "boolean"
        ? parsed.hasPreviousPage
        : page > 1,
  };
}

export function countUnreadNotifications(items: UserNotification[]): number {
  return items.filter((item) => !item.isRead).length;
}
