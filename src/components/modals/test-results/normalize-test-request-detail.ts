import type {
  TestRequestItem,
  TestRequestTestItem,
} from "@/components/tables/test-requests-table/types";
import type { ParameterSchemaInput } from "@/modules/medical-tests/abstraction";

/** Unwrap nested `{ data }` envelopes from BFF/upstream test-request payloads. */
function unwrapTestRequestPayload(payload: unknown): TestRequestItem | null {
  if (payload === null || payload === undefined) return null;
  let cur: unknown = payload;
  for (let depth = 0; depth < 5; depth += 1) {
    if (!cur || typeof cur !== "object") return null;
    const o = cur as Record<string, unknown>;
    if (typeof o.id === "number") {
      return o as TestRequestItem;
    }
    const d = o.data;
    if (d !== undefined && d !== null && typeof d === "object") {
      cur = d;
      continue;
    }
    return null;
  }
  return null;
}

function asParameterSchemaInput(
  raw: TestRequestTestItem["parameterSchema"],
): ParameterSchemaInput | null {
  if (raw === undefined || raw === null) return null;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  return raw as ParameterSchemaInput;
}

type ResolvedRequestTest = TestRequestTestItem & {
  parameterSchemaInput: ParameterSchemaInput | null;
};

/**
 * Resolve the medical tests linked to a test request for result entry.
 * Prefers the `tests` array from find-one; falls back to legacy single `medicalTestId`.
 */
function resolveRequestTests(
  detail: TestRequestItem | null | undefined,
  legacyParameterSchema?: ParameterSchemaInput | null,
): ResolvedRequestTest[] {
  if (!detail) return [];

  if (detail.tests && detail.tests.length > 0) {
    return detail.tests.map((test) => ({
      ...test,
      parameterSchemaInput: asParameterSchemaInput(test.parameterSchema),
    }));
  }

  const medicalTestId = detail.medicalTestId ?? 0;
  if (medicalTestId <= 0) return [];

  return [
    {
      testRequestId: detail.id,
      medicalTestId,
      medicalTestNameEn: detail.medicalTestNameEn ?? null,
      parameterSchema:
        typeof legacyParameterSchema === "string"
          ? legacyParameterSchema
          : legacyParameterSchema != null
            ? JSON.stringify(legacyParameterSchema)
            : null,
      parameters: [],
      parameterSchemaInput: legacyParameterSchema ?? null,
    },
  ];
}

export type { ResolvedRequestTest };
export { asParameterSchemaInput, resolveRequestTests, unwrapTestRequestPayload };
