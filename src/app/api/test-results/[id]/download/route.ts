import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { TestResultPdfDocument, type TestResultPdfRow } from "@/lib/pdf/test-result-pdf";
import {
  TestResultBackendService,
  testResultModuleNames,
} from "@/modules/TestResults";
import type { TestResultItem } from "@/components/tables/test-results-table/types";

export const runtime = "nodejs";

const testResultService = backendContainer.get<TestResultBackendService>(
  testResultModuleNames.service,
);

type RouteContext = {
  params: Promise<{ id: string }>;
};

function stringifyValue(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "-";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function parseRows(raw: TestResultItem["resultData"]): {
  rows: TestResultPdfRow[];
  rawResultData: string;
} {
  if (typeof raw !== "string") {
    return {
      rows: Object.entries(raw).map(([key, value]) => ({
        key,
        value: stringifyValue(value),
      })),
      rawResultData: JSON.stringify(raw, null, 2),
    };
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return { rows: [], rawResultData: "" };
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
      const entries = Object.entries(parsed as Record<string, unknown>);
      return {
        rows: entries.map(([key, value]) => ({ key, value: stringifyValue(value) })),
        rawResultData: JSON.stringify(parsed, null, 2),
      };
    }
    return { rows: [], rawResultData: stringifyValue(parsed) };
  } catch {
    return { rows: [], rawResultData: trimmed };
  }
}

function getRequestCreatorLabel(result: Pick<
  TestResultItem,
  | "testRequestCreatedByFullName"
  | "testRequestCreatedByName"
  | "testRequestCreatedByUserId"
>): string | null {
  return (
    result.testRequestCreatedByFullName?.trim() ||
    result.testRequestCreatedByName?.trim() ||
    result.testRequestCreatedByUserId?.trim() ||
    null
  );
}

/**
 * Generates a secured PDF download for a single test result.
 */
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const { id } = await context.params;
    const result = await testResultService.findOne({ token, id });
    const { rows, rawResultData } = parseRows(result.resultData);
    const pdfBuffer = await renderToBuffer(
      TestResultPdfDocument({
        id: result.id,
        testRequestId: result.testRequestId,
        requestCreatedBy: getRequestCreatorLabel(result),
        resultDate: result.resultDate,
        status: result.status,
        createdAt: result.createdAt,
        rows,
        rawResultData,
        pdfUrl: result.pdfUrl ?? null,
      }),
    );

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="test-result-${result.id}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error: unknown) {
    return jsonError(error);
  }
}
