"use client";

import {
    Badge,
    Button,
    Checkbox,
    FileInput,
    Group,
    Modal,
    Paper,
    Stack,
    Text,
    TextInput,
    ThemeIcon,
    Title,
    Textarea,
} from "@mantine/core";
import {
    IconBrandAndroid,
    IconFile,
    IconHourglassEmpty,
    IconLink,
    IconPalette,
    IconStackMiddle,
    IconUpload,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { ReactNode, useCallback, useState } from "react";
import { useMirror } from "../store";
import { BannerItem, CreateBannerRequest, UpdateBannerRequest } from "../types";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    banner: BannerItem | null;
};

const SectionHeader = ({
    icon,
    title,
    description,
}: {
    icon: ReactNode;
    title: string;
    description: string;
}) => (
    <Group align="flex-start" gap="sm">
        <ThemeIcon size={38} radius="md" variant="light" color="blue">
            {icon}
        </ThemeIcon>
        <Stack gap={2}>
            <Text fw={600}>{title}</Text>
            <Text size="sm" c="dimmed">
                {description}
            </Text>
        </Stack>
    </Group>
);

const BannerFormModal = ({ isOpen, onClose, banner }: Props) => {
    const t = useTranslations("admin.settings.banners");
    const createBanner = useMirror("createBanner");
    const updateBanner = useMirror("updateBanner");

    const [title, setTitle] = useState(banner?.title || "");
    const [type, setType] = useState(banner?.type || "");
    const [location, setLocation] = useState(banner?.location || "");
    const [isActive, setIsActive] = useState(banner?.isActive ?? true);
    const [displayOrder, setDisplayOrder] = useState(banner?.displayOrder?.toString() || "0");
    const [internalLink, setInternalLink] = useState(banner?.internalLink || "");
    const [externalLink, setExternalLink] = useState(banner?.externalLink || "");
    const [targetType, setTargetType] = useState(banner?.targetType || "");
    const [visibilityRulesJson, setVisibilityRulesJson] = useState(
        banner?.visibilityRules || "",
    );
    const [startDate, setStartDate] = useState(banner?.startDate || "");
    const [endDate, setEndDate] = useState(banner?.endDate || "");
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = useCallback(() => {
        setTitle(banner?.title || "");
        setType(banner?.type || "");
        setLocation(banner?.location || "");
        setIsActive(banner?.isActive ?? true);
        setDisplayOrder(banner?.displayOrder?.toString() || "0");
        setInternalLink(banner?.internalLink || "");
        setExternalLink(banner?.externalLink || "");
        setTargetType(banner?.targetType || "");
        setVisibilityRulesJson(banner?.visibilityRules || "");
        setStartDate(banner?.startDate || "");
        setEndDate(banner?.endDate || "");
        setMediaFile(null);
        onClose();
    }, [banner, onClose]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            if (banner?.id) {
                const payload: UpdateBannerRequest = {
                    title,
                    type,
                    location,
                    isActive,
                    displayOrder: parseInt(displayOrder, 10),
                    internalLink,
                    externalLink,
                    targetType,
                    visibilityRulesJson,
                    startDate,
                    endDate,
                    ...(mediaFile && { media: mediaFile }),
                };
                await updateBanner(banner.id, payload);
            } else {
                if (!mediaFile) {
                    alert(t("errorMediaRequired"));
                    setIsSubmitting(false);
                    return;
                }
                const payload: CreateBannerRequest = {
                    title,
                    type,
                    location,
                    isActive,
                    displayOrder: parseInt(displayOrder, 10),
                    internalLink,
                    externalLink,
                    targetType,
                    visibilityRulesJson,
                    startDate,
                    endDate,
                    media: mediaFile,
                };
                await createBanner(payload);
            }
            handleClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            opened={isOpen}
            onClose={handleClose}
            title={
                <Group gap="sm" wrap="nowrap">
                    <ThemeIcon size={42} radius="md" variant="light" color="blue">
                        <IconBrandAndroid size={22} />
                    </ThemeIcon>
                    <Stack gap={0}>
                        <Title order={4}>
                            {banner?.id ? t("modalEditTitle") : t("modalCreateTitle")}
                        </Title>
                        <Text size="sm" c="dimmed">
                            {banner?.id
                                ? "Update banner settings and content."
                                : "Create a new promotional banner."}
                        </Text>
                    </Stack>
                </Group>
            }
            centered
            size="lg"
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
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                },
                body: { scrollbarWidth: "none", msOverflowStyle: "none" },
            }}
        >
            <Stack gap="lg">
                <Group justify="space-between" align="center">
                    <Badge variant="light" color="blue" radius="sm">
                        {banner?.id ? "Edit banner" : "New banner"}
                    </Badge>
                    <Text size="sm" c="dimmed">
                        Required: title, location, media
                    </Text>
                </Group>

                <Paper withBorder radius="lg" p="md">
                    <Stack gap="md">
                        <SectionHeader
                            icon={<IconPalette size={18} />}
                            title="Banner Details"
                            description="Configure the banner's basic information and appearance."
                        />
                        <TextInput
                            label={t("titleLabel")}
                            placeholder="e.g. Summer Sale 2024"
                            leftSection={<IconStackMiddle size={16} />}
                            value={title}
                            onChange={(e) => setTitle(e.currentTarget.value)}
                            required
                        />
                        <TextInput
                            label={t("typeLabel")}
                            placeholder="e.g. promotional, informational"
                            value={type}
                            onChange={(e) => setType(e.currentTarget.value)}
                        />
                        <TextInput
                            label={t("locationLabel")}
                            placeholder="e.g. homepage, sidebar"
                            value={location}
                            onChange={(e) => setLocation(e.currentTarget.value)}
                            required
                        />
                        <TextInput
                            label={t("displayOrderLabel")}
                            type="number"
                            placeholder="0"
                            min="0"
                            value={displayOrder}
                            onChange={(e) => setDisplayOrder(e.currentTarget.value)}
                        />
                    </Stack>
                </Paper>

                <Paper withBorder radius="lg" p="md">
                    <Stack gap="md">
                        <SectionHeader
                            icon={<IconLink size={18} />}
                            title="Links & Targeting"
                            description="Specify where the banner leads and its target behavior."
                        />
                        <TextInput
                            label={t("internalLinkLabel")}
                            placeholder="/dashboard/offers"
                            value={internalLink}
                            onChange={(e) => setInternalLink(e.currentTarget.value)}
                        />
                        <TextInput
                            label={t("externalLinkLabel")}
                            placeholder="https://example.com"
                            value={externalLink}
                            onChange={(e) => setExternalLink(e.currentTarget.value)}
                        />
                        <TextInput
                            label={t("targetTypeLabel")}
                            placeholder="e.g. _blank, _self"
                            value={targetType}
                            onChange={(e) => setTargetType(e.currentTarget.value)}
                        />
                    </Stack>
                </Paper>

                <Paper withBorder radius="lg" p="md">
                    <Stack gap="md">
                        <SectionHeader
                            icon={<IconHourglassEmpty size={18} />}
                            title="Schedule & Visibility"
                            description="Set when the banner should appear and visibility rules."
                        />
                        <Group grow>
                            <TextInput
                                label={t("startDateLabel")}
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.currentTarget.value)}
                            />
                            <TextInput
                                label={t("endDateLabel")}
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.currentTarget.value)}
                            />
                        </Group>
                        <Textarea
                            label={t("visibilityRulesLabel")}
                            placeholder='{"rules": [], "type": "all"}'
                            value={visibilityRulesJson}
                            onChange={(e) => setVisibilityRulesJson(e.currentTarget.value)}
                            minRows={3}
                            description="Enter JSON format visibility rules"
                        />
                    </Stack>
                </Paper>

                <Paper withBorder radius="lg" p="md">
                    <Stack gap="md">
                        <SectionHeader
                            icon={<IconFile size={18} />}
                            title="Media Upload"
                            description={banner?.id ? "Update the banner media (optional)" : "Upload an image or video for the banner"}
                        />
                        <FileInput
                            label={t("mediaLabel")}
                            placeholder="Choose image or video"
                            icon={<IconUpload size={14} />}
                            accept="image/*,video/*"
                            value={mediaFile}
                            onChange={setMediaFile}
                            required={!banner?.id}
                            clearable
                            description={mediaFile ? `Selected: ${mediaFile.name} (${(mediaFile.size / 1024 / 1024).toFixed(2)}MB)` : "Max size: 50MB"}
                        />
                    </Stack>
                </Paper>

                <Paper withBorder radius="lg" p="md">
                    <Group justify="space-between" align="center">
                        <Stack gap={2}>
                            <Text fw={600}>
                                {banner?.id ? "Ready to save changes?" : "Ready to create this banner?"}
                            </Text>
                            <Text size="sm" c="dimmed">
                                {banner?.id ? "Review the settings, then save." : "Review all details, then create."}
                            </Text>
                        </Stack>
                        <Group justify="flex-end">
                            <Button variant="default" onClick={handleClose} disabled={isSubmitting} radius="md">
                                {t("cancel")}
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                loading={isSubmitting}
                                disabled={isSubmitting || !title || !location || (!banner?.id && !mediaFile)}
                                radius="md"
                            >
                                {t("save")}
                            </Button>
                        </Group>
                    </Group>
                </Paper>
            </Stack>
        </Modal>
    );
};

export { BannerFormModal };
