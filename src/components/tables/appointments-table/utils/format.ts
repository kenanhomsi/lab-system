import dayjs from "dayjs";

/**
 * Formats HH:mm:ss or HH:mm strings for table display.
 */
const formatTimeCell = (value: string): string => {
  if (!value) return "—";
  const match = value.match(/^(\d{1,2}:\d{2})/);
  return match?.[1] ?? value;
};

/**
 * Formats an appointment timestamp for display (date + time).
 */
const formatAppointmentDateTime = (value: string): string => {
  if (!value) return "—";
  const parsed = dayjs(value);
  if (parsed.isValid()) {
    return parsed.format("YYYY-MM-DD HH:mm");
  }
  return formatTimeCell(value);
};

type AppointmentTimeRange = {
  dateLabel: string;
  timeLabel: string;
};

/**
 * Formats start/end appointment times into readable date and time labels.
 */
const formatAppointmentTimeRange = (start: string, end: string): AppointmentTimeRange => {
  const startParsed = dayjs(start);
  const endParsed = dayjs(end);

  if (startParsed.isValid() && endParsed.isValid()) {
    const sameDay = startParsed.format("YYYY-MM-DD") === endParsed.format("YYYY-MM-DD");
    return {
      dateLabel: startParsed.format("YYYY-MM-DD"),
      timeLabel: sameDay
        ? `${startParsed.format("HH:mm")} – ${endParsed.format("HH:mm")}`
        : `${startParsed.format("HH:mm")} – ${endParsed.format("HH:mm")}`,
    };
  }

  return {
    dateLabel: "—",
    timeLabel: `${formatTimeCell(start)} – ${formatTimeCell(end)}`,
  };
};

const STATUS_COLOR: Record<string, string> = {
  scheduled: "blue",
  confirmed: "teal",
  completed: "teal",
  pending: "orange",
  cancelled: "red",
  canceled: "red",
};

/**
 * Resolves a badge color for an appointment status.
 */
const appointmentStatusColor = (status?: string): string => {
  const normalized = status?.trim().toLowerCase() ?? "";
  return STATUS_COLOR[normalized] ?? "gray";
};

const isCancelledStatus = (status?: string): boolean => {
  const normalized = status?.trim().toLowerCase() ?? "";
  return normalized.includes("cancel");
};

const isCompletedStatus = (status?: string): boolean => {
  const normalized = status?.trim().toLowerCase() ?? "";
  return normalized.includes("complete");
};

const isEditableStatus = (status?: string): boolean => {
  return !isCancelledStatus(status) && !isCompletedStatus(status);
};

export {
  appointmentStatusColor,
  formatAppointmentDateTime,
  formatAppointmentTimeRange,
  formatTimeCell,
  isCancelledStatus,
  isCompletedStatus,
  isEditableStatus,
};
