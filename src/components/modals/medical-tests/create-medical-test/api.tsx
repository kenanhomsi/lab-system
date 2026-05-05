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
  const createMutation = useMutation({
    mutationFn: async (data: { nameAr: string; nameEn: string; description: string }) =>
      medicalTestService.create({
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        price: 0,
        category: "general",
        sampleType: "unspecified",
        parameterSchema: data.description.trim() || "[]",
        status: "draft",
      }),
  });

  useMirrorRegistry("createMutation", createMutation);

  return <>{children}</>;
};

export { Api };