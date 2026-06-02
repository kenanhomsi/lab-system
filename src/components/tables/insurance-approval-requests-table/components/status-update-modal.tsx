"use client";

import { Button, Group, Modal, Select, Stack, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { INSURANCE_APPROVAL_STATUSES } from "@/lib/insurance-approval-status";
import type { InsuranceApprovalStatus } from "@/lib/insurance-approval-status";
import { useMirror } from "../store";

type FormValues = {
  status: InsuranceApprovalStatus;
  notes: string;
  rejectionReason: string;
};

const StatusUpdateModal = () => {
  const t = useTranslations("admin.insuranceApproval");
  const statusUpdateTargetId = useMirror("statusUpdateTargetId");
  const setStatusUpdateTargetId = useMirror("setStatusUpdateTargetId");
  const updateStatus = useMirror("updateStatus");
  const isUpdatingStatus = useMirror("isUpdatingStatus");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    initialValues: {
      status: "New",
      notes: "",
      rejectionReason: "",
    },
    validate: {
      status: (value) => (value ? null : t("statusRequired")),
    },
  });

  const handleClose = () => {
    setStatusUpdateTargetId(null);
    form.reset();
    setError(null);
  };

  const showRejectionReason =
    form.values.status === "Rejected" || form.values.status === "NeedMoreInfo";

  const handleSubmit = form.onSubmit(async (values) => {
    if (statusUpdateTargetId === null) return;
    setError(null);
    try {
      await updateStatus({
        id: statusUpdateTargetId,
        status: values.status,
        notes: values.notes.trim() || undefined,
        rejectionReason: showRejectionReason ? values.rejectionReason.trim() || undefined : undefined,
      });
      handleClose();
    } catch {
      setError(t("statusUpdateError"));
    }
  });

  const statusOptions = INSURANCE_APPROVAL_STATUSES.map((status) => ({
    value: status,
    label: t(`status${status}` as "statusNew"),
  }));

  return (
    <Modal
      opened={statusUpdateTargetId !== null}
      onClose={handleClose}
      title={t("statusUpdateTitle")}
      radius="lg"
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Select
            label={t("statusLabel")}
            data={statusOptions}
            {...form.getInputProps("status")}
          />
          <Textarea label={t("notesLabel")} minRows={3} {...form.getInputProps("notes")} />
          {showRejectionReason ? (
            <Textarea
              label={t("rejectionReasonLabel")}
              minRows={2}
              {...form.getInputProps("rejectionReason")}
            />
          ) : null}
          {error ? (
            <Text c="red" size="sm">
              {error}
            </Text>
          ) : null}
          <Group justify="flex-end">
            <Button variant="default" onClick={handleClose}>
              {t("cancel")}
            </Button>
            <Button type="submit" loading={isUpdatingStatus}>
              {t("save")}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export { StatusUpdateModal };
