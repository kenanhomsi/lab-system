"use client";

import { storeService } from "@/components/features/store";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";

const GetCategories = ({ children }: PropsWithChildren) => {
  const { data } = useQuery({
    queryKey: ["store", "admin", "categories"],
    queryFn: () => storeService.listCategories(),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry("categoriesData", data ?? []);

  return <>{children}</>;
};

export { GetCategories };
