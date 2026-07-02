import { NextRequest } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { forwardMultipartToBackend } from "@/lib/api/forward-multipart";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    return forwardMultipartToBackend(
      req,
      `/api/test-results/for-test-request/${id}`,
      "POST",
    );
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
