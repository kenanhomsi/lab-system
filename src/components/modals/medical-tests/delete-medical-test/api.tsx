"use client";

import { frontendContainer } from "@/container";
import { MedicalTestFrontendService, medicalTestModuleNames } from "@/modules/medical-tests";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";

const medicalTestService = frontendContainer.get<MedicalTestFrontendService>(
    medicalTestModuleNames.service
);

const Api = ({ children }: PropsWithChildren) => {
    const deleteMutation = useManagedMutation({
        mutationFn: async (id: string) => medicalTestService.delete({ id }),
    });

    useMirrorRegistry("deleteMutation", deleteMutation);

    return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { Api };