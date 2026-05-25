"use client";
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";

import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useMirror } from "./store";

const UI = () => {
    const isOpen = useMirror("isOpen");
    const onClose = useMirror("onClose");
    const isSubmitting = useMirror("isSubmitting");
    const deleteMutation = useMirror("deleteMutation");
    const medicalTest = useMirror("medicalTest");

    const handleDelete = async () => {
        if (!medicalTest) return;

        try {
            await deleteMutation.mutateAsync(medicalTest.id);
            onClose();
        } catch (error) {
            console.error("Failed to delete medical test:", error);
        }
    };

    return (
        <Modal opened={isOpen} onClose={onClose} title="Delete Medical Test" centered>
            <Stack>
          <MutationErrorAlert />
                <Text size="sm">
                    Are you sure you want to delete this medical test? This action cannot be undone.
                </Text>
                {medicalTest && (
                    <Text size="sm" fw={500}>
                        Test: {medicalTest.nameAr} / {medicalTest.nameEn}
                    </Text>
                )}
                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button color="red" onClick={handleDelete} loading={isSubmitting || deleteMutation.isPending}>
                        Delete
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export { UI };