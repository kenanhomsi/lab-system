"use client";

import { ActionIcon, Group, Textarea } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { JSX, useState } from "react";

interface ComposerPanelProps {
  conversationId: string | null;
  disabled: boolean;
  onSend: (text: string) => void;
  onTyping: () => void;
  onStopTyping: () => void;
}

/**
 * Provides message composition with typing and stop-typing events.
 */
export function ComposerPanel({
  conversationId,
  disabled,
  onSend,
  onTyping,
  onStopTyping,
}: ComposerPanelProps): JSX.Element {
  const [text, setText] = useState("");

  const handleSend = () => {
    const payload = text.trim();
    if (!payload || disabled || !conversationId) return;
    onSend(payload);
    setText("");
    onStopTyping();
  };

  return (
    <Group align="flex-end" wrap="nowrap" gap="sm">
      <Textarea
        value={text}
        minRows={1}
        maxRows={4}
        autosize
        onFocus={onTyping}
        onBlur={onStopTyping}
        onChange={(event) => {
          setText(event.currentTarget.value);
          onTyping();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Write your message..."
        disabled={disabled || !conversationId}
        flex={1}
        radius="xl"
        size="md"
        styles={{
          input: {
            paddingTop: "10px",
            paddingBottom: "10px",
          },
        }}
      />
      <ActionIcon
        size="xl"
        radius="xl"
        color="blue"
        variant="filled"
        disabled={disabled || !conversationId || !text.trim()}
        onClick={handleSend}
        style={{
          transition: "all 0.2s ease",
          transform: text.trim() ? "scale(1)" : "scale(0.95)",
        }}
      >
        <IconSend size={20} style={{ marginLeft: 2 }} />
      </ActionIcon>
    </Group>
  );
}
