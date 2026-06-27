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
    const updateMutation = useManagedMutation({
        mutationFn: async (params: {
            id: string;
            data: { nameAr: string; nameEn: string; description: string };
        }) =>
            medicalTestService.update({
                id: params.id,
                nameAr: params.data.nameAr,
                nameEn: params.data.nameEn,
                price: 0,
                categoryMedicalId: 0,
                sampleType: "unspecified",
                parameterSchema: params.data.description.trim() || "[]",
                status: "draft",
            }),
    });

    useMirrorRegistry("updateMutation", updateMutation);

    return <MutationErrorProvider>{children}</MutationErrorProvider>;
};

export { Api };
