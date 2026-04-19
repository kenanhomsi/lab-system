"use client";

import { Select, TextInput } from "@mantine/core";
import { IconCalendar, IconFilter, IconPlus, IconSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { TablePageHeader } from "@/components/table-page-header";

type Props = {
  totalAppointments: number;
  visibleAppointments: number;
  hasActiveFilters: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  patientIdFilter: string;
  setPatientIdFilter: (value: string) => void;
  doctorIdFilter: string;
  setDoctorIdFilter: (value: string) => void;
  labPartnerIdFilter: string;
  setLabPartnerIdFilter: (value: string) => void;
  onOpenCreate: () => void;
  onResetFilters: () => void;
  statusOptions: string[];
};

const AppointmentsHeader = ({
  totalAppointments,
  hasActiveFilters,
  searchValue,
  setSearchValue,
  statusFilter,
  setStatusFilter,
  patientIdFilter,
  setPatientIdFilter,
  doctorIdFilter,
  setDoctorIdFilter,
  labPartnerIdFilter,
  setLabPartnerIdFilter,
  onOpenCreate,
  onResetFilters,
  statusOptions,
}: Props) => {
  const t = useTranslations("admin.appointments");

  return (
    <TablePageHeader
      title={t("title")}
      description={t("description")}
      icon={<IconCalendar size={22} />}
      iconColor="cyan"
      totalCount={totalAppointments}
      createLabel={t("createTitle")}
      createIcon={<IconPlus size={15} />}
      onOpenCreate={onOpenCreate}
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

      {/* Status */}
      <Select
        placeholder={t("status")}
        value={statusFilter || null}
        onChange={(v) => setStatusFilter(v || "")}
        clearable
        leftSection={<IconFilter size={13} />}
        radius="xl"
        size="xs"
        data={statusOptions.map((s) => ({ value: s, label: s }))}
        styles={{ input: { paddingInlineStart: 28 } }}
        style={{ minWidth: 150, flex: "0 0 auto" }}
      />

      {/* Patient ID */}
      <TextInput
        placeholder={t("patientId")}
        value={patientIdFilter}
        onChange={(e) => setPatientIdFilter(e.currentTarget.value)}
        radius="xl"
        size="xs"
        style={{ minWidth: 140, flex: "1 1 130px" }}
      />

      {/* Doctor ID */}
      <TextInput
        placeholder={t("doctorId")}
        value={doctorIdFilter}
        onChange={(e) => setDoctorIdFilter(e.currentTarget.value)}
        radius="xl"
        size="xs"
        style={{ minWidth: 130, flex: "1 1 120px" }}
      />

      {/* Lab Partner ID */}
      <TextInput
        placeholder={t("labPartnerId")}
        value={labPartnerIdFilter}
        onChange={(e) => setLabPartnerIdFilter(e.currentTarget.value)}
        radius="xl"
        size="xs"
        style={{ minWidth: 140, flex: "1 1 130px" }}
      />
    </TablePageHeader>
  );
};

export { AppointmentsHeader };
