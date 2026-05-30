import type { DeviceType, RegisterDeviceTokenBody } from "./schemas";

/** Upstream .NET API JSON body (PascalCase property names). */
export type UpstreamRegisterDeviceTokenBody = {
  FcmToken: string;
  DeviceType: DeviceType;
};

export type UpstreamUnregisterDeviceTokenBody = {
  FcmToken: string;
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
