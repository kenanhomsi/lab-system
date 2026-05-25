import { notifications } from "@mantine/notifications";
import { isAxiosError } from "axios";
import { ValidationError } from "@/modules/errors/validation-error";
import { getErrorLabels } from "@/lib/error/error-labels";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringifyUnknown(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    const parts = value
      .map((item) => stringifyUnknown(item))
      .filter((item): item is string => Boolean(item));
    return parts.length > 0 ? parts.join(", ") : null;
  }
  if (isRecord(value)) {
    const message =
      (typeof value.message === "string" ? value.message : null) ||
      (typeof value.error === "string" ? value.error : null) ||
      (typeof value.title === "string" ? value.title : null);
    if (message?.trim()) return message.trim();

    const nestedError = value.error;
    if (nestedError !== undefined) {
      const nested = stringifyUnknown(nestedError);
      if (nested) return nested;
    }

    try {
      return JSON.stringify(value);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Normalizes API, validation, and runtime errors into a user-facing message.
 */
export function extractErrorMessage(
  error: unknown,
  fallback?: string,
): string {
  const resolvedFallback = fallback ?? getErrorLabels().genericFallback;
  if (error instanceof ValidationError) {
    const validationErrors = error.getErrors();
    if (Array.isArray(validationErrors) && validationErrors.length > 0) {
      const messages = validationErrors
        .map((item) => {
          if (isRecord(item) && typeof item.message === "string") {
            return item.message;
          }
          return stringifyUnknown(item);
        })
        .filter((item): item is string => Boolean(item));
      if (messages.length > 0) return messages.join(", ");
    }
  }

  if (isAxiosError(error)) {
    const data = error.response?.data;
    const fromData = stringifyUnknown(data);
    if (fromData) return fromData;
    if (error.message?.trim()) return error.message;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  const generic = stringifyUnknown(error);
  return generic ?? resolvedFallback;
}

export function showErrorNotification(
  title: string,
  error: unknown,
  fallback?: string,
): void {
  const labels = getErrorLabels();
  notifications.show({
    title,
    message: extractErrorMessage(error, fallback ?? labels.genericFallback),
    color: "red",
    autoClose: 6000,
  });
}

export function showSuccessNotification(title: string, message: string): void {
  notifications.show({
    title,
    message,
    color: "teal",
    autoClose: 4000,
  });
}
