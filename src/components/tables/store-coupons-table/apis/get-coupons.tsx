"use client";

import { storeService } from "@/components/features/store";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";

const GetCoupons = ({ children }: PropsWithChildren) => {
  const { data, isPending, refetch } = useQuery({
    queryKey: ["store", "admin", "coupons"],
    queryFn: () => storeService.listCoupons(),
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry("couponsData", data ?? []);
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchCoupons", () => {
    void refetch();
  });

  return <>{children}</>;
};

export { GetCoupons };
