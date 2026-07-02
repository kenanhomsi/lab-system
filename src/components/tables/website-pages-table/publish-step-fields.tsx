"use client";

import {
  forwardRef,
  memo,
  useImperativeHandle,
  useState,
  type ForwardedRef,
} from "react";
import {
  Badge,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  ThemeIcon,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { IconEye } from "@tabler/icons-react";
import {
  fromMantineDateTimeValue,
  toMantineDateTimeValue,
  type PageFormState,
} from "@/lib/website-pages/form-state";
import {
  WEBSITE_PAGE_LANGUAGE_LABELS,
  WEBSITE_PAGE_LANGUAGES,
} from "@/lib/website-pages/language";

export type PublishStepFieldsHandle = {
  getChangeNotes: () => string;
  resetChangeNotes: () => void;
};

type PublishDateFieldsProps = {
  publishScheduledAt: string;
  publishedAt: string;
  publishScheduledAtLabel: string;
  publishedAtLabel: string;
  onPublishScheduledAtChange: (value: string) => void;
  onPublishedAtChange: (value: string) => void;
};

const PublishDateFields = memo(function PublishDateFields({
  publishScheduledAt,
  publishedAt,
  publishScheduledAtLabel,
  publishedAtLabel,
  onPublishScheduledAtChange,
  onPublishedAtChange,
}: PublishDateFieldsProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
      <DateTimePicker
        label={publishScheduledAtLabel}
        value={toMantineDateTimeValue(publishScheduledAt)}
        onChange={(value) =>
          onPublishScheduledAtChange(fromMantineDateTimeValue(value))
        }
        valueFormat="MM/DD/YYYY hh:mm A"
        clearable
      />
      <DateTimePicker
        label={publishedAtLabel}
        value={toMantineDateTimeValue(publishedAt)}
        onChange={(value) => onPublishedAtChange(fromMantineDateTimeValue(value))}
        valueFormat="MM/DD/YYYY hh:mm A"
        clearable
      />
    </SimpleGrid>
  );
});

type PublishStepFieldsProps = {
  form: PageFormState;
  onPublishScheduledAtChange: (value: string) => void;
  onPublishedAtChange: (value: string) => void;
  publishSectionLabel: string;
  publishSummaryTitle: string;
  publishSummaryBlocksLabel: string;
  publishStatusLabel: (status: PageFormState["publishStatus"]) => string;
  publishScheduledAtLabel: string;
  publishedAtLabel: string;
  changeNotesLabel: string;
};

function PublishStepFieldsInner(
  {
    form,
    onPublishScheduledAtChange,
    onPublishedAtChange,
    publishSectionLabel,
    publishSummaryTitle,
    publishSummaryBlocksLabel,
    publishStatusLabel,
    publishScheduledAtLabel,
    publishedAtLabel,
    changeNotesLabel,
  }: PublishStepFieldsProps,
  ref: ForwardedRef<PublishStepFieldsHandle>,
) {
  const [changeNotes, setChangeNotes] = useState("");

  useImperativeHandle(ref, () => ({
    getChangeNotes: () => changeNotes,
    resetChangeNotes: () => setChangeNotes(""),
  }));

  return (
    <Paper withBorder radius="lg" p="md">
      <Stack gap="md">
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon variant="light" color="cyan" radius="md">
            <IconEye size={18} />
          </ThemeIcon>
          <Text fw={600}>{publishSectionLabel}</Text>
        </Group>
        <Paper withBorder radius="md" p="sm" bg="gray.0">
          <Stack gap="xs">
            <Text size="sm" fw={600}>
              {publishSummaryTitle}
            </Text>
            <Group gap="md">
              <Badge variant="light" color="cyan">
                {publishSummaryBlocksLabel}
              </Badge>
              {WEBSITE_PAGE_LANGUAGES.map((language) => (
                <Badge key={language} variant="light" color="blue">
                  {WEBSITE_PAGE_LANGUAGE_LABELS[language]}:{" "}
                  {form.translations[language].title || "-"}
                </Badge>
              ))}
              <Badge variant="light" color="gray">
                {publishStatusLabel(form.publishStatus)}
              </Badge>
            </Group>
          </Stack>
        </Paper>
        <Divider />
        <PublishDateFields
          publishScheduledAt={form.publishScheduledAt}
          publishedAt={form.publishedAt}
          publishScheduledAtLabel={publishScheduledAtLabel}
          publishedAtLabel={publishedAtLabel}
          onPublishScheduledAtChange={onPublishScheduledAtChange}
          onPublishedAtChange={onPublishedAtChange}
        />
        <Textarea
          label={changeNotesLabel}
          value={changeNotes}
          onChange={(event) => setChangeNotes(event.currentTarget.value)}
          minRows={3}
        />
      </Stack>
    </Paper>
  );
}

export const PublishStepFields = forwardRef(PublishStepFieldsInner);
