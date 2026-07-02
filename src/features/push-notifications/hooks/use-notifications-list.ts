"use client";

import { useCallback, useEffect, useState } from "react";
import { extractErrorMessage } from "@/lib/error";
import type { PaginatedNotifications, UserNotification } from "@/modules/notifications";
import { getNotificationsService } from "../lib/notifications-api";

type UseNotificationsListOptions = {
  page?: number;
  pageSize?: number;
  enabled?: boolean;
};

type UseNotificationsListResult = {
  data: PaginatedNotifications | null;
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
  markingIds: Set<number>;
  isMarkingAll: boolean;
  refresh: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

const markItemRead = (items: UserNotification[], id: number): UserNotification[] =>
  items.map((item) =>
    item.id === id
      ? {
          ...item,
          isRead: true,
          readAt: item.readAt ?? new Date().toISOString(),
        }
      : item,
  );

export function useNotificationsList(
  options: UseNotificationsListOptions = {},
): UseNotificationsListResult {
  const { page = 1, pageSize = 20, enabled = true } = options;
  const [data, setData] = useState<PaginatedNotifications | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markingIds, setMarkingIds] = useState<Set<number>>(() => new Set());
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const refresh = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getNotificationsService().getNotifications({
        page,
        pageSize,
      });
      setData(response);
    } catch (err: unknown) {
      setError(extractErrorMessage(err, "Failed to load notifications"));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, page, pageSize]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const markAsRead = useCallback(async (id: number) => {
    const currentItem = data?.items.find((item) => item.id === id);
    if (!currentItem || currentItem.isRead !== false) {
      return;
    }

    const previousData = data;

    setMarkingIds((current) => new Set(current).add(id));
    setData((current) =>
      current
        ? {
            ...current,
            items: markItemRead(current.items, id),
          }
        : current,
    );

    try {
      await getNotificationsService().markNotificationRead({ id });
    } catch (err: unknown) {
      setData(previousData);
      setError(extractErrorMessage(err, "Failed to mark notification as read"));
      throw err;
    } finally {
      setMarkingIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  }, [data]);

  const markAllAsRead = useCallback(async () => {
    const unreadIds = (data?.items ?? [])
      .filter((item) => item.isRead === false)
      .map((item) => item.id);

    if (unreadIds.length === 0) {
      return;
    }

    const previousData = data;
    setIsMarkingAll(true);
    setMarkingIds(new Set(unreadIds));
    setData((current) =>
      current
        ? {
            ...current,
            items: unreadIds.reduce(
              (items, id) => markItemRead(items, id),
              current.items,
            ),
          }
        : current,
    );

    try {
      const service = getNotificationsService();
      await Promise.all(unreadIds.map((id) => service.markNotificationRead({ id })));
    } catch (err: unknown) {
      setData(previousData);
      setError(extractErrorMessage(err, "Failed to mark notifications as read"));
      throw err;
    } finally {
      setIsMarkingAll(false);
      setMarkingIds(new Set());
    }
  }, [data]);

  const unreadCount = data?.items.filter((item) => !item.isRead).length ?? 0;

  return {
    data,
    isLoading,
    error,
    unreadCount,
    markingIds,
    isMarkingAll,
    refresh,
    markAsRead,
    markAllAsRead,
  };
}
