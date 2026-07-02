import type {
  RegisterDeviceTokenBody,
  SendNotificationBody,
  UnregisterDeviceTokenBody,
} from "../schemas";

export type RegisterDeviceTokenParams = RegisterDeviceTokenBody & {
  token: string;
};

export type UnregisterDeviceTokenParams = UnregisterDeviceTokenBody & {
  token: string;
};

export type GetNotificationsParams = {
  token: string;
  page?: number;
  pageSize?: number;
};

export type SendNotificationParams = SendNotificationBody & {
  token: string;
};

export type MarkNotificationReadParams = {
  id: number;
  token: string;
};
