import { NextResponse } from "next/server";
import { axiosInstanceBack } from "@/lib/clients/backend-instance";
import { jsonError } from "@/lib/api/bff-errors";

export async function GET() {
  try {
    const response = await axiosInstanceBack.get("/api/auth/phone-otp/config");
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return jsonError(error);
  }
}
