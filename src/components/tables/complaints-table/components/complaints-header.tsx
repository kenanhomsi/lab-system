"use client";

import { Select, TextInput } from "@mantine/core";
import { IconFilter, IconSearch, IconMessage } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { TablePageHeader } from "@/components/table-page-header";
import { ComplaintStatus } from "../types";

type Props = {
  totalComplaints: number;
  visibleComplaints: number;
  hasActiveFilters: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  statusFilter: "all" | ComplaintStatus;
  setStatusFilter: (value: "all" | ComplaintStatus) => void;
  userIdFilter: string;
  setUserIdFilter: (value: string) => void;
  onResetFilters: () => void;
};

const ComplaintsHeader = ({
  totalComplaints,
  hasActiveFilters,
  searchValue,
  setSearchValue,
  statusFilter,
  setStatusFilter,
  userIdFilter,
  setUserIdFilter,
  onResetFilters,
}: Props) => {
  const t = useTranslations("admin.complaints");

  return (
    <TablePageHeader
      title={t("title")}
      description={t("description")}
      icon={<IconMessage size={22} />}
      iconColor="orange"
      totalCount={totalComplaints}
      hasActiveFilters={hasActiveFilters}
      onResetFilters={onResetFilters}
    >
      {/* Search */}
      <TextInput
        placeholder={t("searchPlaceholder")}
        value={searchValue}
        onChange={(e) => setSearchValue(e.currentTarget.value)}
        leftSection={<IconSearch size={14} />}
        rightSection={
          searchValue ? (
            <TextInput.ClearButton onClick={() => setSearchValue("")} />
          ) : null
        }
        rightSectionPointerEvents="auto"
        radius="xl"
        size="xs"
        style={{ flex: "1 1 220px", minWidth: 200 }}
      />

      {/* User ID */}
      <TextInput
        placeholder={t("userIdPlaceholder")}
        value={userIdFilter}
        onChange={(e) => setUserIdFilter(e.currentTarget.value)}
        radius="xl"
        size="xs"
        style={{ minWidth: 170, flex: "1 1 160px" }}
      />

      {/* Status */}
      <Select
        placeholder={t("allStatuses")}
        value={statusFilter}
        onChange={(v) => setStatusFilter((v as "all" | ComplaintStatus) || "all")}
        leftSection={<IconFilter size={13} />}
        radius="xl"
        size="xs"
        data={[
          { value: "all", label: t("allStatuses") },
          { value: "received", label: t("received") },
          { value: "in_progress", label: t("inProgress") },
          { value: "resolved", label: t("resolved") },
        ]}
        styles={{ input: { paddingInlineStart: 28 } }}
        style={{ minWidth: 150, flex: "0 0 auto" }}
      />
    </TablePageHeader>
  );
};

export { ComplaintsHeader };
