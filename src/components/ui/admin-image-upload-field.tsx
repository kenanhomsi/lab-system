"use client";

import { useState } from "react";
import { Alert, FileInput, Image, Stack, Text } from "@mantine/core";
import { IconAlertCircle, IconPhoto, IconUpload } from "@tabler/icons-react";
import { axiosInstanceFront } from "@/lib/clients/frontend-instance";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

/** Uploads an admin-selected image and stores the returned object-storage URL. */
export function AdminImageUploadField({ label, value, onChange, required }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File | null) => {
    if (!file) {
      onChange("");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await axiosInstanceFront.post<{ url: string }>(
        "/admin/upload-image",
        body,
      );
      onChange(response.data.url);
    } catch {
      setError("تعذر رفع الصورة. تحقق من نوع الملف وحاول مجدداً.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Stack gap="xs">
      <FileInput
        label={label}
        accept="image/*"
        leftSection={<IconUpload size={16} />}
        placeholder={uploading ? "جاري رفع الصورة..." : "اختر صورة من الجهاز"}
        disabled={uploading}
        required={required && !value}
        clearable
        onChange={(file) => void upload(file)}
      />
      {value ? (
        <Stack gap={4}>
          <Image src={value} alt="" h={120} fit="contain" radius="md" />
          <Text size="xs" c="teal" lineClamp={1}>
            <IconPhoto size={12} /> تم رفع الصورة
          </Text>
        </Stack>
      ) : null}
      {error ? (
        <Alert color="red" icon={<IconAlertCircle size={16} />} py="xs">
          {error}
        </Alert>
      ) : null}
    </Stack>
  );
}
