import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
    const target = new URL(`${backendUrl}/api/employment-applications`);
    req.nextUrl.searchParams.forEach((value, key) => {
      target.searchParams.set(key, value);
    });

    const res = await fetch(target.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream request failed" },
        { status: res.status },
      );
    }
    return NextResponse.json(await res.json());
  } catch (error: unknown) {
    return jsonError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
    const formData = await req.formData();

    const res = await fetch(`${backendUrl}/api/employment-applications`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: errorText || "Application failed" },
        { status: res.status },
      );
    }
    return NextResponse.json(await res.json(), {
      status: res.status === 201 ? 201 : 200,
    });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
