/** Namespaces required by `(auth)` routes. */
export const AUTH_MESSAGE_NAMESPACES = ["auth", "common"] as const;

export function pickAuthMessages(
  messages: Record<string, unknown>,
): Record<string, unknown> {
  const picked: Record<string, unknown> = {};
  for (const key of AUTH_MESSAGE_NAMESPACES) {
    if (key in messages) {
      picked[key] = messages[key];
    }
  }
  return picked;
}
