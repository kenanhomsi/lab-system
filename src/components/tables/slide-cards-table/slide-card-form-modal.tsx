"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  FileInput,
  Group,
  Image,
  Modal,
  NumberInput,
  Stack,
  Switch,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { IconCards, IconUpload } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import type { SlideCardItem } from "@/types/slide-card";

export type SlideCardFormPreset = {
  displayOrder?: number;
};

type SlideCardFormModalProps = {
  mode: "create" | "edit";
  isOpen: boolean;
  onClose: () => void;
  card?: SlideCardItem | null;
  preset?: SlideCardFormPreset;
  onSubmit: (payload: {
    id?: number;
    title: string;
    description: string;
    price: number;
    discount: number;
    expiryDate: string;
    badge: string;
    detailPageLink: string;
    displayOrder: number;
    isActive: boolean;
    image?: File;
  }) => Promise<void>;
};

/**
 * Create/edit modal for Silders used by the content map.
 */
export function SlideCardFormModal({
  mode,
  isOpen,
  onClose,
  card,
  preset,
  onSubmit,
}: SlideCardFormModalProps) {
  const t = useTranslations("admin.settings.slideCards");
  const tc = useTranslations("admin.common");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [badge, setBadge] = useState("");
  const [detailPageLink, setDetailPageLink] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === "edit" && card) {
      setTitle(card.title);
      setDescription(card.description);
      setPrice(card.price);
      setDiscount(card.discount);
      setExpiryDate(card.expiryDate ? new Date(card.expiryDate) : null);
      setBadge(card.badge);
      setDetailPageLink(card.detailPageLink);
      setDisplayOrder(card.displayOrder);
      setIsActive(card.isActive);
      setImage(null);
      return;
    }
    setTitle("");
    setDescription("");
    setPrice(0);
    setDiscount(0);
    setExpiryDate(null);
    setBadge("");
    setDetailPageLink("");
    setDisplayOrder(preset?.displayOrder ?? 0);
    setIsActive(true);
    setImage(null);
  }, [card, isOpen, mode, preset]);

  const previewUrl = useMemo(() => {
    if (image) return URL.createObjectURL(image);
    return card?.imageUrl ?? "";
  }, [card?.imageUrl, image]);

  useEffect(() => {
    if (!image || !previewUrl.startsWith("blob:")) return undefined;
    return () => URL.revokeObjectURL(previewUrl);
  }, [image, previewUrl]);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    if (mode === "create" && !image) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        id: card?.id,
        title,
        description,
        price,
        discount,
        expiryDate: expiryDate ? expiryDate.toISOString() : "",
        badge,
        detailPageLink,
        displayOrder,
        isActive,
        image: image ?? undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    Boolean(title.trim()) && (mode === "edit" || image) && !isSubmitting;

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <Group gap="sm">
          <ThemeIcon size={42} radius="md" variant="light" color="blue">
            <IconCards size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>
              {mode === "create" ? t("modalCreateTitle") : t("modalEditTitle")}
            </Title>
          </Stack>
        </Group>
      }
      centered
      size={720}
      radius="lg"
    >
      <Stack gap="md">
        <MutationErrorAlert />
        <TextInput label={t("titleLabel")} value={title} onChange={(e) => setTitle(e.currentTarget.value)} required />
        <Textarea label={t("descriptionLabel")} value={description} onChange={(e) => setDescription(e.currentTarget.value)} minRows={2} />
        <Group grow>
          <NumberInput label={t("priceLabel")} value={price} onChange={(v) => setPrice(Number(v) || 0)} min={0} />
          <NumberInput label={t("discountLabel")} value={discount} onChange={(v) => setDiscount(Number(v) || 0)} min={0} max={100} />
        </Group>
        <DateTimePicker label={t("expiryDateLabel")} value={expiryDate} onChange={(value) => setExpiryDate(typeof value === "string" ? (value ? new Date(value) : null) : value)} clearable />
        <TextInput label={t("badgeLabel")} value={badge} onChange={(e) => setBadge(e.currentTarget.value)} />
        <TextInput label={t("detailPageLinkLabel")} value={detailPageLink} onChange={(e) => setDetailPageLink(e.currentTarget.value)} />
        <NumberInput label={t("displayOrderLabel")} value={displayOrder} onChange={(v) => setDisplayOrder(Number(v) || 0)} min={0} />
        <Switch label={t("isActiveLabel")} checked={isActive} onChange={(e) => setIsActive(e.currentTarget.checked)} />
        <FileInput label={t("imageLabel")} accept="image/*" value={image} onChange={setImage} leftSection={<IconUpload size={14} />} required={mode === "create"} clearable />
        {previewUrl ? <Image src={previewUrl} alt={title} h={120} radius="md" fit="cover" /> : null}
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={isSubmitting}>{tc("cancel")}</Button>
          <Button onClick={handleSubmit} loading={isSubmitting} disabled={!canSubmit}>
            {mode === "create" ? tc("create") : tc("save")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
