"use client";

import {
  ActionIcon,
  Box,
  Group,
  Paper,
  Text,
  Textarea,
  Tooltip,
} from "@mantine/core";
import {
  IconMoodSmile,
  IconPaperclip,
  IconSend,
  IconX,
} from "@tabler/icons-react";
import { JSX, useRef, useState } from "react";

const MAX_LENGTH = 2000;

interface ComposerPanelProps {
  conversationId: string | null;
  disabled: boolean;
  onSend: (text: string, file?: File) => void;
  onTyping: () => void;
  onStopTyping: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Message composer with emoji, attachment, and gradient send (ChatTiko-style).
 */
export function ComposerPanel({
  conversationId,
  disabled,
  onSend,
  onTyping,
  onStopTyping,
}: ComposerPanelProps): JSX.Element {
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [focused, setFocused] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSend =
    !disabled && !!conversationId && (!!text.trim() || !!selectedFile);
  const charCount = text.length;
  const isNearLimit = charCount > MAX_LENGTH * 0.85;

  const handleSend = () => {
    const payload = text.trim();
    if (!canSend) return;
    onSend(payload, selectedFile ?? undefined);
    setText("");
    setSelectedFile(null);
    onStopTyping();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleChange = (value: string) => {
    if (value.length > MAX_LENGTH) return;
    setText(value);
    onTyping();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping();
    }, 2000);
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) onTyping();
  };

  return (
    <Box>
      {selectedFile && (
        <Paper
          withBorder
          p="xs"
          mb="sm"
          radius="md"
          style={{
            backgroundColor: "var(--chat-input-bg)",
            borderColor: "var(--chat-border)",
          }}
        >
          <Group justify="space-between" wrap="nowrap" gap="xs">
            <Group gap="xs" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
              <IconPaperclip
                size={16}
                style={{ flexShrink: 0, color: "var(--chat-accent)" }}
              />
              <Box style={{ minWidth: 0 }}>
                <Text size="sm" fw={500} truncate>
                  {selectedFile.name}
                </Text>
                <Text size="xs" c="dimmed">
                  {formatFileSize(selectedFile.size)}
                </Text>
              </Box>
            </Group>
            <ActionIcon
              size="sm"
              variant="subtle"
              color="gray"
              onClick={() => setSelectedFile(null)}
              aria-label="Remove attachment"
            >
              <IconX size={14} />
            </ActionIcon>
          </Group>
        </Paper>
      )}

      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          handleFileChange(file);
          e.target.value = "";
        }}
      />

      <Group align="flex-end" wrap="nowrap" gap="sm">
        <Tooltip label="Emoji" withArrow position="top">
          <ActionIcon
            size="xl"
            radius="xl"
            variant="subtle"
            color="gray"
            disabled={disabled || !conversationId}
            aria-label="Emoji"
            style={{ flexShrink: 0 }}
          >
            <IconMoodSmile size={19} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Attach file" withArrow position="top">
          <ActionIcon
            size="xl"
            radius="xl"
            variant="subtle"
            color="gray"
            disabled={disabled || !conversationId}
            onClick={() => fileInputRef.current?.click()}
            style={{ flexShrink: 0 }}
          >
            <IconPaperclip size={19} />
          </ActionIcon>
        </Tooltip>

        <Box style={{ flex: 1, position: "relative" }}>
          <Textarea
            className="chat-composer-input"
            value={text}
            minRows={1}
            maxRows={5}
            autosize
            onFocus={() => {
              setFocused(true);
              onTyping();
            }}
            onBlur={() => {
              setFocused(false);
              onStopTyping();
              if (typingTimeoutRef.current)
                clearTimeout(typingTimeoutRef.current);
            }}
            onChange={(e) => handleChange(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              disabled
                ? "Connect to start messaging…"
                : selectedFile
                  ? "Add a caption (optional)…"
                  : "Write a message…"
            }
            disabled={disabled || !conversationId}
            radius="xl"
            size="md"
            styles={{
              input: {
                paddingTop: 12,
                paddingBottom: 12,
                paddingRight: isNearLimit ? 52 : 16,
                borderColor: focused
                  ? "var(--chat-accent-strong)"
                  : "var(--chat-input-border)",
                boxShadow: focused
                  ? "0 0 0 2px var(--chat-focus-ring)"
                  : "none",
                transition:
                  "border-color 0.15s ease, box-shadow 0.15s ease",
              },
            }}
          />
          {isNearLimit && (
            <Text
              size="xs"
              c={charCount >= MAX_LENGTH ? "red.6" : "dimmed"}
              style={{
                position: "absolute",
                bottom: 8,
                right: 14,
                pointerEvents: "none",
                fontSize: 10,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {charCount}/{MAX_LENGTH}
            </Text>
          )}
        </Box>

        <Tooltip
          label={
            disabled
              ? "Not connected"
              : !text.trim() && !selectedFile
                ? "Type a message or attach a file"
                : "Send (Enter)"
          }
          withArrow
          position="top"
        >
          <ActionIcon
            size={44}
            radius="xl"
            color="violet"
            variant={canSend ? "filled" : "light"}
            disabled={!canSend}
            onClick={handleSend}
            className={canSend ? "chat-send-btn--ready" : undefined}
            style={{
              transition: "transform 0.15s ease, opacity 0.15s ease",
              transform: canSend ? "scale(1)" : "scale(0.92)",
              opacity: canSend ? 1 : 0.5,
              flexShrink: 0,
            }}
          >
            <IconSend size={19} style={{ marginLeft: 2 }} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Box>
  );
}
