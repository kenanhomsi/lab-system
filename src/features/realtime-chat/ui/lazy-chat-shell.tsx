"use client";

import dynamic from "next/dynamic";
import { Center, Loader } from "@mantine/core";

const ChatShell = dynamic(
  () => import("./chat-shell").then((module) => module.ChatShell),
  {
    ssr: false,
    loading: () => (
      <Center h="60vh">
        <Loader color="cyan" />
      </Center>
    ),
  },
);

/**
 * Lazy-loaded chat shell for dashboard chat routes.
 */
export function LazyChatShell() {
  return <ChatShell />;
}
