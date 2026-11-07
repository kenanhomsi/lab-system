import { type NextRequest, NextResponse } from "next/server";
import { filterMockDoctorPatients } from "@/lib/api/doctor-patients-mock";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  const from = request.nextUrl.searchParams.get("from");
  const to = request.nextUrl.searchParams.get("to");

  if (isUpstreamReady) {
    try {
      const target = new URL(`${backendUrl}/api/doctors/${encodeURIComponent(id)}/patients`);
      if (from) target.searchParams.set("from", from);
      if (to) target.searchParams.set("to", to);
      const token = await resolveAccessToken(request);
      const res = await fetch(target.toString(), {
        cache: "no-store",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        return NextResponse.json(
          { error: "Upstream request failed" },
          { status: res.status },
        );
      }
      const payload = await res.json();
      const data = payload && typeof payload === "object" && "data" in payload
        ? (payload as { data: unknown }).data
        : payload;
      return NextResponse.json(data);
    } catch {
      return NextResponse.json({ error: "Upstream unavailable" }, { status: 502 });
    }
  }

  const { patients, totalAmount } = filterMockDoctorPatients(from, to);
  return NextResponse.json({ patients, totalAmount });
}
