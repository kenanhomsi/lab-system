"use client";

import { frontendContainer } from "@/container";
import { MedicalTestFrontendService, medicalTestModuleNames } from "@/modules/medical-tests";
import { useMutation } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";

const medicalTestService = frontendContainer.get<MedicalTestFrontendService>(
    medicalTestModuleNames.service
);

const Api = ({ children }: PropsWithChildren) => {
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => medicalTestService.delete({ id }),
    });

    useMirrorRegistry("deleteMutation", deleteMutation);

    return <>{children}</>;
};

export { Api };