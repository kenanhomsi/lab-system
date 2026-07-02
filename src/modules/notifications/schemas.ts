import { z } from "zod";

export const deviceTypeSchema = z.enum(["Web", "Android", "iOS"]);

export const registerDeviceTokenSchema = z.object({
  fcmToken: z.string().min(1),
  deviceType: deviceTypeSchema,
});

export const unregisterDeviceTokenSchema = z.object({
  fcmToken: z.string().min(1),
});

export const userNotificationSchema = z
  .object({
    id: z.number(),
    title: z.string().nullable().optional(),
    body: z.string().nullable().optional(),
    data: z.record(z.string(), z.string()).nullable().optional(),
    isRead: z.boolean().optional(),
    createdAt: z.string().nullable().optional(),
    readAt: z.string().nullable().optional(),
  })
  .passthrough();

export const paginatedNotificationsSchema = z
  .object({
    items: z.array(userNotificationSchema).optional(),
    page: z.number().optional(),
    pageSize: z.number().optional(),
    totalCount: z.number().optional(),
    totalPages: z.number().optional(),
    hasNextPage: z.boolean().optional(),
    hasPreviousPage: z.boolean().optional(),
  })
  .passthrough();

export const sendNotificationSchema = z
  .object({
    title: z.string().min(1),
    body: z.string().min(1),
    targetUserId: z.string().optional(),
    targetRole: z.string().optional(),
    data: z.record(z.string(), z.string()).optional(),
  })
  .refine(
    (value) =>
      Boolean(value.targetUserId?.trim()) || Boolean(value.targetRole?.trim()),
    { message: "Either targetUserId or targetRole is required" },
  );

export type RegisterDeviceTokenBody = z.infer<typeof registerDeviceTokenSchema>;
export type UnregisterDeviceTokenBody = z.infer<
  typeof unregisterDeviceTokenSchema
>;
export type DeviceType = z.infer<typeof deviceTypeSchema>;
export type UserNotification = z.infer<typeof userNotificationSchema>;
export type PaginatedNotifications = {
  items: UserNotification[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
export type SendNotificationBody = z.infer<typeof sendNotificationSchema>;
