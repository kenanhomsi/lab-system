"use client";

import { storeService } from "@/components/features/store";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";

const GetBanners = ({ children }: PropsWithChildren) => {
  const { data, isPending, refetch } = useQuery({
    queryKey: ["store", "admin", "banners"],
    queryFn: () => storeService.listBanners(),
  });

  useMirrorRegistry("bannersData", data ?? []);
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchBanners", () => {
    void refetch();
  });

  return <>{children}</>;
};

export { GetBanners };
