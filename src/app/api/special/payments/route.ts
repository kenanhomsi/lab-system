import { NextRequest, NextResponse } from "next/server";
import { isUpstreamBackendReady } from "@/lib/api/upstream-config";
import {
  mockSpecialPaymentsCreate,
  mockSpecialPaymentsList,
} from "@/lib/api/special-mock-store";

export async function GET(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

  if (isUpstreamBackendReady()) {
    try {
      const target = new URL(`${backendUrl}/special/payments`);
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
  return NextResponse.json(mockSpecialPaymentsList(from, to));
}

export async function POST(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

  try {
    const body = (await request.json()) as {
      date?: string;
      amount?: number;
      description?: string;
      note?: string;
    };

    if (
      !body?.date ||
      body.amount === undefined ||
      body.amount === null ||
      !body?.description
    ) {
      return NextResponse.json(
        { error: "date, amount, and description are required" },
        { status: 400 },
      );
    }

    if (isUpstreamBackendReady()) {
      const res = await fetch(`${backendUrl}/special/payments`, {
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

    const created = mockSpecialPaymentsCreate({
      date: body.date,
      amount: body.amount,
      description: body.description,
      note: body.note ?? "",
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
