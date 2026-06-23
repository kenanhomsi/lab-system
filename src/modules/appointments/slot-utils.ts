import { formatAppointmentTimeRange } from "@/components/tables/appointments-table/utils/format";
import type { AppointmentSlot } from "./types";

const dayKeys = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export function appointmentSlotKey(slot: AppointmentSlot): string {
  return `${slot.startTime}|${slot.endTime}`;
}

export function findAppointmentSlotByKey(
  slots: AppointmentSlot[],
  key: string | null,
): AppointmentSlot | undefined {
  if (!key) return undefined;
  return slots.find((slot) => appointmentSlotKey(slot) === key);
}

export function formatAppointmentSlotLabel(
  slot: AppointmentSlot,
  t?: (key: string) => string,
): string {
  const { timeLabel } = formatAppointmentTimeRange(slot.startTime, slot.endTime);
  if (slot.dayOfWeek === null || slot.dayOfWeek === undefined || !t) {
    return timeLabel;
  }
  const day = t(dayKeys[Math.max(0, Math.min(6, slot.dayOfWeek))]);
  return `${day} – ${timeLabel}`;
}
