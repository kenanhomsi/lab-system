import { NextRequest, NextResponse } from "next/server";
import { AxiosError, Method } from "axios";
import { axiosInstanceBack } from "@/lib/clients/backend-instance";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

type ProxyBackendParams = {
  method: Method;
  path: string;
  body?: unknown;
};

export async function proxyBackendRequest(
  req: NextRequest,
  { method, path, body }: ProxyBackendParams,
) {
  const token = await resolveAccessToken(req);
  if (!token) {
    throw new Error("Missing authorization token");
  }

  const query = req.nextUrl.searchParams.toString();
  const endpoint = query ? `${path}?${query}` : path;

  try {
    const response = await axiosInstanceBack.request({
      method,
      url: endpoint,
      data: body,
      headers: { Authorization: `Bearer ${token}` },
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
