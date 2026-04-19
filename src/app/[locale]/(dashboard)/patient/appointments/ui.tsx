/**
 * UI Layer - Main rendering component for appointments page
 * Enhanced UI/UX for a premium patient dashboard experience.
 */

"use client";

import {
    Container,
    Tabs,
    Button,
    Group,
    Stack,
    Card,
    Badge,
    Text,
    Center,
    Paper,
    Grid,
    ThemeIcon,
    Tooltip,
    ActionIcon,
    Avatar,
    Box,
    Title,
} from "@mantine/core";
import {
    IconPlus,
    IconCalendar,
    IconClock,
    IconMapPin,
    IconTrash,
    IconAlertCircle,
    IconCheck,
    IconCalendarStats,
    IconActivity,
    IconCalendarOff,
} from "@tabler/icons-react";
import { useAppointmentState } from "./state";
import { useAppointmentUtils } from "./utils";
import { useMirror } from "./store";
import { Factory as CreateAppointmentModal } from "@/components/modals/appointments/create-appointment/factory";
import { Factory as CancelAppointmentModal } from "@/components/modals/appointments/cancel-appointment/factory";
import AppointmentDetailsModalFactory from "@/components/modals/appointments/appointment-details/factory";
import type { AppointmentItem } from "./type";
import dayjs from "dayjs";

const UI = () => {
    const {
        selectedAppointment,
        setSelectedAppointment,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isDetailsModalOpen,
        setIsDetailsModalOpen,
        isCancelConfirmOpen,
        setIsCancelConfirmOpen,
        statusFilter,
        setStatusFilter,
    } = useAppointmentState();

    const { formatAppointmentDate, getAppointmentStatus, filterAppointmentsByStatus, formatTimeSlot } =
        useAppointmentUtils();

    const appointments = useMirror("appointments");

    const filteredAppointments = filterAppointmentsByStatus(appointments, statusFilter);

    const upcomingCount = filterAppointmentsByStatus(appointments, "upcoming").length;
    const completedCount = filterAppointmentsByStatus(appointments, "completed").length;
    const cancelledCount = filterAppointmentsByStatus(appointments, "cancelled").length;

    const handleCreateClick = () => {
        setIsCreateModalOpen(true);
    };

    const handleSelectAppointment = (appointment: AppointmentItem) => {
        setSelectedAppointment(appointment);
    };

    const handleCancelClick = (appointment: AppointmentItem) => {
        setSelectedAppointment(appointment);
        setIsCancelConfirmOpen(true);
    };

    const handleCreateModalClose = () => {
        setIsCreateModalOpen(false);
    };

    return (
        <Container size="xl" py="xl">
            {/* Premium Header Banner */}
            <Paper 
                radius="lg" 
                p="xl" 
                mb="xl" 
                style={{
                    background: "linear-gradient(135deg, var(--mantine-color-blue-9) 0%, var(--mantine-color-cyan-6) 100%)",
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2)",
                }}
            >
                <div style={{ position: "relative", zIndex: 2 }}>
                    <Group justify="space-between" align="flex-start">
                        <div>
                            <Title order={1} mb={8} style={{ letterSpacing: "-0.5px", color: "white" }}>
                                My Appointments
                            </Title>
                            <Text size="lg" opacity={0.9} style={{ maxWidth: 500 }}>
                                Manage your schedule, book new visits, and keep track of your health journey seamlessly.
                            </Text>
                        </div>
                        <Button
                            leftSection={<IconPlus size={20} />}
                            onClick={handleCreateClick}
                            variant="white"
                            color="blue"
                            size="lg"
                            radius="md"
                            fw={700}
                            style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.1)" }}
                        >
                            Book Appointment
                        </Button>
                    </Group>
                </div>
                
                {/* Decorative background element */}
                <IconActivity 
                    size={240} 
                    style={{ 
                        position: "absolute", 
                        right: "-20px", 
                        top: "-40px", 
                        opacity: 0.1,
                        transform: "rotate(15deg)"
                    }} 
                />
            </Paper>

            {/* Glassmorphism Stats Overview */}
            <Grid mb="xl" gutter="lg">
                <Grid.Col span={{ base: 12, xs: 6, sm: 3 }}>
                    <StatCard 
                        title="Total Visits" 
                        value={appointments.length} 
                        icon={<IconCalendarStats size={24} />} 
                        color="blue" 
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 6, sm: 3 }}>
                    <StatCard 
                        title="Upcoming" 
                        value={upcomingCount} 
                        icon={<IconClock size={24} />} 
                        color="cyan" 
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 6, sm: 3 }}>
                    <StatCard 
                        title="Completed" 
                        value={completedCount} 
                        icon={<IconCheck size={24} />} 
                        color="green" 
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 6, sm: 3 }}>
                    <StatCard 
                        title="Cancelled" 
                        value={cancelledCount} 
                        icon={<IconCalendarOff size={24} />} 
                        color="red" 
                    />
                </Grid.Col>
            </Grid>

            {/* Premium Tabs Section */}
            <Box mb="xl">
                <Tabs
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value as "upcoming" | "completed" | "cancelled" | "all")}
                    variant="pills"
                    radius="xl"
                    defaultValue="all"
                    styles={{
                        list: {
                            gap: '8px',
                            background: 'var(--mantine-color-gray-0)',
                            padding: '6px',
                            borderRadius: '100px',
                            display: 'inline-flex',
                            border: '1px solid var(--mantine-color-gray-2)'
                        },
                        tab: {
                            fontWeight: 600,
                            padding: '10px 20px',
                            transition: 'all 0.2s ease',
                            '&[data-active]': {
                                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                            }
                        }
                    }}
                >
                    <Tabs.List>
                        <Tabs.Tab value="all" leftSection={<IconCalendar size={16} />}>
                            All <Badge size="xs" circle ml={6} color="blue">{appointments.length}</Badge>
                        </Tabs.Tab>
                        <Tabs.Tab value="upcoming" leftSection={<IconClock size={16} />}>
                            Upcoming <Badge size="xs" circle ml={6} color="cyan">{upcomingCount}</Badge>
                        </Tabs.Tab>
                        <Tabs.Tab value="completed" leftSection={<IconCheck size={16} />}>
                            Completed <Badge size="xs" circle ml={6} color="green">{completedCount}</Badge>
                        </Tabs.Tab>
                        <Tabs.Tab value="cancelled" leftSection={<IconAlertCircle size={16} />}>
                            Cancelled <Badge size="xs" circle ml={6} color="red">{cancelledCount}</Badge>
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            </Box>

            {/* Appointments List */}
            {filteredAppointments.length === 0 ? (
                <Paper p="xl" radius="lg" style={{ border: '2px dashed var(--mantine-color-gray-3)', background: 'transparent' }}>
                    <Center py={80}>
                        <Stack align="center" gap="lg">
                            <Box style={{ position: 'relative' }}>
                                <ThemeIcon size={100} variant="light" color="blue" radius="100%">
                                    <IconCalendarPlus size={50} stroke={1.5} />
                                </ThemeIcon>
                            </Box>
                            <div style={{ textAlign: "center", maxWidth: 400 }}>
                                <Text fw={700} size="xl" mb={8}>
                                    Your Schedule is Clear
                                </Text>
                                <Text size="md" c="dimmed" mb="xl">
                                    {statusFilter === "all"
                                        ? "You don't have any appointments booked right now. Schedule your next visit to stay on top of your health."
                                        : `You don't have any ${statusFilter} appointments to show.`}
                                </Text>
                                {statusFilter === "all" && (
                                    <Button
                                        leftSection={<IconPlus size={18} />}
                                        onClick={handleCreateClick}
                                        size="md"
                                        radius="md"
                                        color="blue"
                                    >
                                        Schedule an Appointment
                                    </Button>
                                )}
                            </div>
                        </Stack>
                    </Center>
                </Paper>
            ) : (
                <Grid gutter="xl">
                    {filteredAppointments.map((appointment) => (
                        <Grid.Col key={appointment.id} span={{ base: 12, md: 6 }}>
                            <AppointmentCard
                                appointment={appointment}
                                onDetails={() => {
                                    setSelectedAppointment(appointment);
                                    setIsDetailsModalOpen(true);
                                }}
                                onCancel={handleCancelClick}
                                getAppointmentStatus={getAppointmentStatus}
                                formatTimeSlot={formatTimeSlot}
                            />
                        </Grid.Col>
                    ))}
                </Grid>
            )}

            {/* Modals */}
            <CreateAppointmentModal isOpen={isCreateModalOpen} onClose={handleCreateModalClose} />

            {selectedAppointment && (
                <>
                    <CancelAppointmentModal
                        isOpen={isCancelConfirmOpen}
                        onClose={() => setIsCancelConfirmOpen(false)}
                        appointment={selectedAppointment}
                    />
                    <AppointmentDetailsModalFactory
                        isOpen={isDetailsModalOpen}
                        onClose={() => setIsDetailsModalOpen(false)}
                        appointmentId={selectedAppointment.id}
                    />
                </>
            )}
        </Container>
    );
};

// Sub-components

const StatCard = ({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) => (
    <Paper
        p="lg"
        radius="lg"
        withBorder
        style={{
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            cursor: "default",
            backgroundColor: "white",
            borderColor: `var(--mantine-color-${color}-2)`,
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = `0 12px 24px var(--mantine-color-${color}-1)`;
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "none";
        }}
    >
        <Group justify="space-between" align="flex-start" mb="md">
            <Text size="sm" fw={600} c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>
                {title}
            </Text>
            <ThemeIcon variant="light" color={color} size={48} radius="md">
                {icon}
            </ThemeIcon>
        </Group>
        <Text fw={800} size="32px" style={{ lineHeight: 1 }}>
            {value}
        </Text>
        
        <Box 
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '4px',
                width: '100%',
                background: `var(--mantine-color-${color}-5)`,
                opacity: 0.8
            }}
        />
    </Paper>
);

const IconCalendarPlus = ({ size = 24, stroke = 2, ...props }: React.ComponentPropsWithoutRef<'svg'> & { size?: number; stroke?: number | string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth={stroke} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
    >
        <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
        <path d="M16 3v4" />
        <path d="M8 3v4" />
        <path d="M4 11h16" />
        <path d="M10 16h4" />
        <path d="M12 14v4" />
    </svg>
);

interface AppointmentCardProps {
    appointment: AppointmentItem;
    onDetails: () => void;
    onCancel: (appointment: AppointmentItem) => void;
    getAppointmentStatus: (status: AppointmentStatus) => { label: string; color: string };
    formatTimeSlot: (slot: string) => string;
}

const AppointmentCard = ({
    appointment,
    onDetails,
    onCancel,
    getAppointmentStatus,
    formatTimeSlot,
}: AppointmentCardProps) => {
    const status = getAppointmentStatus(appointment.status);
    const isUpcoming = appointment.status === "pending" || appointment.status === "confirmed";
    
    // Parse date for calendar tear-off
    const dateObj = dayjs(appointment.slot);
    const dayName = dateObj.format('ddd');
    const dayNumber = dateObj.format('DD');
    const monthName = dateObj.format('MMM');

    return (
        <Card
            shadow="sm"
            padding={0}
            radius="lg"
            withBorder
            style={{
                transition: "all 0.3s ease",
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                overflow: "hidden",
                borderLeft: `6px solid var(--mantine-color-${status.color}-5)`,
            }}
            onClick={onDetails}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.08)";
                e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            {/* Left Calendar Tear-off */}
            <Box 
                p="md" 
                style={{ 
                    background: `var(--mantine-color-${status.color}-0)`, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    minWidth: '90px',
                    borderRight: '1px dashed var(--mantine-color-gray-3)'
                }}
            >
                <Text size="sm" fw={700} c={status.color} tt="uppercase">{monthName}</Text>
                <Text size="32px" fw={900} c="dark" style={{ lineHeight: 1, margin: '4px 0' }}>{dayNumber}</Text>
                <Text size="xs" fw={600} c="dimmed">{dayName}</Text>
            </Box>

            {/* Right Details Container */}
            <Box p="lg" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Group justify="space-between" align="flex-start" mb="sm">
                    <Box style={{ flex: 1 }}>
                        <Group gap="xs" mb={4}>
                            <Badge size="sm" color={status.color} variant="light" fw={600}>
                                {status.label}
                            </Badge>
                            <Group gap={4} c="dimmed">
                                <IconClock size={14} />
                                <Text size="sm" fw={600}>{formatTimeSlot(appointment.slot)}</Text>
                            </Group>
                        </Group>
                        <Text fw={700} size="lg" mb={2}>
                            {appointment.name}
                        </Text>
                        <Text size="sm" c="dimmed" fw={500} lineClamp={1}>
                            {appointment.appointmentTypeName}
                        </Text>
                    </Box>
                    
                    {appointment.doctorName && (
                        <Tooltip label={`Dr. ${appointment.doctorName}`} withArrow>
                            <Avatar size="md" radius="xl" color="blue" variant="light">
                                {appointment.doctorName.substring(0, 2).toUpperCase()}
                            </Avatar>
                        </Tooltip>
                    )}
                </Group>

                <Group justify="space-between" align="center" mt="auto" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-1)' }}>
                    <Group gap="xs" style={{ flex: 1 }}>
                        <ThemeIcon variant="light" color="gray" size="sm" radius="xl">
                            <IconMapPin size={12} />
                        </ThemeIcon>
                        <Text size="xs" fw={500} c="dimmed" style={{ maxWidth: '180px' }} truncate>
                            {appointment.address || "Online Consultation"}
                        </Text>
                    </Group>
                    
                    <Group gap="xs">
                        {isUpcoming && (
                            <Tooltip label="Cancel" withArrow>
                                <ActionIcon
                                    variant="subtle"
                                    color="red"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onCancel(appointment);
                                    }}
                                    radius="md"
                                >
                                    <IconTrash size={18} />
                                </ActionIcon>
                            </Tooltip>
                        )}
                        <Button
                            variant="light"
                            color="blue"
                            size="xs"
                            radius="md"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDetails();
                            }}
                        >
                            View Details
                        </Button>
                    </Group>
                </Group>
            </Box>
        </Card>
    );
};

export default UI;

