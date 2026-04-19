"use client";

import {
    Alert,
    Button,
    Group,
    Modal,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from "@mantine/core";
import { IconAlertTriangle, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMirror } from "../store";
import { BannerItem } from "../types";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    banner: BannerItem | null;
};

const DeleteBannerModal = ({ isOpen, onClose, banner }: Props) => {
    const t = useTranslations("admin.settings.banners");
    const deleteBanner = useMirror("deleteBanner");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!banner?.id) return;
        setIsSubmitting(true);
        try {
            await deleteBanner(banner.id);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title={
                <Group gap="sm" wrap="nowrap">
                    <ThemeIcon size={42} radius="md" variant="light" color="red">
                        <IconTrash size={22} />
                    </ThemeIcon>
                    <Stack gap={0}>
                        <Title order={4}>{t("modalDeleteTitle")}</Title>
                        <Text size="sm" c="dimmed">
                            {t("modalDeleteWarning")}
                        </Text>
                    </Stack>
                </Group>
            }
            centered
            size="md"
            radius="xl"
            padding="lg"
            closeOnClickOutside={!isSubmitting}
            closeOnEscape={!isSubmitting}
            overlayProps={{ blur: 10, backgroundOpacity: 0.2 }}
            styles={{
                content: {
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    background: "light-dark(rgba(255,255,255,0.82), rgba(18,18,23,0.78))",
                    border: "1px solid light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.09))",
                },
            }}
        >
            <Stack gap="lg">
                <Alert
                    color="red"
                    radius="lg"
                    icon={<IconAlertTriangle size={18} />}
                    title="Warning"
                >
                    <Text size="sm">{t("modalDeleteBody")}</Text>
                </Alert>

                <Group justify="flex-end">
                    <Button variant="default" onClick={onClose} disabled={isSubmitting} radius="md">
                        {t("cancel")}
                    </Button>
                    <Button color="red" onClick={handleSubmit} loading={isSubmitting} radius="md">
                        {t("delete")}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export { DeleteBannerModal };
