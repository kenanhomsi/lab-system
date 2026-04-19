import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

async function requestToBackend(
  method: string,
  path: string,
  token: string,
  body?: FormData | object,
) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const isUpstreamReady = process.env.UPSTREAM_BACKEND_READY === "true";

  if (!isUpstreamReady) {
    throw new Error("Backend is not ready");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    if (body instanceof FormData) {
      options.body = body;
    } else {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${backendUrl}${path}`, options);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Backend error: ${response.status} - ${error}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return await response.json();
  }

  return response;
}

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const query = Object.fromEntries(req.nextUrl.searchParams.entries());
    const queryString = new URLSearchParams(query).toString();
    const path = `/banners?${queryString}`;

    const res = await requestToBackend("GET", path, token);
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

    const contentType = req.headers.get("content-type");
    let body: FormData | object;

    if (contentType?.includes("multipart/form-data")) {
      body = await req.formData();
    } else {
      body = await req.json();
    }

    const res = await requestToBackend("POST", "/banners", token, body);
    return NextResponse.json(res, { status: 201 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      throw new Error("Missing banner ID");
    }

    const contentType = req.headers.get("content-type");
    let body: FormData | object;

    if (contentType?.includes("multipart/form-data")) {
      body = await req.formData();
    } else {
      body = await req.json();
    }

    const res = await requestToBackend("PUT", `/banners/${id}`, token, body);
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      throw new Error("Missing banner ID");
    }

    await requestToBackend("DELETE", `/banners/${id}`, token);
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
