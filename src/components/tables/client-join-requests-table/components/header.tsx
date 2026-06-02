"use client";

import { CloseButton, Select, TextInput } from "@mantine/core";
import { IconFilter, IconSearch, IconUsers } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { CLIENT_JOIN_REQUEST_STATUSES } from "@/lib/client-join-request-status";
import { TablePageHeader } from "@/components/table-page-header";
import type { ClientJoinRequestStatus } from "../types";

type Props = {
  totalCount: number;
  hasActiveFilters: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  statusFilter: "all" | ClientJoinRequestStatus;
  setStatusFilter: (value: "all" | ClientJoinRequestStatus) => void;
  onResetFilters: () => void;
};

const ClientJoinRequestsHeader = ({
  totalCount,
  hasActiveFilters,
  searchValue,
  setSearchValue,
  statusFilter,
  setStatusFilter,
  onResetFilters,
}: Props) => {
  const t = useTranslations("admin.clientJoinRequests");

  const statusOptions = [
    { value: "all", label: t("filterAll") },
    ...CLIENT_JOIN_REQUEST_STATUSES.map((status) => ({
      value: status,
      label: t(`status${status}` as "statusNew"),
    })),
  ];

  return (
    <TablePageHeader
      title={t("title")}
      description={t("description")}
      icon={<IconUsers size={22} />}
      iconColor="teal"
      totalCount={totalCount}
      hasActiveFilters={hasActiveFilters}
      onResetFilters={onResetFilters}
    >
      <TextInput
        placeholder={t("searchPlaceholder")}
        value={searchValue}
        onChange={(e) => setSearchValue(e.currentTarget.value)}
        leftSection={<IconSearch size={14} />}
        rightSection={
          searchValue ? (
            <CloseButton size="sm" onClick={() => setSearchValue("")} aria-label="Clear" />
          ) : null
        }
        rightSectionPointerEvents="auto"
        radius="xl"
        size="xs"
        style={{ flex: "1 1 220px", minWidth: 200 }}
      />
      <Select
        placeholder={t("filterStatus")}
        value={statusFilter}
        onChange={(v) =>
          setStatusFilter((v as "all" | ClientJoinRequestStatus) || "all")
        }
        leftSection={<IconFilter size={13} />}
        radius="xl"
        size="xs"
        data={statusOptions}
        styles={{ input: { paddingInlineStart: 28 } }}
        style={{ minWidth: 160, flex: "0 0 auto" }}
      />
    </TablePageHeader>
  );
};

export { ClientJoinRequestsHeader };
