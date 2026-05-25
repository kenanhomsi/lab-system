import { type NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ messageId: string }> },
) {
  const { messageId } = await params;
  const authorization = req.headers.get("authorization") ?? "";
  const backendUrl = (
    process.env.BACKEND_URL?.trim() || "http://localhost:4000"
  ).replace(/\/+$/, "");

  await fetch(`${backendUrl}/api/chat/messages/${messageId}/read`, {
    method: "POST",
    headers: { Authorization: authorization },
  });

  return new NextResponse(null, { status: 204 });
}
