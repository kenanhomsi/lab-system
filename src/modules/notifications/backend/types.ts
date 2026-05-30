import type {
  RegisterDeviceTokenBody,
  UnregisterDeviceTokenBody,
} from "../schemas";

export type RegisterDeviceTokenParams = RegisterDeviceTokenBody & {
  token: string;
};

export type UnregisterDeviceTokenParams = UnregisterDeviceTokenBody & {
  token: string;
};
