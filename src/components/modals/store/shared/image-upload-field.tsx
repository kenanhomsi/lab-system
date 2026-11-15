"use client";

import { useState } from "react";
import { Button, FileInput, Group, Image, Stack, Text } from "@mantine/core";
import { useLocale } from "next-intl";
import { uploadImageFile } from "@/lib/website-pages/upload-pending-images";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
};

/** Uploads an image file and stores the returned URL (replaces manual URL inputs). */
export function ImageUploadField({ label, value, onChange, required }: ImageUploadFieldProps) {
  const isArabic = useLocale() === "ar";
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      onChange(await uploadImageFile(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : isArabic ? "فشل رفع الصورة" : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Stack gap={6}>
      <FileInput
        label={label}
        accept="image/*"
        required={required && !value}
        placeholder={isArabic ? "اختر صورة للرفع" : "Choose an image to upload"}
        disabled={uploading}
        onChange={(file) => void handleFile(file)}
        value={null}
        error={error}
      />
      {uploading ? (
        <Text size="xs" c="dimmed">
          {isArabic ? "جارٍ الرفع..." : "Uploading..."}
        </Text>
      ) : null}
      {value ? (
        <Group gap="sm" align="center">
          <Image src={value} alt="" w={72} h={72} radius="md" fit="cover" />
          <Button variant="subtle" color="red" size="xs" onClick={() => onChange("")}>
            {isArabic ? "إزالة الصورة" : "Remove image"}
          </Button>
        </Group>
      ) : null}
    </Stack>
  );
}
