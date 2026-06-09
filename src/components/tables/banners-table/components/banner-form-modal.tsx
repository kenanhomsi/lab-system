"use client";

import {
    Button,
    Checkbox,
    FileInput,
    Group,
    Modal,
    NumberInput,
    Paper,
    SimpleGrid,
    Stack,
    Stepper,
    Text,
    Select,
    TextInput,
    ThemeIcon,
    Title,
    Textarea,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
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
import { ReactNode, useCallback, useMemo, useState } from "react";
import {
    getBannerSlots,
    isBannerSlotLocation,
} from "@/lib/banners/slots";
import {
    BANNER_PLACEMENT,
    BANNER_PLACEMENT_VALUES,
    type BannerPlacement,
} from "@/lib/banners/locations";
import { toIso8601Utc } from "@/lib/dates/to-iso-8601";
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import { useMirror } from "../store";
import { CreateBannerRequest } from "../types";

type Props = {
    isOpen: boolean;
    onClose: () => void;
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

const TOTAL_STEPS = 4;

const BannerFormModal = ({ isOpen, onClose }: Props) => {
    const t = useTranslations("admin.settings.banners");
    const tc = useTranslations("admin.common");
    const createBanner = useMirror("createBanner");

    const [step, setStep] = useState(0);
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [location, setLocation] = useState<BannerPlacement>(BANNER_PLACEMENT.HOME_PAGE);

    const locationSelectData = useMemo(
        () =>
            BANNER_PLACEMENT_VALUES.map((value) => ({
                value,
                label: t(`locationOptions.${value}`),
            })),
        [t],
    );
    const positionSelectData = useMemo(
        () =>
            getBannerSlots(location).map(({ order, labelKey }) => ({
                value: String(order),
                label: `${order} - ${t(`slotLabels.${labelKey}`)}`,
            })),
        [location, t],
    );
    const [isActive, setIsActive] = useState(true);
    const [displayOrder, setDisplayOrder] = useState("1");
    const [internalLink, setInternalLink] = useState("");
    const [externalLink, setExternalLink] = useState("");
    const [targetType, setTargetType] = useState("");
    const [visibilityRulesJson, setVisibilityRulesJson] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = useCallback(() => {
        setStep(0);
        setTitle("");
        setType("");
        setLocation(BANNER_PLACEMENT.HOME_PAGE);
        setIsActive(true);
        setDisplayOrder("1");
        setInternalLink("");
        setExternalLink("");
        setTargetType("");
        setVisibilityRulesJson("");
        setStartDate("");
        setEndDate("");
        setMediaFile(null);
        onClose();
    }, [onClose]);

    const handleSubmit = async () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (
            !title.trim() ||
            !type.trim() ||
            !targetType.trim() ||
            !displayOrder ||
            !startDate ||
            !endDate ||
            !mediaFile
        ) {
            alert(t("errorRequiredFields"));
            return;
        }
        if (internalLink.trim() && externalLink.trim()) {
            alert(t("errorSingleLink"));
            return;
        }
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
            alert(t("errorDateOrder"));
            return;
        }
        if (!mediaFile.type.match(/^(image|video)\//) || mediaFile.size > 50 * 1024 * 1024) {
            alert(t("errorInvalidMedia"));
            return;
        }

        setIsSubmitting(true);
        try {
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
                startDate: toIso8601Utc(startDate),
                endDate: toIso8601Utc(endDate),
                media: mediaFile,
            };
            await createBanner(payload);
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
                            {t("modalCreateTitle")}
                        </Title>
                        <Text size="sm" c="dimmed">
                            {t("modalCreateDescription")}
                        </Text>
                    </Stack>
                </Group>
            }
            centered
            size={820}
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
                <MutationErrorAlert />
                <Stepper active={step} size="sm" color="blue" mt="md">
                    <Stepper.Step label={t("stepDetails")} description={t("stepDetailsDesc")} />
                    <Stepper.Step label={t("stepLinks")} description={t("stepLinksDesc")} />
                    <Stepper.Step label={t("stepSchedule")} description={t("stepScheduleDesc")} />
                    <Stepper.Step label={t("stepMedia")} description={t("stepMediaDesc")} />
                </Stepper>

                {step === 0 && (
                <Paper withBorder radius="lg" p="md">
                    <Stack gap="md">
                        <SectionHeader
                            icon={<IconPalette size={18} />}
                            title={t("detailsSection")}
                            description={t("detailsSectionDesc")}
                        />
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        <TextInput
                            label={t("titleLabel")}
                            placeholder={t("titlePlaceholder")}
                            leftSection={<IconStackMiddle size={16} />}
                            value={title}
                            onChange={(e) => setTitle(e.currentTarget.value)}
                            required
                        />
                        <TextInput
                            label={t("typeLabel")}
                            placeholder={t("typePlaceholder")}
                            value={type}
                            onChange={(e) => setType(e.currentTarget.value)}
                            required
                        />
                        <Select
                            label={t("locationLabel")}
                            placeholder={t("locationPlaceholder")}
                            data={locationSelectData}
                            value={location}
                            onChange={(value) => {
                                const next = (value as BannerPlacement) ?? BANNER_PLACEMENT.HOME_PAGE;
                                setLocation(next);
                                setDisplayOrder(String(getBannerSlots(next)[0]?.order ?? 1));
                            }}
                            searchable
                            required
                            allowDeselect={false}
                        />
                        {isBannerSlotLocation(location) ? (
                            <Select
                                label={t("displayOrderLabel")}
                                placeholder={t("positionPlaceholder")}
                                data={positionSelectData}
                                value={displayOrder}
                                onChange={(value) => setDisplayOrder(value ?? "")}
                                description={t("positionDescription")}
                                required
                                allowDeselect={false}
                            />
                        ) : (
                            <NumberInput
                                label={t("specializedOrderLabel")}
                                min={1}
                                value={Number(displayOrder) || 1}
                                onChange={(value) => setDisplayOrder(String(value ?? 1))}
                                description={t("specializedOrderDescription")}
                                required
                            />
                        )}
                        </SimpleGrid>
                    </Stack>
                </Paper>
                )}

                {step === 1 && (
                <Paper withBorder radius="lg" p="md">
                    <Stack gap="md">
                        <SectionHeader
                            icon={<IconLink size={18} />}
                            title={t("linksSection")}
                            description={t("linksSectionDesc")}
                        />
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
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
                            required
                        />
                        </SimpleGrid>
                    </Stack>
                </Paper>
                )}

                {step === 2 && (
                <Paper withBorder radius="lg" p="md">
                    <Stack gap="md">
                        <SectionHeader
                            icon={<IconHourglassEmpty size={18} />}
                            title={t("scheduleSection")}
                            description={t("scheduleSectionDesc")}
                        />
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                            <DateTimePicker
                                label={t("startDateLabel")}
                                placeholder={t("dateTimePlaceholder")}
                                value={startDate || null}
                                onChange={(value) => setStartDate(value ?? "")}
                                valueFormat="MM/DD/YYYY hh:mm A"
                                clearable
                                required
                            />
                            <DateTimePicker
                                label={t("endDateLabel")}
                                placeholder={t("dateTimePlaceholder")}
                                value={endDate || null}
                                onChange={(value) => setEndDate(value ?? "")}
                                valueFormat="MM/DD/YYYY hh:mm A"
                                clearable
                                required
                            />
                            <Group align="flex-end" pb={4}>
                                <Checkbox
                                    label={t("isActiveLabel")}
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.currentTarget.checked)}
                                />
                            </Group>
                        </SimpleGrid>
                        <Textarea
                            label={t("visibilityRulesLabel")}
                            placeholder='{"rules": [], "type": "all"}'
                            value={visibilityRulesJson}
                            onChange={(e) => setVisibilityRulesJson(e.currentTarget.value)}
                            minRows={3}
                            description={t("visibilityRulesDescription")}
                        />
                    </Stack>
                </Paper>
                )}

                {step === 3 && (
                <Paper withBorder radius="lg" p="md">
                    <Stack gap="md">
                        <SectionHeader
                            icon={<IconFile size={18} />}
                            title={t("mediaSection")}
                            description={t("mediaSectionDesc")}
                        />
                        <FileInput
                            label={t("mediaLabel")}
                            placeholder={t("mediaPlaceholder")}
                            leftSection={<IconUpload size={14} />}
                            accept="image/*,video/*"
                            value={mediaFile}
                            onChange={setMediaFile}
                            required
                            clearable
                            description={mediaFile ? t("mediaSelected", { name: mediaFile.name, size: (mediaFile.size / 1024 / 1024).toFixed(2) }) : t("mediaDescription")}
                        />
                    </Stack>
                </Paper>
                )}

                <Group justify="space-between">
                    <Button variant="subtle" color="gray" onClick={handleClose} disabled={isSubmitting}>
                        {t("cancel")}
                    </Button>
                    <Group gap="sm">
                        {step > 0 && (
                            <Button
                                variant="default"
                                onClick={() => setStep((current) => current - 1)}
                                disabled={isSubmitting}
                            >
                                {tc("back")}
                            </Button>
                        )}
                        {step < TOTAL_STEPS - 1 ? (
                            <Button
                                radius="md"
                                onClick={() => setStep((current) => current + 1)}
                            >
                                {tc("next")}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                loading={isSubmitting}
                                disabled={
                                    isSubmitting ||
                                    !title.trim() ||
                                    !type.trim() ||
                                    !targetType.trim() ||
                                    !location ||
                                    !displayOrder ||
                                    !startDate ||
                                    !endDate ||
                                    !mediaFile
                                }
                                radius="md"
                            >
                                {tc("create")}
                            </Button>
                        )}
                    </Group>
                </Group>
            </Stack>
        </Modal>
    );
};

export { BannerFormModal };
