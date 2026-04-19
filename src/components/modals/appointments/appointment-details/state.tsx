/**
 * Appointment Details Modal - State Layer
 * Manages local component state
 */

"use client";

import { createContext, useContext, useState } from "react";
import type { PropsWithChildren } from "react";
import type { AppointmentDetailsResponse } from "./types";

interface StateContextType {
    appointment: AppointmentDetailsResponse | null;
    setAppointment: (apt: AppointmentDetailsResponse | null) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

const State = ({ children }: PropsWithChildren) => {
    const [appointment, setAppointment] = useState<AppointmentDetailsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const value: StateContextType = {
        appointment,
        setAppointment,
        isLoading,
        setIsLoading,
        error,
        setError,
    };

    return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
};

export const useDetailsState = () => {
    const context = useContext(StateContext);
    if (!context) {
        throw new Error("useDetailsState must be used within State provider");
    }
    return context;
};

export { State };
