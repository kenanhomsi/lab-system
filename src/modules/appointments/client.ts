"use client";

import { axiosInstanceFront } from "@/lib/clients/frontend-instance";
import type {
  Appointment,
  AppointmentAdminStatus,
  AppointmentSlot,
  Availability,
  CreateAppointmentInput,
  DayAvailabilityInput,
  UpsertAvailabilityInput,
} from "./types";

const unwrapData = <T,>(payload: unknown): T => {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    (payload as { data?: unknown }).data !== undefined
  ) {
    return (payload as { data: T }).data;
  }
  return payload as T;
};

const unwrapList = <T,>(payload: unknown): T[] => {
  const data = unwrapData<unknown>(payload);
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const objectData = data as Record<string, unknown>;
    if (Array.isArray(objectData.items)) return objectData.items as T[];
    if (Array.isArray(objectData.results)) return objectData.results as T[];
    if (Array.isArray(objectData.data)) return objectData.data as T[];
  }
  return [];
};

const normalizeSlot = (item: Record<string, unknown>): AppointmentSlot => {
  const id = Number(item.id ?? item.availabilityId ?? 0);
  const availabilityId = Number(item.availabilityId ?? item.id ?? 0);
  const slotDurationRaw =
    item.slotDuration ?? item.durationMinutes ?? item.slotDurationMinutes;
  return {
    id,
    availabilityId,
    userId: typeof item.userId === "string" ? item.userId : null,
    dayOfWeek:
      item.dayOfWeek === null || item.dayOfWeek === undefined
        ? null
        : Number(item.dayOfWeek),
    startTime: String(item.startTime ?? ""),
    endTime: String(item.endTime ?? ""),
    slotDuration:
      slotDurationRaw === null || slotDurationRaw === undefined
        ? null
        : Number(slotDurationRaw),
    isActive:
      typeof item.isActive === "boolean" ? item.isActive : null,
    isAvailable:
      typeof item.isAvailable === "boolean" ? item.isAvailable : null,
  };
};

const isBookableSlot = (slot: AppointmentSlot): boolean => {
  if (slot.availabilityId <= 0 || !slot.startTime || !slot.endTime) return false;
  if (slot.isAvailable === false) return false;
  return true;
};

export const appointmentsClient = {
  async findAll(params?: Record<string, string | number | undefined>) {
    const response = await axiosInstanceFront.get("/appointments", { params });
    return unwrapList<Appointment>(response.data);
  },

  async create(input: CreateAppointmentInput) {
    const response = await axiosInstanceFront.post("/appointments", input);
    return unwrapData<Appointment>(response.data);
  },

  async cancel(id: number) {
    await axiosInstanceFront.post(`/appointments/${id}/cancel`);
  },

  async updateStatus(id: number, status: AppointmentAdminStatus) {
    const normalized = status.trim().toUpperCase();

    if (normalized === "CONFIRMED") {
      await axiosInstanceFront.post(`/appointments/${id}/confirm`);
      return;
    }

    if (normalized === "COMPLETED") {
      await axiosInstanceFront.post(`/appointments/${id}/complete`);
      return;
    }

    const response = await axiosInstanceFront.put(`/appointments/${id}/status`, {
      status: normalized,
    });
    return unwrapData<Appointment>(response.data);
  },

  async getDayAvailability(input: DayAvailabilityInput) {
    const response = await axiosInstanceFront.get("/appointments/day-availability", {
      params: {
        Date: input.date.trim(),
      },
    });
    const data = unwrapData<unknown>(response.data);
    let items: Record<string, unknown>[] = [];
    if (data && typeof data === "object" && !Array.isArray(data)) {
      const record = data as Record<string, unknown>;
      if (Array.isArray(record.slots)) {
        items = record.slots as Record<string, unknown>[];
      } else if (Array.isArray(record.windows)) {
        items = record.windows as Record<string, unknown>[];
      }
    }
    if (items.length === 0) {
      items = unwrapList<Record<string, unknown>>(response.data);
    }
    return items.map(normalizeSlot).filter(isBookableSlot);
  },
};

export const availabilitiesClient = {
  async findAll(params?: Record<string, string | number | undefined>) {
    const response = await axiosInstanceFront.get("/availabilities", { params });
    return unwrapList<Availability>(response.data);
  },

  async create(input: UpsertAvailabilityInput) {
    const response = await axiosInstanceFront.post("/availabilities", input);
    return unwrapData<Availability>(response.data);
  },

  async update(id: number, input: UpsertAvailabilityInput) {
    const response = await axiosInstanceFront.put(`/availabilities/${id}`, input);
    return unwrapData<Availability>(response.data);
  },

  async delete(id: number) {
    await axiosInstanceFront.delete(`/availabilities/${id}`);
  },
};
