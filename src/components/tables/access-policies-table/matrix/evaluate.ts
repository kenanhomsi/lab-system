import type { AccessPolicyTableItem } from "../types";

/** Concrete actions shown as matrix columns/filters (wildcard "*" is folded into each). */
export const MATRIX_ACTIONS = ["read", "create", "delete", "approve", "assign"] as const;
export type MatrixAction = (typeof MATRIX_ACTIONS)[number];

export type CellDecision = "allow" | "deny" | "none";

export type CellResult = {
  decision: CellDecision;
  /** The rule that decided the outcome (highest priority; Deny wins ties). */
  decidingPolicy: AccessPolicyTableItem | null;
  /** Every enabled rule that matched, highest priority first. */
  matches: AccessPolicyTableItem[];
  /** Deciding rule targets everyone (All / Authenticated), not this role specifically. */
  inherited: boolean;
  /** Deciding rule has a condition, so the outcome depends on the record. */
  conditional: boolean;
};

const lower = (value: string | null | undefined) => (value ?? "").trim().toLowerCase();

const isAllow = (effect: string) => ["allow", "permit"].includes(lower(effect));

const hasCondition = (condition: unknown): boolean => {
  if (condition === null || condition === undefined) return false;
  if (typeof condition === "string") return condition.trim().length > 0;
  if (typeof condition === "object") return Object.keys(condition as object).length > 0;
  return true;
};

const isActiveNow = (policy: AccessPolicyTableItem, now: number): boolean => {
  if (policy.validFrom && new Date(policy.validFrom).getTime() > now) return false;
  if (policy.validTo && new Date(policy.validTo).getTime() < now) return false;
  return true;
};

/** Rules with subject "All" or "Authenticated" apply to every signed-in role. */
export const isEveryoneSubject = (policy: AccessPolicyTableItem) =>
  ["all", "authenticated"].includes(lower(policy.subjectType));

const appliesToRole = (policy: AccessPolicyTableItem, role: string) =>
  isEveryoneSubject(policy) ||
  (lower(policy.subjectType) === "role" && lower(policy.subjectKey) === lower(role));

/**
 * Client-side preview of the effective permission for one role/resource/action.
 * Mirrors the PolicyGraph rule: highest priority wins; on equal priority Deny wins.
 * No matching rule means "not granted".
 */
export const evaluateCell = (
  policies: AccessPolicyTableItem[],
  role: string,
  resource: string,
  action: MatrixAction,
  now: number = Date.now(),
): CellResult => {
  const matches = policies
    .filter(
      (policy) =>
        policy.isEnabled &&
        isActiveNow(policy, now) &&
        appliesToRole(policy, role) &&
        (lower(policy.resource) === lower(resource) || lower(policy.resource) === "*") &&
        (lower(policy.action) === action || lower(policy.action) === "*"),
    )
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      // Equal priority: Deny first.
      return Number(isAllow(a.effect)) - Number(isAllow(b.effect));
    });

  const decidingPolicy = matches[0] ?? null;

  return {
    decision: decidingPolicy ? (isAllow(decidingPolicy.effect) ? "allow" : "deny") : "none",
    decidingPolicy,
    matches,
    inherited: decidingPolicy ? isEveryoneSubject(decidingPolicy) : false,
    conditional: decidingPolicy ? hasCondition(decidingPolicy.condition) : false,
  };
};

/** "test_requests" → "Test requests" */
export const humanizeResource = (resource: string) => {
  const text = resource.replace(/_/g, " ").trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : resource;
};
