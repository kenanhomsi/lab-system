/**
 * Appointment Details Modal - API Layer
 * Handles API calls and business logic
 */

"use client";

import { useEffect } from "react";
import type { PropsWithChildren } from "react";
import { useMirror } from "./store";
import { useDetailsState } from "./state";
import type { AppointmentDetailsResponse } from "./types";

const Api = ({ children }: PropsWithChildren) => {
    const appointmentId = useMirror("appointmentId");
    const { setAppointment, setIsLoading, setError } = useDetailsState();

    useEffect(() => {
        const fetchAppointment = async () => {
            if (!appointmentId) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/patient/appointments/${appointmentId}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch appointment details");
                }

                const data = (await response.json()) as AppointmentDetailsResponse;
                setAppointment(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointment();
    }, [appointmentId, setAppointment, setIsLoading, setError]);

    return <>{children}</>;
};

export { Api };
