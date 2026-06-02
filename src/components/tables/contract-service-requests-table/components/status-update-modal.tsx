"use client";

import { Button, Group, Modal, Select, Stack, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  CONTRACT_SERVICE_REQUEST_STATUSES,
  normalizeContractServiceRequestStatus,
} from "@/lib/contract-service-request-status";
import { useMirror } from "../store";

type FormValues = {
  status: string;
  notes: string;
};

const StatusUpdateModal = () => {
  const t = useTranslations("admin.contractServiceRequests");
  const statusUpdateTargetId = useMirror("statusUpdateTargetId");
  const setStatusUpdateTargetId = useMirror("setStatusUpdateTargetId");
  const requestsData = useMirror("requestsData");
  const updateStatus = useMirror("updateStatus");
  const isUpdatingStatus = useMirror("isUpdatingStatus");
  const [error, setError] = useState<string | null>(null);

  const target = requestsData.items.find((item) => item.id === statusUpdateTargetId);

  const form = useForm<FormValues>({
    initialValues: {
      status: "New",
      notes: "",
    },
    validate: {
      status: (value) => (value ? null : t("statusRequired")),
    },
  });

  useEffect(() => {
    if (!target) return;
    form.setValues({
      status: normalizeContractServiceRequestStatus(target.status) ?? target.status ?? "New",
      notes: target.notes ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusUpdateTargetId, target?.id, target?.status, target?.notes]);

  const handleClose = () => {
    setStatusUpdateTargetId(null);
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

  const statusOptions = CONTRACT_SERVICE_REQUEST_STATUSES.map((status) => ({
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
            label={t("colStatus")}
            data={statusOptions}
            {...form.getInputProps("status")}
          />
          <Textarea label={t("notes")} minRows={3} {...form.getInputProps("notes")} />
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
