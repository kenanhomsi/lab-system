export type PasswordStrength = "weak" | "medium" | "strong";

/**
 * Evaluates password strength for registration and reset flows.
 */
export function getPasswordStrength(password: string): PasswordStrength | null {
  if (!password) return null;

  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (password.length < 6 || score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
}
