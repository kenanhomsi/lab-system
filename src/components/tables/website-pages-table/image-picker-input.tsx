"use client";

import { useEffect, useMemo } from "react";
import { FileInput, Image, Stack, Text, TextInput } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";

type ImagePickerInputProps = {
  label: string;
  value: string;
  file: File | null;
  onChange: (url: string, file: File | null) => void;
  urlPlaceholder?: string;
  uploadLabel?: string;
  urlLabel?: string;
  previewAlt?: string;
};

/**
 * Hybrid image field: upload from device, paste a URL, or preview the current image.
 */
export function ImagePickerInput({
  label,
  value,
  file,
  onChange,
  urlPlaceholder,
  uploadLabel,
  urlLabel,
  previewAlt = "",
}: ImagePickerInputProps) {
  const previewUrl = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return value.trim() || "";
  }, [file, value]);

  useEffect(() => {
    if (!file || !previewUrl.startsWith("blob:")) return undefined;
    return () => URL.revokeObjectURL(previewUrl);
  }, [file, previewUrl]);

  return (
    <Stack gap="xs">
      <FileInput
        label={uploadLabel ?? label}
        accept="image/*"
        value={file}
        onChange={(nextFile) => onChange(nextFile ? "" : value, nextFile)}
        leftSection={<IconUpload size={14} />}
        clearable
      />
      <TextInput
        label={urlLabel}
        value={value}
        placeholder={urlPlaceholder}
        onChange={(event) => onChange(event.currentTarget.value, null)}
      />
      {previewUrl ? (
        <Stack gap={4}>
          <Text size="xs" c="dimmed">
            {label}
          </Text>
          <Image src={previewUrl} alt={previewAlt || label} h={100} radius="md" fit="cover" />
        </Stack>
      ) : null}
    </Stack>
  );
}
