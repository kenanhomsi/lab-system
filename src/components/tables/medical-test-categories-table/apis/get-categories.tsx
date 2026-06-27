"use client";

import { frontendContainer } from "@/container";
import {
  MedicalTestCategoryFrontendService,
  medicalTestCategoryModuleNames,
} from "@/modules/medical-test-categories";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { emptyCategories } from "../store/api";
import { useMirror, useMirrorRegistry } from "../store";

const categoryService = frontendContainer.get<MedicalTestCategoryFrontendService>(
  medicalTestCategoryModuleNames.service,
);

const GetCategories = ({ children }: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");
  const { data, isPending, refetch } = useQuery({
    queryKey: ["medical-test-categories", pageNumber],
    queryFn: () =>
      categoryService.list({
        query: {
          Page: pageNumber,
          PageSize: 20,
          SortBy: "displayOrder",
          SortDesc: false,
        },
      }),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry("categoriesData", data ?? emptyCategories);
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchCategories", () => {
    void refetch();
  });

  return <>{children}</>;
};

export { GetCategories };
