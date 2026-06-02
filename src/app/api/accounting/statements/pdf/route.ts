import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import {
  AccountingBackendService,
  accountingModuleNames,
} from "@/modules/accounting";

const accountingService = backendContainer.get<AccountingBackendService>(
  accountingModuleNames.service,
);

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const labClientId = req.nextUrl.searchParams.get("labClientId") ?? "";
    if (!labClientId.trim()) {
      throw new Error("labClientId is required");
    }
    const from = req.nextUrl.searchParams.get("from") ?? undefined;
    const to = req.nextUrl.searchParams.get("to") ?? undefined;
    const buffer = await accountingService.downloadStatementPdf({
      token,
      query: { labClientId, from, to },
    });
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="account-statement.pdf"',
      },
    });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const formData = await req.formData();
    const labClientId = String(formData.get("labClientId") ?? "");
    const from = String(formData.get("from") ?? "");
    const to = String(formData.get("to") ?? "");
    const notes = String(formData.get("notes") ?? "");
    const file = formData.get("file");
    if (!labClientId || !from || !to) {
      throw new Error("labClientId, from, and to are required");
    }
    if (!(file instanceof Blob)) {
      throw new Error("file is required");
    }
    const fileName =
      file instanceof File ? file.name : "statement.pdf";
    const res = await accountingService.uploadStatementPdf({
      token,
      labClientId,
      from,
      to,
      notes,
      file,
      fileName,
    });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
