"use client";

import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "../store";
import type { MeUser } from "../types";

async function parseOrThrow(response: Response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error("Profile API request failed");
  }
  return payload;
}

async function getMe(): Promise<MeUser> {
  const response = await fetch("/api/users/me", { method: "GET", cache: "no-store" });
  const payload = (await parseOrThrow(response)) as MeUser | null;
  if (!payload) throw new Error("Failed to fetch profile");
  return payload;
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

