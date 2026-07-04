"use client";

import { storeService } from "@/components/features/store";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";

const GetSliders = ({ children }: PropsWithChildren) => {
  const { data, isPending, refetch } = useQuery({
    queryKey: ["store", "admin", "sliders"],
    queryFn: () => storeService.listSliders(),
  });

  useMirrorRegistry("slidersData", data ?? []);
  useMirrorRegistry("isPending", isPending);
  useMirrorRegistry("refetchSliders", () => {
    void refetch();
  });

  return <>{children}</>;
};

export { GetSliders };
