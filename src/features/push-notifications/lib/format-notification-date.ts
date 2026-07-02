import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function formatNotificationDate(value?: string | null): string {
  if (!value) {
    return "";
  }

  const parsed = dayjs(value);
  if (!parsed.isValid()) {
    return value;
  }

  return parsed.fromNow();
}
