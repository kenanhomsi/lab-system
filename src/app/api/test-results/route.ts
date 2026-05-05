import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import {
  TestResultBackendService,
  testResultModuleNames,
} from "@/modules/TestResults";

const testResultService = backendContainer.get<TestResultBackendService>(
  testResultModuleNames.service,
);

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const query = Object.fromEntries(req.nextUrl.searchParams.entries());
    const res = await testResultService.findAll({ token, query });
    console.log("res in next route", res);
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const body = (await req.json()) as Record<string, unknown>;
    const testRequestId = Number(body.testRequestId);
    if (!Number.isFinite(testRequestId)) {
      throw new Error("testRequestId is required and must be a number");
    }
    const res = await testResultService.create({
      token,
      testRequestId,
      resultDate: String(body.resultDate ?? ""),
      resultData: String(body.resultData ?? ""),
      pdfUrl: String(body.pdfUrl ?? ""),
      status: String(body.status ?? ""),
    });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
