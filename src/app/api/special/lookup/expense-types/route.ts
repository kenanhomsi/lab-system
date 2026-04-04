import { NextRequest, NextResponse } from "next/server";
import { isUpstreamBackendReady } from "@/lib/api/upstream-config";
import { MOCK_EXPENSE_TYPE_LOOKUP } from "@/lib/api/special-mock-store";

export async function GET(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

  if (isUpstreamBackendReady()) {
    try {
      const target = new URL(`${backendUrl}/special/lookup/expense-types`);
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

  return NextResponse.json({ items: MOCK_EXPENSE_TYPE_LOOKUP });
}
