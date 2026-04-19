/**
 * State Layer - Manages all component state and state transitions
 * Provides hooks for managing modal visibility and selection state
 */

"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useCallback, useState } from "react";
import type { AppointmentItem } from "./type";

interface StateContextType {
    selectedAppointment: AppointmentItem | null;
    setSelectedAppointment: (appointment: AppointmentItem | null) => void;
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (open: boolean) => void;
    isDetailsModalOpen: boolean;
    setIsDetailsModalOpen: (open: boolean) => void;
    isCancelConfirmOpen: boolean;
    setIsCancelConfirmOpen: (open: boolean) => void;
    statusFilter: "upcoming" | "completed" | "cancelled" | "all";
    setStatusFilter: (filter: "upcoming" | "completed" | "cancelled" | "all") => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

const State = ({ children }: PropsWithChildren) => {
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<"upcoming" | "completed" | "cancelled" | "all">(
        "all"
    );

    const value: StateContextType = {
        selectedAppointment,
        setSelectedAppointment: useCallback((apt) => setSelectedAppointment(apt), []),
        isCreateModalOpen,
        setIsCreateModalOpen: useCallback((open) => setIsCreateModalOpen(open), []),
        isDetailsModalOpen,
        setIsDetailsModalOpen: useCallback((open) => setIsDetailsModalOpen(open), []),
        isCancelConfirmOpen,
        setIsCancelConfirmOpen: useCallback((open) => setIsCancelConfirmOpen(open), []),
        statusFilter,
        setStatusFilter: useCallback((filter) => setStatusFilter(filter), []),
    };

    return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
};

export const useAppointmentState = () => {
    const context = useContext(StateContext);
    if (!context) {
        throw new Error("useAppointmentState must be used within State provider");
    }
    return context;
};

export default State;
