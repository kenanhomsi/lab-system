"use client";

import { useState } from "react";
import {
  Button,
  Divider,
  Indicator,
  Loader,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { FiBell, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { useNotificationsList } from "@/features/push-notifications/hooks/use-notifications-list";
import { NotificationList } from "@/features/push-notifications/ui/notification-list";
import { getNotificationsViewAllHref } from "@/features/push-notifications/lib/notifications-page-href";
import { cn } from "@/lib/cn";

const DROPDOWN_PREVIEW_COUNT = 5;

type WebsiteNotificationsBellProps = {
  isDark?: boolean;
  className?: string;
};

export function WebsiteNotificationsBell({
  isDark = false,
  className,
}: WebsiteNotificationsBellProps) {
  const t = useTranslations("pushNotifications");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { data: session } = useSession();
  const viewAllHref = getNotificationsViewAllHref(session?.user?.roles);
  const [opened, setOpened] = useState(false);
  const {
    data,
    isLoading,
    error,
    unreadCount,
    markingIds,
    isMarkingAll,
    refresh,
    markAsRead,
    markAllAsRead,
  } = useNotificationsList({
    page: 1,
    pageSize: 10,
    enabled: true,
  });

  const previewItems = (data?.items ?? []).slice(0, DROPDOWN_PREVIEW_COUNT);
  const ViewAllChevron = isRtl ? FiChevronLeft : FiChevronRight;

  const handleOpenChange = (nextOpened: boolean) => {
    setOpened(nextOpened);
    if (nextOpened) {
      void refresh();
    }
  };

  return (
    <Menu
      shadow="lg"
      width={360}
      position="bottom-end"
      offset={12}
      opened={opened}
      onChange={handleOpenChange}
    >
      <Menu.Target>
        <Indicator
          inline
          disabled={unreadCount === 0}
          label={unreadCount > 9 ? "9+" : unreadCount}
          size={16}
          color="red"
          offset={4}
          processing={unreadCount > 0}
        >
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all",
              isDark
                ? "border-white/20 bg-white/10 text-on-surface hover:bg-white/15"
                : "border-slate-200 bg-white text-slate-700 shadow-sm shadow-slate-200/70 hover:bg-slate-50",
              className,
            )}
            aria-label={t("menuAria")}
            aria-expanded={opened}
            aria-haspopup="menu"
          >
            <FiBell size={18} />
          </button>
        </Indicator>
      </Menu.Target>

      <Menu.Dropdown>
        <div className="border-b border-slate-100 px-3 py-3">
          <Text fw={700} size="sm">
            {t("menuTitle")}
          </Text>
          {unreadCount > 0 ? (
            <Text size="xs" c="dimmed" mt={4}>
              {t("unreadBadge", { count: unreadCount })}
            </Text>
          ) : null}
        </div>

        <div className="px-3 py-2">
          <div className="mb-2 flex items-center justify-between gap-2">
            <Text size="xs" fw={700} tt="uppercase" c="dimmed">
              {t("recentTitle")}
            </Text>
            {unreadCount > 0 ? (
              <Button
                variant="subtle"
                size="compact-xs"
                color="cyan"
                loading={isMarkingAll}
                onClick={() => void markAllAsRead()}
              >
                {t("markAllRead")}
              </Button>
            ) : null}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader size="sm" color="cyan" />
            </div>
          ) : error ? (
            <Text size="xs" c="red" py="sm">
              {error}
            </Text>
          ) : (
            <NotificationList
              items={previewItems}
              compact
              markingIds={markingIds}
              onMarkAsRead={markAsRead}
            />
          )}
        </div>

        <Divider />

        <div className="p-1.5">
          <UnstyledButton
            component={Link}
            href={viewAllHref}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#009cc2] transition-colors hover:bg-[#009cc2]/8"
            onClick={() => setOpened(false)}
          >
            <span>{t("viewAll")}</span>
            <ViewAllChevron size={16} />
          </UnstyledButton>
        </div>
      </Menu.Dropdown>
    </Menu>
  );
}
