import { z } from "zod";

export const deviceTypeSchema = z.enum(["Web", "Android", "iOS"]);

export const registerDeviceTokenSchema = z.object({
  fcmToken: z.string().min(1),
  deviceType: deviceTypeSchema,
});

export const unregisterDeviceTokenSchema = z.object({
  fcmToken: z.string().min(1),
});

export type RegisterDeviceTokenBody = z.infer<typeof registerDeviceTokenSchema>;
export type UnregisterDeviceTokenBody = z.infer<
  typeof unregisterDeviceTokenSchema
>;
export type DeviceType = z.infer<typeof deviceTypeSchema>;
