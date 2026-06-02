"use client";

import { Button, FileInput, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMirror } from "../store";

type FormValues = {
  insuredName: string;
  insuranceNumber: string;
  mobileNumber: string;
  insuranceCardImage: File | null;
  prescriptionImage: File | null;
};

const CreateRequestModal = () => {
  const t = useTranslations("myInsuranceApproval");
  const tInsurance = useTranslations("insurance");
  const isOpen = useMirror("isCreateModalOpen");
  const setIsCreateModalOpen = useMirror("setIsCreateModalOpen");
  const createRequest = useMirror("createRequest");
  const isCreating = useMirror("isCreating");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    initialValues: {
      insuredName: "",
      insuranceNumber: "",
      mobileNumber: "",
      insuranceCardImage: null,
      prescriptionImage: null,
    },
    validate: {
      insuredName: (value) => (value.trim() ? null : t("insuredNameRequired")),
      insuranceNumber: (value) => (value.trim() ? null : t("insuranceNumberRequired")),
      mobileNumber: (value) => (value.trim() ? null : t("mobileRequired")),
      insuranceCardImage: (value) => (value ? null : t("cardImageRequired")),
      prescriptionImage: (value) => (value ? null : t("prescriptionImageRequired")),
    },
  });

  const handleClose = () => {
    setError(null);
    form.reset();
    setIsCreateModalOpen(false);
  };

  const handleSubmit = form.onSubmit(async (values) => {
    if (!values.insuranceCardImage || !values.prescriptionImage) {
      return;
    }
    setError(null);
    try {
      await createRequest({
        insuredName: values.insuredName.trim(),
        insuranceNumber: values.insuranceNumber.trim(),
        mobileNumber: values.mobileNumber.trim(),
        insuranceCardImage: values.insuranceCardImage,
        prescriptionImage: values.prescriptionImage,
      });
      handleClose();
    } catch {
      setError(t("createError"));
    }
  });

  return (
    <Modal opened={isOpen} onClose={handleClose} title={t("modalTitle")} radius="lg" centered size="lg">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label={tInsurance("insuredName")}
            placeholder={tInsurance("insuredNamePlaceholder")}
            {...form.getInputProps("insuredName")}
          />
          <TextInput
            label={tInsurance("insuranceNumber")}
            placeholder={tInsurance("insuranceNumberPlaceholder")}
            {...form.getInputProps("insuranceNumber")}
          />
          <TextInput
            label={tInsurance("mobile")}
            placeholder={tInsurance("mobilePlaceholder")}
            {...form.getInputProps("mobileNumber")}
          />
          <FileInput
            label={tInsurance("cardImage")}
            description={tInsurance("cardImageHint")}
            placeholder={t("selectFile")}
            accept="image/*"
            clearable
            {...form.getInputProps("insuranceCardImage")}
          />
          <FileInput
            label={tInsurance("prescriptionImage")}
            description={tInsurance("prescriptionImageHint")}
            placeholder={t("selectFile")}
            accept="image/*"
            clearable
            {...form.getInputProps("prescriptionImage")}
          />
          {error ? (
            <Text c="red" size="sm">
              {error}
            </Text>
          ) : null}
          <Button type="submit" loading={isCreating} fullWidth>
            {isCreating ? tInsurance("submitting") : tInsurance("submit")}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};

export { CreateRequestModal };
