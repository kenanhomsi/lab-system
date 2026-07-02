import { NextRequest, NextResponse } from "next/server";
import { AxiosError } from "axios";
import { jsonError } from "@/lib/api/bff-errors";
import { axiosInstanceBack } from "@/lib/clients/backend-instance";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

const extractUploadUrl = (payload: unknown): string | null => {
  if (typeof payload === "string" && payload.trim()) {
    return payload.trim();
  }
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const record = payload as Record<string, unknown>;
  if (typeof record.url === "string" && record.url.trim()) {
    return record.url.trim();
  }
  if (typeof record.imageUrl === "string" && record.imageUrl.trim()) {
    return record.imageUrl.trim();
  }
  if (record.data !== undefined) {
    return extractUploadUrl(record.data);
  }
  return null;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const file = body.get("file");
    if (!(file instanceof File)) {
      throw new Error("Missing image file");
    }
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("Image must be 10MB or smaller");
    }

    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const upstreamFormData = new FormData();
    upstreamFormData.append("file", file);

    const upstreamResponse = await axiosInstanceBack.request({
      method: "POST",
      url: "/api/admin/upload-image",
      data: upstreamFormData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const url = extractUploadUrl(upstreamResponse.data);
    if (!url) {
      throw new Error("Upload succeeded but no image URL was returned");
    }

    return NextResponse.json({ url });
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      return NextResponse.json(error.response.data ?? { message: error.message }, {
        status: error.response.status,
      });
    }
    return jsonError(error, 400);
  }
}
