import type { NextRequest } from "next/server";
import { proxySignalRHubRequest } from "@/lib/api/hub-proxy";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handleHubProxy(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  const { path } = await context.params;
  return proxySignalRHubRequest(request, path);
}

/** Runtime proxy for SignalR negotiate, SSE, and long-polling. */
export async function GET(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  return handleHubProxy(request, context);
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  return handleHubProxy(request, context);
}

export async function PUT(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  return handleHubProxy(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  return handleHubProxy(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  return handleHubProxy(request, context);
}

export async function OPTIONS(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  return handleHubProxy(request, context);
}
