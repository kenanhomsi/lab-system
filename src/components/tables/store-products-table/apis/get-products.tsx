"use client";

import { storeService } from "@/components/features/store";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { emptyProductsData } from "../store/api";

const GetProducts = ({ children }: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["store", "admin", "products", pageNumber],
    queryFn: () => storeService.listProducts({ query: { page: pageNumber, pageSize: 20 } }),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry("productsData", data ?? emptyProductsData());
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchProducts", () => {
    void refetch();
  });

  return <>{children}</>;
};

export { GetProducts };
