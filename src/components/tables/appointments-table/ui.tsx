"use client";

import { Stack } from "@mantine/core";
import { Table } from "@/components/table";
import { AppointmentsHeader } from "./components";
import { useMirror } from "./store";

const UI = () => {
  const schema = useMirror("schema");
  const isLoading = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const appointmentsData = useMirror("appointmentsData");

  const searchValue = useMirror("searchValue");
  const setSearchValue = useMirror("setSearchValue");
  const statusFilter = useMirror("statusFilter");
  const setStatusFilter = useMirror("setStatusFilter");
  const patientIdFilter = useMirror("patientIdFilter");
  const setPatientIdFilter = useMirror("setPatientIdFilter");
  const doctorIdFilter = useMirror("doctorIdFilter");
  const setDoctorIdFilter = useMirror("setDoctorIdFilter");
  const labPartnerIdFilter = useMirror("labPartnerIdFilter");
  const setLabPartnerIdFilter = useMirror("setLabPartnerIdFilter");
  const setActiveModal = useMirror("setActiveModal");
  const statusOptions = useMirror("statusOptions");

  const hasActiveFilters =
    Boolean(searchValue.trim()) ||
    Boolean(statusFilter.trim()) ||
    Boolean(patientIdFilter.trim()) ||
    Boolean(doctorIdFilter.trim()) ||
    Boolean(labPartnerIdFilter.trim());

  return (
    <Stack>
      <Table
        type="normal"
        isLoading={isLoading}
        schema={schema}
        OnPageNumberChange={setPageNumber}
        data={appointmentsData.items || []}
        paginationStatic={{
          count: appointmentsData.totalCount || 0,
          limit: appointmentsData.pageSize || 20,
          page: appointmentsData.page || 1,
        }}
      >
        <Table.Header>
          <AppointmentsHeader
            totalAppointments={appointmentsData.totalCount || 0}
            visibleAppointments={appointmentsData.items?.length || 0}
            hasActiveFilters={hasActiveFilters}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            patientIdFilter={patientIdFilter}
            setPatientIdFilter={setPatientIdFilter}
            doctorIdFilter={doctorIdFilter}
            setDoctorIdFilter={setDoctorIdFilter}
            labPartnerIdFilter={labPartnerIdFilter}
            setLabPartnerIdFilter={setLabPartnerIdFilter}
            onOpenCreate={() => setActiveModal("create")}
            onResetFilters={() => {
              setSearchValue("");
              setStatusFilter("");
              setPatientIdFilter("");
              setDoctorIdFilter("");
              setLabPartnerIdFilter("");
              setPageNumber(1);
            }}
            statusOptions={statusOptions}
          />
        </Table.Header>
      </Table>
    </Stack>
  );
};

export { UI };
