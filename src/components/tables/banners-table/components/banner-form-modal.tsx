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
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
    getBannerSlots,
    isBannerSlotLocation,
} from "@/lib/banners/slots";
import {
    DISPLAY_MODE,
    DISPLAY_MODE_VALUES,
    type DisplayMode,
    normalizeDisplayMode,
} from "@/lib/banners/display-mode";
import {
    BANNER_PLACEMENT,
    isPathTarget,
    normalizeBannerPlacement,
    type BannerPlacement,
} from "@/lib/banners/locations";
import { SiteLinkSelect } from "@/components/admin/site-link-select";
import { PageTargetSelect } from "@/components/admin/page-target-select";
import { toIso8601Utc } from "@/lib/dates/to-iso-8601";
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import { useMirror } from "../store";
import { BannerItem, CreateBannerRequest, UpdateBannerRequest } from "../types";

export type BannerFormPreset = {
  location?: string;
  displayOrder?: number;
};

export type BannerMutationOverrides = {
  onCreate?: (payload: CreateBannerRequest) => Promise<void>;
  onUpdate?: (payload: UpdateBannerRequest) => Promise<void>;
};

type Props = {
  mode: "create" | "edit";
  isOpen: boolean;
  onClose: () => void;
  banner?: BannerItem | null;
  preset?: BannerFormPreset;
  mutations?: BannerMutationOverrides;
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

const BannerFormModal = ({ mode, isOpen, onClose, banner, preset, mutations }: Props) => {
    const t = useTranslations("admin.settings.banners");
    const tc = useTranslations("admin.common");
    const createBannerMirror = useMirror("createBanner");
    const updateBannerMirror = useMirror("updateBanner");
    const createBanner = mutations?.onCreate ?? createBannerMirror;
    const updateBanner = mutations?.onUpdate ?? updateBannerMirror;
    const isEdit = mode === "edit";

    const [step, setStep] = useState(0);
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [displayMode, setDisplayMode] = useState<DisplayMode>(DISPLAY_MODE.FULL);
    const [location, setLocation] = useState<string>(BANNER_PLACEMENT.HOME_PAGE);

    const slotLocation = normalizeBannerPlacement(location) as BannerPlacement | null;
    const positionSelectData = useMemo(
        () =>
            slotLocation && isBannerSlotLocation(slotLocation)
                ? getBannerSlots(slotLocation).map(({ order, labelKey }) => ({
                      value: String(order),
                      label: `${order} - ${t(`slotLabels.${labelKey}`)}`,
                  }))
                : [],
        [slotLocation, t],
    );
    const [isActive, setIsActive] = useState(true);
    const [displayOrder, setDisplayOrder] = useState("1");
    const [internalLink, setInternalLink] = useState("");
    const [externalLink, setExternalLink] = useState("");
    const [targetType, setTargetType] = useState("_self");
    const [visibilityRulesJson, setVisibilityRulesJson] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        if (isEdit && banner) {
            setStep(0);
            setTitle(banner.title);
            setType(banner.type);
            setDisplayMode(normalizeDisplayMode(banner.displayMode));
            setLocation(
                isPathTarget(banner.location)
                    ? banner.location
                    : normalizeBannerPlacement(banner.location) ?? BANNER_PLACEMENT.HOME_PAGE,
            );
            setIsActive(banner.isActive);
            setDisplayOrder(String(banner.displayOrder));
            setInternalLink(banner.internalLink ?? "");
            setExternalLink(banner.externalLink ?? "");
            setTargetType(banner.targetType === "_blank" ? "_blank" : "_self");
            setVisibilityRulesJson(banner.visibilityRules ?? "");
            setStartDate(banner.startDate ?? "");
            setEndDate(banner.endDate ?? "");
            setMediaFile(null);
            return;
        }
        setStep(0);
        setTitle("");
        setType("");
        setDisplayMode(DISPLAY_MODE.FULL);
        setLocation(preset?.location ?? BANNER_PLACEMENT.HOME_PAGE);
        setIsActive(true);
        const presetPlacement = normalizeBannerPlacement(preset?.location ?? "");
        setDisplayOrder(
            String(
                preset?.displayOrder ??
                    (presetPlacement && isBannerSlotLocation(presetPlacement)
                        ? getBannerSlots(presetPlacement)[0]?.order
                        : 1) ??
                    1,
            ),
        );
        setInternalLink("");
        setExternalLink("");
        setTargetType("_self");
        setVisibilityRulesJson("");
        setStartDate("");
        setEndDate("");
        setMediaFile(null);
    }, [banner, isEdit, isOpen, preset]);

    const handleClose = useCallback(() => {
        setStep(0);
        setTitle("");
        setType("");
        setDisplayMode(DISPLAY_MODE.FULL);
        setLocation(BANNER_PLACEMENT.HOME_PAGE);
        setIsActive(true);
        setDisplayOrder("1");
        setInternalLink("");
        setExternalLink("");
        setTargetType("_self");
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
            (!isEdit && !mediaFile)
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
        if (
            mediaFile &&
            (!mediaFile.type.match(/^(image|video)\//) || mediaFile.size > 50 * 1024 * 1024)
        ) {
            alert(t("errorInvalidMedia"));
            return;
        }
        if (isEdit && !banner) {
            return;
        }

        setIsSubmitting(true);
        try {
            const sharedPayload = {
                title,
                type,
                displayMode,
                location,
                isActive,
                displayOrder: parseInt(displayOrder, 10),
                internalLink,
                externalLink,
                targetType,
                visibilityRulesJson,
                startDate: toIso8601Utc(startDate),
                endDate: toIso8601Utc(endDate),
            };
            if (isEdit && banner) {
                await updateBanner({
                    id: banner.id,
                    ...sharedPayload,
                    media: mediaFile ?? undefined,
                });
            } else if (mediaFile) {
                const payload: CreateBannerRequest = {
                    ...sharedPayload,
                    media: mediaFile,
                };
                await createBanner(payload);
            }
            handleClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    const canSubmit =
        Boolean(
            title.trim() &&
            type.trim() &&
            displayMode &&
            targetType.trim() &&
            location &&
            displayOrder &&
            startDate &&
            endDate &&
            (isEdit || mediaFile),
        ) && !isSubmitting;

    return (
        <Modal
            opened={isOpen}
            onClose={handleClose}
            keepMounted={false}
            title={
                <Group gap="sm" wrap="nowrap">
                    <ThemeIcon size={42} radius="md" variant="light" color="blue">
                        <IconBrandAndroid size={22} />
                    </ThemeIcon>
                    <Stack gap={0}>
                        <Title order={4}>
                            {isEdit ? t("modalEditTitle") : t("modalCreateTitle")}
                        </Title>
                        <Text size="sm" c="dimmed">
                            {isEdit ? t("modalEditDescription") : t("modalCreateDescription")}
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
                            label={t("displayModeLabel")}
                            placeholder={t("displayModePlaceholder")}
                            data={DISPLAY_MODE_VALUES.map((value) => ({
                                value,
                                label: t(`displayModeOptions.${value}`),
                            }))}
                            value={displayMode}
                            onChange={(value) => setDisplayMode(normalizeDisplayMode(value))}
                            allowDeselect={false}
                            required
                        />
                        <div style={{ gridColumn: "1 / -1" }}>
                        <PageTargetSelect
                            label={t("locationLabel")}
                            description={t("locationDescription")}
                            value={location}
                            onChange={(next) => {
                                setLocation(next);
                                const nextPlacement = normalizeBannerPlacement(next);
                                if (nextPlacement && isBannerSlotLocation(nextPlacement)) {
                                    setDisplayOrder(
                                        String(getBannerSlots(nextPlacement)[0]?.order ?? 1),
                                    );
                                }
                            }}
                            required
                        />
                        </div>
                        {slotLocation && isBannerSlotLocation(slotLocation) && !isPathTarget(location) ? (
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
                        <SiteLinkSelect
                            label={t("internalLinkLabel")}
                            value={internalLink}
                            onChange={setInternalLink}
                        />
                        <TextInput
                            label={t("externalLinkLabel")}
                            placeholder="https://example.com"
                            value={externalLink}
                            onChange={(e) => setExternalLink(e.currentTarget.value)}
                            disabled={Boolean(internalLink.trim())}
                        />
                        <Select
                            label={t("targetTypeLabel")}
                            data={[
                                { value: "_self", label: t("targetSelf") },
                                { value: "_blank", label: t("targetBlank") },
                            ]}
                            value={targetType === "_blank" ? "_blank" : "_self"}
                            onChange={(value) => setTargetType(value ?? "_self")}
                            allowDeselect={false}
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
                            placeholder={isEdit ? t("mediaPlaceholder") : t("mediaPlaceholder")}
                            leftSection={<IconUpload size={14} />}
                            accept="image/*,video/*"
                            value={mediaFile}
                            onChange={setMediaFile}
                            required={!isEdit}
                            clearable
                            description={
                                mediaFile
                                    ? t("mediaSelected", {
                                          name: mediaFile.name,
                                          size: (mediaFile.size / 1024 / 1024).toFixed(2),
                                      })
                                    : isEdit && banner?.mediaUrl
                                      ? `${t("optional")}: ${banner.mediaUrl}`
                                      : t("mediaDescription")
                            }
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
                                disabled={!canSubmit}
                                radius="md"
                            >
                                {isEdit ? t("save") : tc("create")}
                            </Button>
                        )}
                    </Group>
                </Group>
            </Stack>
        </Modal>
    );
};

export { BannerFormModal };
