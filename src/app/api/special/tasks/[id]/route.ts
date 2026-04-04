import { NextRequest, NextResponse } from "next/server";
import { isUpstreamBackendReady } from "@/lib/api/upstream-config";
import type { SpecialTaskPatch } from "@/lib/api/special-mock-store";
import {
  mockSpecialTasksDelete,
  mockSpecialTasksUpdate,
} from "@/lib/api/special-mock-store";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const { id } = await context.params;

  try {
    const body = (await request.json()) as SpecialTaskPatch;

    if (isUpstreamBackendReady()) {
      const res = await fetch(`${backendUrl}/special/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { error: (payload as { message?: string }).message || "Update failed" },
          { status: res.status },
        );
      }
      return NextResponse.json(payload);
    }

    const row = mockSpecialTasksUpdate(id, body);
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(row);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const { id } = await context.params;

  if (isUpstreamBackendReady()) {
    try {
      const res = await fetch(`${backendUrl}/special/tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        const payload = await res.json().catch(() => ({}));
        return NextResponse.json(
          { error: (payload as { message?: string }).message || "Delete failed" },
          { status: res.status },
        );
      }
      return new NextResponse(null, { status: 204 });
    } catch {
      return NextResponse.json({ error: "Upstream unavailable" }, { status: 502 });
    }
  }

  const ok = mockSpecialTasksDelete(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
