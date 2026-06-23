"use client";

import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { availabilitiesClient } from "@/modules/appointments";
import type { Availability } from "@/modules/appointments";
import { normalizeDayOfWeek, toFormTime } from "../utils/format";
import { useMirror, useMirrorRegistry } from "../store";
import type { AvailabilityRow } from "../types";

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

const asAvailabilityRows = (payload: unknown): AvailabilityRow[] => {
  if (Array.isArray(payload)) {
    return payload.map(normalizeAvailability).filter((item): item is AvailabilityRow => item !== null);
  }
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: unknown }).data;
    if (Array.isArray(inner)) {
      return inner.map(normalizeAvailability).filter((item): item is AvailabilityRow => item !== null);
    }
  }
  return [];
};

/**
 * Loads availabilities and mirrors them into the table store.
 */
const GetAllAvailabilities = ({ children }: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["admin-availabilities", pageNumber],
    queryFn: () => availabilitiesClient.findAll(),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry("availabilitiesData", asAvailabilityRows(data));
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchAvailabilities", () => {
    void refetch();
  });

  return <>{children}</>;
};

export { GetAllAvailabilities, asAvailabilityRows };
