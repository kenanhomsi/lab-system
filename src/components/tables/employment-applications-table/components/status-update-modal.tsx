"use client";

import { Button, Group, Modal, Select, Stack, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useMirror } from "../store";
import type { EmploymentApplicationStatus } from "../types";

type FormValues = {
  status: EmploymentApplicationStatus;
  notes: string;
};

const STATUS_OPTIONS: EmploymentApplicationStatus[] = ["Accepted", "Rejected", "InReview", "New"];

const StatusUpdateModal = () => {
  const t = useTranslations("admin.employmentApplications");
  const statusUpdateTargetId = useMirror("statusUpdateTargetId");
  const setStatusUpdateTargetId = useMirror("setStatusUpdateTargetId");
  const statusUpdateIntent = useMirror("statusUpdateIntent");
  const setStatusUpdateIntent = useMirror("setStatusUpdateIntent");
  const applicationsData = useMirror("applicationsData");
  const updateStatus = useMirror("updateStatus");
  const isUpdatingStatus = useMirror("isUpdatingStatus");
  const [error, setError] = useState<string | null>(null);

  const target = applicationsData.items.find((item) => item.id === statusUpdateTargetId);

  const form = useForm<FormValues>({
    initialValues: {
      status: "New",
      notes: "",
    },
    validate: {
      status: (value) => (value ? null : t("statusRequired")),
      notes: (value) => (value.trim() ? null : t("notesRequired")),
    },
  });

  useEffect(() => {
    if (!target) return;
    form.setValues({
      status: statusUpdateIntent ?? (target.status as EmploymentApplicationStatus) ?? "New",
      notes: target.notes ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusUpdateTargetId, target?.id, target?.status, target?.notes, statusUpdateIntent]);

  const handleClose = () => {
    setStatusUpdateTargetId(null);
    setStatusUpdateIntent(null);
    form.reset();
    setError(null);
  };

  const handleSubmit = form.onSubmit(async (values) => {
    if (statusUpdateTargetId === null) return;
    setError(null);
    try {
      await updateStatus({
        id: statusUpdateTargetId,
        status: values.status,
        notes: values.notes.trim(),
      });
      handleClose();
    } catch {
      setError(t("statusUpdateError"));
    }
  });

  const statusOptions = STATUS_OPTIONS.map((status) => ({
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
          <Select label={t("statusLabel")} data={statusOptions} {...form.getInputProps("status")} />
          <Textarea label={t("notesLabel")} minRows={3} {...form.getInputProps("notes")} />
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
