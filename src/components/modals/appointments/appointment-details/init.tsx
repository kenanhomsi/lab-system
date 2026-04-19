/**
 * Appointment Details Modal - Init Layer
 * Registers modal props into context
 */

"use client";

import type { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import type { FactoryProps } from "./types";

type Props = PropsWithChildren<FactoryProps>;

const Init = ({ children, isOpen, onClose, appointmentId, onSuccess }: Props) => {
    useMirrorRegistry("isOpen", isOpen);
    useMirrorRegistry("onClose", onClose);
    useMirrorRegistry("appointmentId", appointmentId);
    useMirrorRegistry("onSuccess", onSuccess);

    return <>{children}</>;
};

export { Init };
