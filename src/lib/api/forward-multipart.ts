import { NextRequest, NextResponse } from "next/server";
import { AxiosError } from "axios";
import { axiosInstanceBack } from "@/lib/clients/backend-instance";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

export async function forwardMultipartToBackend(
  req: NextRequest,
  upstreamPath: string,
  method: "POST" | "PUT" = "POST",
) {
  const token = await resolveAccessToken(req);
  if (!token) {
    throw new Error("Missing authorization token");
  }

  const formData = await req.formData();

  try {
    const response = await axiosInstanceBack.request({
      method,
      url: upstreamPath,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(response.data ?? null, { status: response.status });
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return NextResponse.json(error.response.data ?? { message: error.message }, {
        status: error.response.status,
      });
    }
    throw error;
  }
}
