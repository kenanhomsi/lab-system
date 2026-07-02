"use client";

import type { ReactNode } from "react";
import {
  Anchor,
  Badge,
  Box,
  Divider,
  Group,
  Loader,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconExternalLink, IconPaperclip } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { appointmentsClient } from "@/modules/appointments";
import { getMedicalTestNamesLabel } from "../get-medical-test-names-label";
import { useMirror } from "../store";
import type { TestRequestItem } from "../types";

const DetailField = ({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) => (
  <Group align="flex-start" wrap="nowrap" gap="sm">
    <Text size="sm" fw={600} miw={140}>
      {label}
    </Text>
    <Text size="sm" style={{ flex: 1 }}>
      {value}
    </Text>
  </Group>
);

const RequestDetails = ({
  testRequest,
  t,
}: {
  testRequest: TestRequestItem;
  t: (key: string) => string;
}) => {
  const testsLabel = getMedicalTestNamesLabel(testRequest) || "—";
  const notes = testRequest.notes == null ? "" : String(testRequest.notes).trim();
  const metadata = testRequest.metadata == null ? "" : String(testRequest.metadata).trim();

  return (
    <Stack gap="sm">
      <Title order={5}>{t("detailRequestSection")}</Title>
      <DetailField label={t("colId")} value={`#${testRequest.id}`} />
      <DetailField label={t("colMedicalTest")} value={testsLabel} />
      <DetailField
        label={t("colRequestDate")}
        value={
          testRequest.requestDate
            ? dayjs(testRequest.requestDate).format("YYYY-MM-DD HH:mm")
            : "—"
        }
      />
      <DetailField
        label={t("tableStatus")}
        value={
          <Badge variant="light" color={String(testRequest.status).toLowerCase() === "pending" ? "orange" : "teal"}>
            {testRequest.status}
          </Badge>
        }
      />
      <DetailField label={t("colTotalAmount")} value={testRequest.totalAmount} />
      {testRequest.patientName || testRequest.externalPatientFullName ? (
        <DetailField
          label={t("colDirectPatientId")}
          value={testRequest.patientName ?? testRequest.externalPatientFullName ?? "—"}
        />
      ) : null}
      {testRequest.doctorName ? (
        <DetailField label={t("colDoctorId")} value={testRequest.doctorName} />
      ) : null}
      {testRequest.labPartnerName ? (
        <DetailField label={t("colLabClientId")} value={testRequest.labPartnerName} />
      ) : null}
      {notes ? <DetailField label={t("colNotes")} value={notes} /> : null}
      {metadata && metadata !== "{}" ? (
        <DetailField label={t("colMetadata")} value={metadata} />
      ) : null}
      <DetailField
        label={t("colCreatedAt")}
        value={
          testRequest.createdAt
            ? dayjs(testRequest.createdAt).format("YYYY-MM-DD HH:mm")
            : "—"
        }
      />
    </Stack>
  );
};

const DetailModal = () => {
  const t = useTranslations("admin.testRequests");
  const ta = useTranslations("appointmentsFeature");
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedTestRequest = useMirror("setSelectedTestRequest");
  const testRequest = useMirror("selectedTestRequest") as TestRequestItem | null;

  const isOpen = activeModal === "detail" && Boolean(testRequest?.id);

  const appointmentsQuery = useQuery({
    queryKey: ["test-request-appointments", testRequest?.id],
    queryFn: async () => {
      const rows = await appointmentsClient.findAll({ testRequestId: testRequest?.id });
      return rows.filter((row) => Number(row.testRequestId) === Number(testRequest?.id));
    },
    enabled: isOpen && Boolean(testRequest?.id),
  });

  const handleClose = () => {
    setActiveModal(null);
    setSelectedTestRequest(null);
  };

  const appointments = appointmentsQuery.data ?? [];
  const prescriptionUrl =
    appointments.find((item) => item.attachmentUrl?.trim())?.attachmentUrl?.trim() ?? null;

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={t("detailTitle", { id: testRequest?.id ?? "—" })}
      radius="lg"
      centered
      size="lg"
    >
      {!testRequest ? (
        <Text c="dimmed">{t("detailNotFound")}</Text>
      ) : (
        <Stack gap="lg">
          <RequestDetails testRequest={testRequest} t={t} />

          <Divider />

          <Stack gap="sm">
            <Title order={5}>{t("detailAppointmentSection")}</Title>
            {appointmentsQuery.isPending ? (
              <Group justify="center" py="md">
                <Loader size="sm" />
              </Group>
            ) : appointments.length === 0 ? (
              <Text size="sm" c="dimmed">
                {t("detailNoAppointment")}
              </Text>
            ) : (
              appointments.map((appointment) => (
                <Paper key={appointment.id} withBorder radius="md" p="md">
                  <Stack gap="xs">
                    <DetailField label={t("detailAppointmentId")} value={`#${appointment.id}`} />
                    <DetailField
                      label={ta("availableSlot")}
                      value={`${appointment.startTime} - ${appointment.endTime}`}
                    />
                    <DetailField label={ta("locationType")} value={appointment.patientLocationType || "—"} />
                    <DetailField label={t("tableStatus")} value={appointment.status || "—"} />
                    {appointment.notes ? (
                      <DetailField label={ta("notes")} value={appointment.notes} />
                    ) : null}
                  </Stack>
                </Paper>
              ))
            )}
          </Stack>

          <Divider />

          <Stack gap="sm">
            <Title order={5}>{t("detailPrescriptionSection")}</Title>
            {prescriptionUrl ? (
              <Stack gap="sm">
                <Anchor href={prescriptionUrl} target="_blank" rel="noreferrer">
                  <Group gap={6}>
                    <IconPaperclip size={16} />
                    <Text size="sm">{t("openPrescription")}</Text>
                    <IconExternalLink size={14} />
                  </Group>
                </Anchor>
                <Paper withBorder radius="md" p="sm">
                  <Box
                    component="img"
                    src={prescriptionUrl}
                    alt={t("prescriptionPreviewAlt")}
                    style={{
                      display: "block",
                      maxWidth: "100%",
                      maxHeight: 360,
                      margin: "0 auto",
                      borderRadius: 8,
                      objectFit: "contain",
                    }}
                  />
                </Paper>
              </Stack>
            ) : (
              <Text size="sm" c="dimmed">
                {t("detailNoPrescription")}
              </Text>
            )}
          </Stack>
        </Stack>
      )}
    </Modal>
  );
};

export { DetailModal };
