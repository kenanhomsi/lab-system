import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { backendContainer } from "@/container";
import {
  NotificationsBackendService,
  notificationsModuleNames,
  registerDeviceTokenSchema,
  unregisterDeviceTokenSchema,
} from "@/modules/notifications";

const notificationsService = backendContainer.get<NotificationsBackendService>(
  notificationsModuleNames.service,
);

export async function POST(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const body: unknown = await req.json();
    const parsed = registerDeviceTokenSchema.parse(body);

    await notificationsService.registerDeviceToken({
      token,
      fcmToken: parsed.fcmToken,
      deviceType: parsed.deviceType,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development" && isAxiosError(error)) {
      console.error(
        "[BFF] POST /api/notifications/device-tokens upstream:",
        error.response?.status,
        error.response?.data,
      );
    }
    return jsonError(error, 400);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const body: unknown = await req.json();
    const parsed = unregisterDeviceTokenSchema.parse(body);

    await notificationsService.unregisterDeviceToken({
      token,
      fcmToken: parsed.fcmToken,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development" && isAxiosError(error)) {
      console.error(
        "[BFF] DELETE /api/notifications/device-tokens upstream:",
        error.response?.status,
        error.response?.data,
      );
    }
    return jsonError(error, 400);
  }
}
