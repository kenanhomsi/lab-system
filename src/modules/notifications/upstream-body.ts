import type {
  DeviceType,
  RegisterDeviceTokenBody,
  SendNotificationBody,
} from "./schemas";

/** Upstream .NET API JSON body (PascalCase property names). */
export type UpstreamRegisterDeviceTokenBody = {
  FcmToken: string;
  DeviceType: DeviceType;
};

export type UpstreamUnregisterDeviceTokenBody = {
  FcmToken: string;
};

export type UpstreamSendNotificationBody = {
  Title: string;
  Body: string;
  TargetUserId?: string;
  TargetRole?: string;
  Data?: Record<string, string>;
};

export function toUpstreamRegisterBody(
  body: RegisterDeviceTokenBody,
): UpstreamRegisterDeviceTokenBody {
  return {
    FcmToken: body.fcmToken,
    DeviceType: body.deviceType,
  };
}

export function toUpstreamUnregisterBody(fcmToken: string): UpstreamUnregisterDeviceTokenBody {
  return { FcmToken: fcmToken };
}

export function toUpstreamSendBody(
  body: SendNotificationBody,
): UpstreamSendNotificationBody {
  return {
    Title: body.title,
    Body: body.body,
    ...(body.targetUserId?.trim()
      ? { TargetUserId: body.targetUserId.trim() }
      : {}),
    ...(body.targetRole?.trim() ? { TargetRole: body.targetRole.trim() } : {}),
    ...(body.data && Object.keys(body.data).length > 0 ? { Data: body.data } : {}),
  };
}
