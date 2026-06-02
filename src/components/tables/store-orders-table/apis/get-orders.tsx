"use client";

import { storeService } from "@/components/features/store";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { emptyOrders } from "../store/api";
import { useMirror, useMirrorRegistry } from "../store";

const GetOrders = ({ children }: PropsWithChildren) => {
  const pageNumber = useMirror("pageNumber");
  const pageSize = useMirror("pageSize");

  const { data, isPending, refetch } = useQuery({
    queryKey: ["store", "admin", "orders", pageNumber],
    queryFn: () =>
      storeService.listOrders({ query: { page: pageNumber, pageSize } }),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry("ordersData", data ?? emptyOrders());
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchOrders", () => {
    void refetch();
  });

  return <>{children}</>;
};

export { GetOrders };
