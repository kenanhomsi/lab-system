/**
 * Observer Layer - Subscribes to appointment events for reactive updates
 * Listens to appointment creation, cancellation, and completion events
 */

"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useMirror } from "./store";

const Observer = ({ children }: PropsWithChildren) => {
    // Subscribe to appointments store changes for event observation
    const appointments = useMirror("appointments");

    useEffect(() => {
        // This is where event subscriptions would be added
        // For example, subscribing to AppointmentService events:
        // - onAppointmentCreated() → refetch appointments
        // - onAppointmentCancelled() → refetch appointments
        // - onAppointmentCompleted() → refetch appointments

        // Currently, subsequent layers handle event-driven updates via state management
    }, [appointments]);

    return <>{children}</>;
};

export default Observer;
