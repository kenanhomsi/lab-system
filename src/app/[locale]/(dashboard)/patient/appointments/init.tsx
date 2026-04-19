/**
 * Init Layer - Registers initial data into the store
 * This "use client" component receives data from the Server Component
 * and synchronizes it into the Zustand mirror store
 */

"use client";

import type { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import type { AppointmentItem } from "./type";

type Props = PropsWithChildren<{
    appointmentsList: AppointmentItem[];
}>;

const Init = ({ children, appointmentsList }: Props) => {
    // Register appointments list into the store
    useMirrorRegistry("appointments", appointmentsList);

    return <>{children}</>;
};

export default Init;
