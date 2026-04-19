/**
 * Appointment Details Modal - UI Layer
 * Renders the modal UI with appointment details
 */

"use client";

import { Modal, Stack, Group, Text, Badge, Loader, Center, Button, Alert } from "@mantine/core";
import { IconMapPin, IconCalendar, IconClock, IconUser, IconAlertCircle } from "@tabler/icons-react";
import { useMirror } from "./store";
import { useDetailsState } from "./state";

const UI = () => {
    const isOpen = useMirror("isOpen");
    const onClose = useMirror("onClose");
    const { appointment, isLoading, error } = useDetailsState();

    const getStatusColor = (status: string): string => {
        const colorMap: Record<string, string> = {
            pending: "yellow",
            confirmed: "blue",
            in_progress: "cyan",
            completed: "green",
            cancelled: "red",
        };
        return colorMap[status] || "gray";
    };

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    const formatTime = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        } catch {
            return dateString;
        }
    };

    return (
        <Modal opened={isOpen} onClose={onClose} title="Appointment Details" size="lg">
            {isLoading ? (
                <Center py="xl">
                    <Loader />
                </Center>
            ) : error ? (
                <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
                    {error}
                </Alert>
            ) : appointment ? (
                <Stack gap="lg">
                    <Group justify="space-between">
                        <div>
                            <Text fw={600} size="lg">
                                {appointment.name}
                            </Text>
                            <Text size="sm" c="dimmed">
                                {appointment.appointmentTypeName}
                            </Text>
                        </div>
                        <Badge color={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                    </Group>

                    {appointment.description && (
                        <div>
                            <Text fw={500} size="sm" mb="xs">
                                Description
                            </Text>
                            <Text size="sm">{appointment.description}</Text>
                        </div>
                    )}

                    <Stack gap="sm">
                        <Group gap="md">
                            <Group gap="xs">
                                <IconCalendar size={18} />
                                <div>
                                    <Text size="xs" c="dimmed">
                                        Date
                                    </Text>
                                    <Text size="sm">{formatDate(appointment.slot)}</Text>
                                </div>
                            </Group>
                            <Group gap="xs">
                                <IconClock size={18} />
                                <div>
                                    <Text size="xs" c="dimmed">
                                        Time
                                    </Text>
                                    <Text size="sm">{formatTime(appointment.slot)}</Text>
                                </div>
                            </Group>
                        </Group>

                        {appointment.doctorName && (
                            <Group gap="xs">
                                <IconUser size={18} />
                                <div>
                                    <Text size="xs" c="dimmed">
                                        Doctor
                                    </Text>
                                    <Text size="sm">Dr. {appointment.doctorName}</Text>
                                </div>
                            </Group>
                        )}

                        <Group gap="xs">
                            <IconMapPin size={18} />
                            <div>
                                <Text size="xs" c="dimmed">
                                    Location
                                </Text>
                                <Text size="sm">{appointment.address}</Text>
                            </div>
                        </Group>
                    </Stack>

                    {appointment.notes && (
                        <div>
                            <Text fw={500} size="sm" mb="xs">
                                Notes
                            </Text>
                            <Text size="sm">{appointment.notes}</Text>
                        </div>
                    )}

                    {appointment.medicalTestCompletionStatus && (
                        <div>
                            <Text fw={500} size="sm" mb="xs">
                                Medical Test Status
                            </Text>
                            <Badge variant="light">{appointment.medicalTestCompletionStatus}</Badge>
                        </div>
                    )}

                    <Group justify="flex-end" mt="lg">
                        <Button variant="light" onClick={onClose}>
                            Close
                        </Button>
                    </Group>
                </Stack>
            ) : null}
        </Modal>
    );
};

export { UI };
