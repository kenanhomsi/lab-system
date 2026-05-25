"use client";

import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { frontendContainer } from "@/container";
import { userModuleNames, UserFrontendService } from "@/modules/user";
import { useMirrorRegistry } from "../store";
import type { MeUser } from "../types";

const userService = frontendContainer.get<UserFrontendService>(userModuleNames.service);

async function getMe(): Promise<MeUser> {
  const data = await userService.getMe({});
  if (!data) throw new Error("Failed to fetch profile");
  return data as MeUser;
}

const GetMe = (props: PropsWithChildren) => {
  const { data, isPending } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    refetchInterval: 1000 * 60,
  });

  useMirrorRegistry("me", data ?? null);
  useMirrorRegistry("isPending", isPending);

  return props;
};

export { GetMe };
