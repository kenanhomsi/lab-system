"use client";

import { CloseButton, Select, TextInput } from "@mantine/core";
import { IconFilter, IconSearch, IconBriefcase } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { TablePageHeader } from "@/components/table-page-header";
import type { EmploymentApplicationStatus } from "../types";

type Props = {
  totalApplications: number;
  hasActiveFilters: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  statusFilter: "all" | EmploymentApplicationStatus;
  setStatusFilter: (value: "all" | EmploymentApplicationStatus) => void;
  onResetFilters: () => void;
};

const EmploymentApplicationsHeader = ({
  totalApplications,
  hasActiveFilters,
  searchValue,
  setSearchValue,
  statusFilter,
  setStatusFilter,
  onResetFilters,
}: Props) => {
  const t = useTranslations("admin.employmentApplications");

  return (
    <TablePageHeader
      title={t("title")}
      description={t("description")}
      icon={<IconBriefcase size={22} />}
      iconColor="blue"
      totalCount={totalApplications}
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
        placeholder={t("allStatuses")}
        value={statusFilter}
        onChange={(v) => setStatusFilter((v as "all" | EmploymentApplicationStatus) || "all")}
        leftSection={<IconFilter size={13} />}
        radius="xl"
        size="xs"
        data={[
          { value: "all", label: t("allStatuses") },
          { value: "New", label: t("statusNew") },
          { value: "InReview", label: t("statusInReview") },
          { value: "Accepted", label: t("statusAccepted") },
          { value: "Rejected", label: t("statusRejected") },
        ]}
        styles={{ input: { paddingInlineStart: 28 } }}
        style={{ minWidth: 150, flex: "0 0 auto" }}
      />
    </TablePageHeader>
  );
};

export { EmploymentApplicationsHeader };
