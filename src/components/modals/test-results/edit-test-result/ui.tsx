"use client";

import { Button, Group, Modal, NumberInput, Stack, TextInput } from "@mantine/core";
import { useMemo, useState } from "react";
import { useMirror } from "./store";
import type { TestResultItem } from "@/components/tables/test-results-table/types";
import type { UpdateTestResultFrontendParams } from "@/modules/TestResults/frontend/types";
import {
  buildJsonObjectFromPairs,
  JsonbKeyValueEditor,
  parsePairsFromJsonObjectString,
  type JsonbKeyValuePair,
} from "@/components/ui/jsonb-key-value-editor";

const buildInitialForm = (initial?: TestResultItem | null) => ({
  id: initial ? String(initial.id) : "",
  testRequestId: initial?.testRequestId ?? 0,
  resultDate: initial?.resultDate ?? "",
  status: initial?.status ?? "pending",
  pdfUrl: initial?.pdfUrl ?? "",
});

const UI = () => {
  const props = useMirror("props") as {
    opened?: boolean;
    onClose?: () => void;
    testResult?: TestResultItem | null;
  };
  const submitAction = useMirror("submitAction") as (
    p: UpdateTestResultFrontendParams,
  ) => Promise<unknown>;
  const initial = props.testResult;

  const onClose = props.onClose || (() => { });

  return (
    <Modal
      size="xl"
      opened={Boolean(props.opened)}
      onClose={onClose}
      title="Edit test result"
      centered
      styles={{
        content: {
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
        body: {
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
      }}
    >
      <EditTestResultBody
        key={initial?.id ?? "empty"}
        initial={initial}
        onClose={onClose}
        submitAction={submitAction}
      />
    </Modal>
  );
};

const EditTestResultBody = ({
  initial,
  onClose,
  submitAction,
}: {
  initial?: TestResultItem | null;
  onClose: () => void;
  submitAction: (p: UpdateTestResultFrontendParams) => Promise<unknown>;
}) => {
  const [form, setForm] = useState(() => buildInitialForm(initial));
  const [resultPairs, setResultPairs] = useState<JsonbKeyValuePair[]>(() =>
    parsePairsFromJsonObjectString(initial?.resultData ?? ""),
  );

  const resultDataPreview = useMemo(() => {
    const obj = buildJsonObjectFromPairs(resultPairs);
    return JSON.stringify(obj, null, 2);
  }, [resultPairs]);

  return (
    <Stack>
      <NumberInput label="Test request ID" value={form.testRequestId} disabled />
      <TextInput
        label="Result date (ISO 8601)"
        value={form.resultDate}
        onChange={(e) => setForm({ ...form, resultDate: e.currentTarget.value })}
      />
      <TextInput
        label="Status"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.currentTarget.value })}
      />
      <JsonbKeyValueEditor
        title="Result data"
        description="Add key/value fields to generate JSON payload"
        pairs={resultPairs}
        onPairsChange={setResultPairs}
        keyLabel="Key"
        valueLabel="Value"
        keyPlaceholder="ex: t1"
        valuePlaceholder="ex: 3.5"
        previewLabel="Generated JSON preview"
        previewValue={resultDataPreview}
      />
      <TextInput
        label="PDF URL"
        value={form.pdfUrl}
        onChange={(e) => setForm({ ...form, pdfUrl: e.currentTarget.value })}
      />
      <Group justify="flex-end">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={async () => {
            const resultData = JSON.stringify(buildJsonObjectFromPairs(resultPairs));
            const payload: UpdateTestResultFrontendParams = {
              id: form.id,
              resultDate: form.resultDate,
              resultData,
              pdfUrl: form.pdfUrl,
              status: form.status,
            };
            await submitAction(payload);
            onClose();
          }}
        >
          Save
        </Button>
      </Group>
    </Stack>
  );
};

export { UI };
