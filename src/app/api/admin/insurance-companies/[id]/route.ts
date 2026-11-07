import { type NextRequest, NextResponse } from "next/server";
import { axiosInstanceBack } from "@/lib/clients/backend-instance";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { jsonError } from "@/lib/api/bff-errors";

const auth = async (request: NextRequest) => {
  const token = await resolveAccessToken(request);
  if (!token) throw new Error("Missing authorization token");
  return { Authorization: `Bearer ${token}` };
};

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const response = await axiosInstanceBack.put(`/api/admin/insurance-companies/${id}`, await request.json(), { headers: await auth(request) });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await axiosInstanceBack.delete(`/api/admin/insurance-companies/${id}`, { headers: await auth(request) });
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    return jsonError(error);
  }
}
