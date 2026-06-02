"use client";

import type { AccountingStatement } from "@/modules/accounting/abstraction/schemas";
import { AccountingPdfDocument } from "@/lib/pdf/accounting-pdf";
import { pdf } from "@react-pdf/renderer";

function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

function formatMoney(value: number, currency: string): string {
  return `${value.toLocaleString()} ${currency}`;
}

/**
 * Generates a client-side PDF from statement data and triggers download.
 */
export async function exportAccountingPdfClient(params: {
  statement: AccountingStatement;
  locale: string;
  currency: string;
}) {
  const { statement, locale, currency } = params;
  const isAr = locale === "ar";
  const rows = statement.rows.map((row) => ({
    patient: row.patientName,
    tests: isAr ? row.testNameAr : row.testNameEn,
    price: formatMoney(row.testPrice, currency),
    payment: formatMoney(row.paymentsApplied, currency),
  }));

  const blob = await pdf(
    AccountingPdfDocument({
      dateFrom: formatDate(statement.periodFrom),
      dateTo: formatDate(statement.periodTo),
      rows,
      totalTestsAmount: formatMoney(statement.totals.totalTestsAmount, currency),
      totalPayments: formatMoney(statement.totals.totalPayments, currency),
      balanceDue: formatMoney(statement.totals.remainingAmount, currency),
    }),
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `account-statement-${formatDate(statement.periodFrom)}.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
}

/**
 * Triggers browser download from a Blob (server PDF).
 */
export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
