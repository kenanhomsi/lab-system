"use client";

import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Stepper,
  Switch,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCurrencyDollar,
  IconPackage,
  IconTag,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  STORE_FORM_MODAL_SIZE,
  STORE_GLASS_MODAL_STYLES,
  STORE_GLASS_OVERLAY_PROPS,
  StoreModalHeader,
  StoreSectionHeader,
} from "../shared";
import { useMirror } from "./store";

const TOTAL_STEPS = 2;

const UI = () => {
  const t = useTranslations("labStore.admin");
  const tc = useTranslations("admin.common");
  const isOpen = useMirror("isOpen");
  const product = useMirror("product");
  const form = useMirror("form");
  const categories = useMirror("categories");
  const isSubmitting = useMirror("isSubmitting");
  const canSubmit = useMirror("canSubmit");
  const canAdvanceStep = useMirror("canAdvanceStep");
  const updateField = useMirror("updateField");
  const handleClose = useMirror("handleClose");
  const submit = useMirror("submit");

  const [step, setStep] = useState(0);
  const isEdit = Boolean(product);

  const categoryOptions = categories.map((c) => ({
    value: String(c.id),
    label: `${c.nameAr} (${c.nameEn})`,
  }));

  const close = () => {
    setStep(0);
    handleClose();
  };

  return (
    <Modal
      opened={isOpen}
      onClose={close}
      title={
        <StoreModalHeader
          icon={<IconPackage size={22} />}
          title={isEdit ? t("editProductModalTitle") : t("createProductModalTitle")}
          subtitle={isEdit ? t("editProductModalSubtitle") : t("createProductModalSubtitle")}
        />
      }
      centered
      size={STORE_FORM_MODAL_SIZE}
      radius="xl"
      padding="lg"
      closeOnClickOutside={!isSubmitting}
      closeOnEscape={!isSubmitting}
      overlayProps={STORE_GLASS_OVERLAY_PROPS}
      styles={STORE_GLASS_MODAL_STYLES}
    >
      <Stack gap="lg">
        <MutationErrorAlert />
        <Stepper active={step} size="sm" color="teal">
          <Stepper.Step label={t("productStepBasic")} description={t("productStepBasicDesc")} />
          <Stepper.Step label={t("productStepPricing")} description={t("productStepPricingDesc")} />
        </Stepper>

        {step === 0 && (
          <Stack gap="md">
            <StoreSectionHeader
              icon={<IconTag size={20} />}
              title={t("productStepBasic")}
              description={t("productStepBasicDesc")}
            />
            <Select
              label={t("category")}
              placeholder={t("selectCategory")}
              required
              data={categoryOptions}
              value={form.categoryId > 0 ? String(form.categoryId) : null}
              onChange={(v) => updateField("categoryId", v ? Number(v) : 0)}
            />
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                label={t("nameAr")}
                value={form.nameAr}
                onChange={(e) => updateField("nameAr", e.currentTarget.value)}
                required
              />
              <TextInput
                label={t("nameEn")}
                value={form.nameEn}
                onChange={(e) => updateField("nameEn", e.currentTarget.value)}
                required
              />
            </SimpleGrid>
            <Textarea
              label={t("description")}
              value={form.description}
              onChange={(e) => updateField("description", e.currentTarget.value)}
              minRows={2}
            />
            <TextInput
              label={t("imageUrl")}
              value={form.imageUrl}
              onChange={(e) => updateField("imageUrl", e.currentTarget.value)}
              placeholder="https://"
            />
            <TextInput
              label={t("saleUnit")}
              value={form.saleUnit}
              onChange={(e) => updateField("saleUnit", e.currentTarget.value)}
              required
            />
          </Stack>
        )}

        {step === 1 && (
          <Stack gap="md">
            <StoreSectionHeader
              icon={<IconCurrencyDollar size={20} />}
              title={t("productStepPricing")}
              description={t("productStepPricingDesc")}
            />
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <NumberInput
                label={t("price")}
                value={form.price}
                onChange={(v) => updateField("price", Number(v) || 0)}
                min={0}
              />
              <NumberInput
                label={t("discountPrice")}
                value={form.discountPrice}
                onChange={(v) => updateField("discountPrice", Number(v) || 0)}
                min={0}
              />
            </SimpleGrid>
            <TextInput
              label={t("topBadge")}
              value={form.topBadge}
              onChange={(e) => updateField("topBadge", e.currentTarget.value)}
            />
            <NumberInput
              label={t("displayOrder")}
              value={form.displayOrder}
              onChange={(v) => updateField("displayOrder", Number(v) || 0)}
              min={0}
            />
            <Switch
              label={t("isRecommended")}
              checked={form.isRecommended}
              onChange={(e) => updateField("isRecommended", e.currentTarget.checked)}
            />
            <Switch
              label={t("isBestSeller")}
              checked={form.isBestSeller}
              onChange={(e) => updateField("isBestSeller", e.currentTarget.checked)}
            />
            <Switch
              label={t("active")}
              checked={form.isActive}
              onChange={(e) => updateField("isActive", e.currentTarget.checked)}
            />
          </Stack>
        )}

        <Group justify="space-between">
          <Button variant="subtle" color="gray" onClick={close} disabled={isSubmitting}>
            {tc("cancel")}
          </Button>
          <Group gap="sm">
            {step > 0 && (
              <Button
                variant="default"
                leftSection={<IconChevronLeft size={16} />}
                onClick={() => setStep((s) => s - 1)}
                disabled={isSubmitting}
              >
                {tc("back")}
              </Button>
            )}
            {step < TOTAL_STEPS - 1 ? (
              <Button
                color="teal"
                rightSection={<IconChevronRight size={16} />}
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvanceStep || isSubmitting}
              >
                {tc("next")}
              </Button>
            ) : (
              <Button
                color="teal"
                onClick={() => void submit()}
                loading={isSubmitting}
                disabled={!canSubmit}
              >
                {tc("save")}
              </Button>
            )}
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
