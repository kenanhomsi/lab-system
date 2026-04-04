import { NextRequest, NextResponse } from "next/server";
import { isUpstreamBackendReady } from "@/lib/api/upstream-config";
import {
  mockSpecialExpensesCreate,
  mockSpecialExpensesList,
} from "@/lib/api/special-mock-store";

export async function GET(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

  if (isUpstreamBackendReady()) {
    try {
      const target = new URL(`${backendUrl}/special/expenses`);
      request.nextUrl.searchParams.forEach((value, key) => {
        target.searchParams.set(key, value);
      });
      const res = await fetch(target.toString(), { cache: "no-store" });
      if (!res.ok) {
        return NextResponse.json(
          { error: "Upstream request failed" },
          { status: res.status },
        );
      }
      return NextResponse.json(await res.json());
    } catch {
      return NextResponse.json({ error: "Upstream unavailable" }, { status: 502 });
    }
  }

  const from = request.nextUrl.searchParams.get("from");
  const to = request.nextUrl.searchParams.get("to");
  return NextResponse.json(mockSpecialExpensesList(from, to));
}

export async function POST(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

  try {
    const body = (await request.json()) as {
      date?: string;
      amount?: number;
      expenseType?: string;
      note?: string;
    };

    if (
      !body?.date ||
      body.amount === undefined ||
      body.amount === null ||
      !body?.expenseType
    ) {
      return NextResponse.json(
        { error: "date, amount, and expenseType are required" },
        { status: 400 },
      );
    }

    if (isUpstreamBackendReady()) {
      const res = await fetch(`${backendUrl}/special/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { error: (payload as { message?: string }).message || "Create failed" },
          { status: res.status },
        );
      }
      return NextResponse.json(payload, { status: res.status === 201 ? 201 : 200 });
    }

    const created = mockSpecialExpensesCreate({
      date: body.date,
      amount: body.amount,
      expenseType: body.expenseType,
      note: body.note ?? "",
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
