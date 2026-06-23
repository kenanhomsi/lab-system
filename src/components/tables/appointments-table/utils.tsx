"use client";

import { PropsWithChildren, useEffect, useMemo } from "react";
import { useMirror, useMirrorRegistry } from "./store";
import { APPOINTMENTS_PAGE_SIZE, type AppointmentsPage, type AppointmentRow } from "./types";

const matchesSearch = (row: AppointmentRow, query: string): boolean => {
  const haystack = [
    row.id,
    row.testRequestId,
    row.availabilityId,
    row.userId,
    row.status,
    row.patientLocationType,
    row.notes,
  ]
    .filter((value) => value !== null && value !== undefined)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
};

const matchesStatus = (row: AppointmentRow, statusFilter: string): boolean => {
  if (statusFilter === "all") return true;
  return (row.status ?? "").trim().toLowerCase() === statusFilter.toLowerCase();
};

const paginateRows = (rows: AppointmentRow[], pageNumber: number): AppointmentsPage => {
  const totalCount = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / APPOINTMENTS_PAGE_SIZE));
  const page = Math.min(Math.max(pageNumber, 1), totalPages);
  const start = (page - 1) * APPOINTMENTS_PAGE_SIZE;

  return {
    items: rows.slice(start, start + APPOINTMENTS_PAGE_SIZE),
    page,
    pageSize: APPOINTMENTS_PAGE_SIZE,
    totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

/**
 * Filters and paginates appointment rows for the table view.
 */
const Utils = ({ children }: PropsWithChildren) => {
  const appointmentsRaw = useMirror("appointmentsRaw");
  const debouncedValue = useMirror("debouncedValue");
  const statusFilter = useMirror("statusFilter");
  const pageNumber = useMirror("pageNumber");
  const setPageNumber = useMirror("setPageNumber");

  const appointmentsPage = useMemo(() => {
    const query = debouncedValue.trim().toLowerCase();
    const filtered = appointmentsRaw.filter((row) => {
      const matchesQuery = !query || matchesSearch(row, query);
      const matchesStatusFilter = matchesStatus(row, statusFilter);
      return matchesQuery && matchesStatusFilter;
    });

    return paginateRows(filtered, pageNumber);
  }, [appointmentsRaw, debouncedValue, pageNumber, statusFilter]);

  useEffect(() => {
    if (pageNumber > appointmentsPage.totalPages) {
      setPageNumber(appointmentsPage.totalPages);
    }
  }, [appointmentsPage.totalPages, pageNumber, setPageNumber]);

  useMirrorRegistry("appointmentsPage", appointmentsPage);
  useMirrorRegistry("appointmentsData", appointmentsPage.items);

  return <>{children}</>;
};

export { Utils };
