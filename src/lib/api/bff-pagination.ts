export const MAX_BFF_PAGE_SIZE = 100;
export const DEFAULT_BFF_PAGE_SIZE = 20;

/**
 * Parses and caps list pagination query params for BFF routes.
 */
export function getBffPagination(searchParams: URLSearchParams) {
  const page = Math.max(
    1,
    Number(searchParams.get("Page") ?? searchParams.get("page") ?? 1),
  );
  const rawPageSize = Number(
    searchParams.get("PageSize") ?? searchParams.get("pageSize") ?? DEFAULT_BFF_PAGE_SIZE,
  );
  const pageSize = Math.min(
    MAX_BFF_PAGE_SIZE,
    Math.max(1, Number.isFinite(rawPageSize) ? rawPageSize : DEFAULT_BFF_PAGE_SIZE),
  );

  return { page, pageSize };
}

/**
 * Returns capped Page/PageSize query string for upstream proxy calls.
 */
export function withCappedPagination(searchParams: URLSearchParams): string {
  const { page, pageSize } = getBffPagination(searchParams);
  const next = new URLSearchParams(searchParams);
  next.set("Page", String(page));
  next.set("PageSize", String(pageSize));
  return next.toString();
}

export type PaginatedList<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

/**
 * Normalizes upstream list payloads into a paginated result shape.
 */
export function parsePaginatedList<T>(
  payload: unknown,
  fallbackPage: number,
  fallbackPageSize: number,
): PaginatedList<T> {
  if (Array.isArray(payload)) {
    const totalCount = payload.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / fallbackPageSize) || 1);
    const page = Math.min(Math.max(fallbackPage, 1), totalPages);
    const start = (page - 1) * fallbackPageSize;
    const items = payload.slice(start, start + fallbackPageSize) as T[];

    return {
      items,
      page,
      pageSize: fallbackPageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  if (!payload || typeof payload !== "object") {
    return {
      items: [],
      page: fallbackPage,
      pageSize: fallbackPageSize,
      totalCount: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  const record = payload as Record<string, unknown>;
  const data =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : record;

  const items = Array.isArray(data.items)
    ? (data.items as T[])
    : Array.isArray(record.items)
      ? (record.items as T[])
      : [];

  const page = Number(data.page ?? record.page ?? fallbackPage) || fallbackPage;
  const pageSize =
    Number(data.pageSize ?? record.pageSize ?? fallbackPageSize) || fallbackPageSize;
  const totalCount = Number(
    data.totalCount ?? data.total ?? record.totalCount ?? record.total ?? items.length,
  );
  const totalPages = Math.max(
    1,
    Number(data.totalPages ?? record.totalPages) ||
      Math.ceil(totalCount / pageSize) ||
      1,
  );

  return {
    items,
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: Boolean(data.hasNextPage ?? record.hasNextPage ?? page < totalPages),
    hasPreviousPage: Boolean(
      data.hasPreviousPage ?? record.hasPreviousPage ?? page > 1,
    ),
  };
}
