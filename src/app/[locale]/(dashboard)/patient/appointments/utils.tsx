/**
 * Utils Layer - Business logic and utility functions
 * Provides helper functions for filtering, formatting, and API operations
 */

"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useCallback } from "react";
import type { AppointmentItem, AppointmentStatus } from "./type";

interface UtilsContextType {
    formatAppointmentDate: (dateString: string) => string;
    getAppointmentStatus: (status: AppointmentStatus) => { label: string; color: string };
    filterAppointmentsByStatus: (
        appointments: AppointmentItem[],
        status: "upcoming" | "completed" | "cancelled" | "all"
    ) => AppointmentItem[];
    isUpcomingAppointment: (appointment: AppointmentItem) => boolean;
    handleCancelAppointment: (appointmentId: string) => Promise<void>;
    formatTimeSlot: (slot: string) => string;
}

const UtilsContext = createContext<UtilsContextType | undefined>(undefined);

const Utils = ({ children }: PropsWithChildren) => {
    const formatAppointmentDate = useCallback((dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return dateString;
        }
    }, []);

    const formatTimeSlot = useCallback((slot: string) => {
        try {
            const date = new Date(slot);
            return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        } catch {
            return slot;
        }
    }, []);

    const getAppointmentStatus = useCallback(
        (status: AppointmentStatus) => {
            const statusMap: Record<AppointmentStatus, { label: string; color: string }> = {
                pending: { label: "Pending", color: "yellow" },
                confirmed: { label: "Confirmed", color: "blue" },
                in_progress: { label: "In Progress", color: "cyan" },
                completed: { label: "Completed", color: "green" },
                cancelled: { label: "Cancelled", color: "red" },
            };
            return statusMap[status] || { label: "Unknown", color: "gray" };
        },
        []
    );

    const isUpcomingAppointment = useCallback((appointment: AppointmentItem) => {
        const now = new Date();
        const appointmentDate = new Date(appointment.slot);
        return appointmentDate > now && (appointment.status === "pending" || appointment.status === "confirmed");
    }, []);

    const filterAppointmentsByStatus = useCallback(
        (appointments: AppointmentItem[], status: "upcoming" | "completed" | "cancelled" | "all") => {
            if (status === "all") return appointments;

            return appointments.filter((apt) => {
                if (status === "upcoming") {
                    return isUpcomingAppointment(apt);
                }
                if (status === "completed") {
                    return apt.status === "completed";
                }
                if (status === "cancelled") {
                    return apt.status === "cancelled";
                }
                return true;
            });
        },
        [isUpcomingAppointment]
    );

    const handleCancelAppointment = useCallback(async (appointmentId: string) => {
        try {
            const response = await fetch(`/api/patient/appointments/${appointmentId}/cancel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to cancel appointment: ${response.statusText}`);
            }

            // Success - state update will be handled by caller
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            throw error;
        }
    }, []);

    const value: UtilsContextType = {
        formatAppointmentDate,
        getAppointmentStatus,
        filterAppointmentsByStatus,
        isUpcomingAppointment,
        handleCancelAppointment,
        formatTimeSlot,
    };

    return <UtilsContext.Provider value={value}>{children}</UtilsContext.Provider>;
};

export const useAppointmentUtils = () => {
    const context = useContext(UtilsContext);
    if (!context) {
        throw new Error("useAppointmentUtils must be used within Utils provider");
    }
    return context;
};

export default Utils;
