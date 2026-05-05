"use client";

import { Button, Group, Modal, Stack, TextInput, Textarea } from "@mantine/core";
import { useMirror } from "./store";

const UI = () => {
  const isOpen = useMirror("isOpen");
  const onClose = useMirror("onClose");
  const nameAr = useMirror("nameAr");
  const setNameAr = useMirror("setNameAr");
  const nameEn = useMirror("nameEn");
  const setNameEn = useMirror("setNameEn");
  const description = useMirror("description");
  const setDescription = useMirror("setDescription");
  const isSubmitting = useMirror("isSubmitting");
  const createMutation = useMirror("createMutation");

  const handleSubmit = async () => {
    if (!nameAr.trim() || !nameEn.trim()) return;
    
    try {
      await createMutation.mutateAsync({
        nameAr,
        nameEn,
        description,
      });
      onClose();
      setNameAr("");
      setNameEn("");
      setDescription("");
    } catch (error) {
      console.error("Failed to create medical test:", error);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Create Medical Test" centered>
      <Stack>
        <TextInput
          label="Name (Arabic)"
          value={nameAr}
          onChange={(e) => setNameAr(e.currentTarget.value)}
          placeholder="Enter Arabic name"
          required
        />
        <TextInput
          label="Name (English)"
          value={nameEn}
          onChange={(e) => setNameEn(e.currentTarget.value)}
          placeholder="Enter English name"
          required
        />
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          placeholder="Enter description"
          minRows={3}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={isSubmitting || createMutation.isPending}>
            Create
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };