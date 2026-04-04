import { NextRequest, NextResponse } from "next/server";
import { isUpstreamBackendReady } from "@/lib/api/upstream-config";
import {
  mockSpecialTasksCreate,
  mockSpecialTasksList,
} from "@/lib/api/special-mock-store";

export async function GET(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

  if (isUpstreamBackendReady()) {
    try {
      const target = new URL(`${backendUrl}/special/tasks`);
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

  return NextResponse.json(mockSpecialTasksList());
}

export async function POST(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

  try {
    const body = (await request.json()) as {
      title?: string;
      description?: string;
      dueDate?: string;
      dueTime?: string;
      reminderEnabled?: boolean;
    };

    if (!body?.title?.trim() || !body?.dueDate) {
      return NextResponse.json(
        { error: "title and dueDate are required" },
        { status: 400 },
      );
    }

    if (isUpstreamBackendReady()) {
      const res = await fetch(`${backendUrl}/special/tasks`, {
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

    const created = mockSpecialTasksCreate({
      title: body.title.trim(),
      description: body.description ?? "",
      dueDate: body.dueDate,
      dueTime: body.dueTime ?? "",
      reminderEnabled: Boolean(body.reminderEnabled),
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
