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
    const updateMutation = useMutation({
        mutationFn: async (params: {
            id: string;
            data: { nameAr: string; nameEn: string; description: string };
        }) =>
            medicalTestService.update({
                id: params.id,
                nameAr: params.data.nameAr,
                nameEn: params.data.nameEn,
                price: 0,
                category: "general",
                sampleType: "unspecified",
                parameterSchema: params.data.description.trim() || "[]",
                status: "draft",
            }),
    });

    useMirrorRegistry("updateMutation", updateMutation);

    return <>{children}</>;
};

export { Api };