"use client";

import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { availabilitiesClient } from "@/modules/appointments";
import type { Availability } from "@/modules/appointments";
import { parsePaginatedList } from "@/lib/api/bff-pagination";
import { normalizeDayOfWeek, toFormTime } from "../utils/format";
import { useMirror, useMirrorRegistry } from "../store";
import type { AvailabilityRow } from "../types";

const AVAILABILITIES_PAGE_SIZE = 20;

const normalizeAvailability = (value: unknown): AvailabilityRow | null => {
  if (typeof value !== "object" || value === null) return null;
  const item = value as Partial<Availability>;
  if (typeof item.id !== "number") return null;

  return {
    id: item.id,
    userId: typeof item.userId === "string" ? item.userId : null,
    dayOfWeek: normalizeDayOfWeek(item.dayOfWeek),
    startTime: toFormTime(String(item.startTime ?? "")),
    endTime: toFormTime(String(item.endTime ?? "")),
    slotDuration:
      typeof item.slotDuration === "number" && Number.isFinite(item.slotDuration)
        ? item.slotDuration
        : 30,
    isActive: typeof item.isActive === "boolean" ? item.isActive : true,
    createdAt: typeof item.createdAt === "string" ? item.createdAt : null,
    updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : null,
  };
};

const emptyAvailabilitiesPage = () => ({
  items: [] as AvailabilityRow[],
  page: 1,
  pageSize: AVAILABILITIES_PAGE_SIZE,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
});

/**
 * Loads availabilities with server-side pagination.
 */
const GetAllAvailabilities = ({ children }: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["admin-availabilities", pageNumber],
    queryFn: async () => {
      const payload = await availabilitiesClient.findAll({
        Page: pageNumber,
        PageSize: AVAILABILITIES_PAGE_SIZE,
      });
      const page = parsePaginatedList<unknown>(payload, pageNumber, AVAILABILITIES_PAGE_SIZE);
      return {
        ...page,
        items: page.items
          .map(normalizeAvailability)
          .filter((item): item is AvailabilityRow => item !== null),
      };
    },
  });

  const availabilitiesPage = data ?? emptyAvailabilitiesPage();

  useMirrorRegistry("availabilitiesPage", availabilitiesPage);
  useMirrorRegistry("availabilitiesData", availabilitiesPage.items);
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchAvailabilities", () => {
    void refetch();
  });

  return <>{children}</>;
};

export { GetAllAvailabilities };
