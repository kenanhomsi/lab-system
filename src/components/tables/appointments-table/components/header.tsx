"use client";

import { CloseButton, Select, TextInput } from "@mantine/core";
import { IconCalendarCheck, IconFilter, IconSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { TablePageHeader } from "@/components/table-page-header";

type Props = {
  totalAppointments: number;
  hasActiveFilters: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  statusFilter: "all" | string;
  setStatusFilter: (value: "all" | string) => void;
  onResetFilters: () => void;
};

/**
 * Header for the blood draw appointments table.
 */
const Header = ({
  totalAppointments,
  hasActiveFilters,
  searchValue,
  setSearchValue,
  statusFilter,
  setStatusFilter,
  onResetFilters,
}: Props) => {
  const t = useTranslations("admin.bloodDrawAppointments");

  return (
    <TablePageHeader
      title={t("title")}
      description={t("subtitle")}
      icon={<IconCalendarCheck size={22} />}
      iconColor="blue"
      totalCount={totalAppointments}
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
            <CloseButton size="sm" onClick={() => setSearchValue("")} aria-label={t("clearSearch")} />
          ) : null
        }
        rightSectionPointerEvents="auto"
        radius="xl"
        size="xs"
        style={{ flex: "1 1 240px", minWidth: 200 }}
      />
      <Select
        placeholder={t("allStatuses")}
        value={statusFilter}
        onChange={(value) => setStatusFilter(value || "all")}
        leftSection={<IconFilter size={13} />}
        radius="xl"
        size="xs"
        data={[
          { value: "all", label: t("allStatuses") },
          { value: "SCHEDULED", label: t("statusScheduled") },
          { value: "CONFIRMED", label: t("statusConfirmed") },
          { value: "PENDING", label: t("statusPending") },
          { value: "COMPLETED", label: t("statusCompleted") },
          { value: "CANCELLED", label: t("statusCancelled") },
        ]}
        styles={{ input: { paddingInlineStart: 28 } }}
        style={{ minWidth: 150, flex: "0 0 auto" }}
      />
    </TablePageHeader>
  );
};

export { Header as AppointmentsHeader };
