import type {
  DeviceType,
  RegisterDeviceTokenBody,
  SendNotificationBody,
  UnregisterDeviceTokenBody,
} from "../schemas";

export type RegisterDeviceTokenParams = RegisterDeviceTokenBody;

export type UnregisterDeviceTokenParams = UnregisterDeviceTokenBody;

export type GetNotificationsParams = {
  page?: number;
  pageSize?: number;
};

export type SendNotificationParams = SendNotificationBody;

export type MarkNotificationReadParams = {
  id: number;
};

export type { DeviceType };
