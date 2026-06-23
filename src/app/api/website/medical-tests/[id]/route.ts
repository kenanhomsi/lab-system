import { NextResponse } from "next/server";
import {
  fetchUpstreamMedicalTestDetail,
  parsePublicMedicalTestDetail,
} from "@/lib/api/public-medical-tests";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: Request, context: RouteContext) {
  const { id } = await context.params;
  const upstream = await fetchUpstreamMedicalTestDetail(id);

  if (!upstream.ok) {
    const status = upstream.status === 401 ? 503 : upstream.status;
    return NextResponse.json(
      {
        error:
          upstream.status === 401
            ? "upstream_unauthorized"
            : upstream.reason === "disabled"
              ? "upstream_disabled"
              : "upstream_unavailable",
      },
      { status },
    );
  }

  const item = parsePublicMedicalTestDetail(upstream.payload);
  if (!item) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json(item);
}
