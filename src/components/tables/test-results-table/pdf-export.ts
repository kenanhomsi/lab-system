import { pdf } from "@react-pdf/renderer";
import { TestResultPdfDocument, type TestResultPdfRow } from "@/lib/pdf/test-result-pdf";
import { getTestRequestCreatorLabel } from "./get-test-request-creator-label";
import type { TestResultItem } from "./types";

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

export function parseResultRows(raw: TestResultItem["resultData"]): {
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
      return {
        rows: Object.entries(parsed as Record<string, unknown>).map(([key, value]) => ({
          key,
          value: stringifyValue(value),
        })),
        rawResultData: JSON.stringify(parsed, null, 2),
      };
    }
    return { rows: [], rawResultData: stringifyValue(parsed) };
  } catch {
    return { rows: [], rawResultData: trimmed };
  }
}

function sanitizeFileName(value: string): string {
  const cleaned = value
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || "test-result";
}

export function getResultFileName(row: TestResultItem, rows: TestResultPdfRow[]): string {
  const preferredKeys = [
    "testname",
    "test_name",
    "medicaltestname",
    "medical_test_name",
    "analysisname",
    "analysis_name",
    "name",
    "test",
  ];
  const preferred = rows.find((item) =>
    preferredKeys.includes(item.key.trim().toLowerCase()),
  )?.value;
  const rowFieldsName = rows
    .slice(0, 3)
    .map((item) => item.key)
    .filter(Boolean)
    .join("-");
  const fallback = preferred || rowFieldsName || `test-result-${row.id}`;
  return `${sanitizeFileName(fallback)}.pdf`;
}

export function getBulkResultsFileName(rows: TestResultItem[]): string {
  const first = rows[0];
  const prefix = first ? getResultFileName(first, parseResultRows(first.resultData).rows).replace(/\.pdf$/i, "") : "test-results";
  return `${sanitizeFileName(`${prefix}-${rows.length}-results`)}.pdf`;
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function createTestResultPdfBlob(row: TestResultItem): Promise<Blob> {
  const { rows, rawResultData } = parseResultRows(row.resultData);
  return pdf(
    TestResultPdfDocument({
      id: row.id,
      testRequestId: row.testRequestId,
      requestCreatedBy: getTestRequestCreatorLabel(row),
      resultDate: row.resultDate,
      status: row.status,
      createdAt: row.createdAt,
      rows,
      rawResultData,
      pdfUrl: row.pdfUrl,
    }),
  ).toBlob();
}

export async function createBulkTestResultsPdfBlob(results: TestResultItem[]): Promise<Blob> {
  return pdf(
    TestResultPdfDocument({
      results: results.map((row) => {
        const { rows, rawResultData } = parseResultRows(row.resultData);
        return {
          id: row.id,
          testRequestId: row.testRequestId,
          requestCreatedBy: getTestRequestCreatorLabel(row),
          resultDate: row.resultDate,
          status: row.status,
          createdAt: row.createdAt,
          rows,
          rawResultData,
          pdfUrl: row.pdfUrl,
        };
      }),
    }),
  ).toBlob();
}
