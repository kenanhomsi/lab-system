import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { backendContainer } from "@/container";
import {
  NotificationsBackendService,
  notificationsModuleNames,
} from "@/modules/notifications";

const notificationsService = backendContainer.get<NotificationsBackendService>(
  notificationsModuleNames.service,
);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const { id } = await params;
    const notificationId = Number(id);
    if (!Number.isFinite(notificationId) || notificationId <= 0) {
      throw new Error("Invalid notification id");
    }

    await notificationsService.markNotificationRead({
      token,
      id: notificationId,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development" && isAxiosError(error)) {
      console.error(
        "[BFF] POST /api/notifications/[id]/read upstream:",
        error.response?.status,
        error.response?.data,
      );
    }
    return jsonError(error, 400);
  }
}
