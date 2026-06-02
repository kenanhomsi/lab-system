"use client";

import { storeService } from "@/components/features/store";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";

const GetProducts = ({ children }: PropsWithChildren) => {
  const { data, isPending } = useQuery({
    queryKey: ["store", "admin", "products", "all"],
    queryFn: async () => {
      const res = await storeService.listProducts({ query: { page: 1, pageSize: 500 } });
      return res.items;
    },
    staleTime: 1000 * 60 * 5,
  });

  useMirrorRegistry("productsData", data ?? []);
  useMirrorRegistry("isProductsPending", isPending);

  return <>{children}</>;
};

export { GetProducts };
