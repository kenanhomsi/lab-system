"use client";

import {
  ActionIcon,
  Avatar,
  Badge,
  Group,
  Loader,
  Modal,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { IconMessageCircle, IconSearch, IconX } from "@tabler/icons-react";
import { JSX, useMemo, useState } from "react";

export interface PickerUser {
  userId: string;
  displayName: string;
  role?: string;
}

interface NewChatUserPickerModalProps {
  opened: boolean;
  onClose: () => void;
  users: PickerUser[];
  loading?: boolean;
  pendingUserId?: string | null;
  currentUserId: string | null;
  onSelectUser: (userId: string) => void;
}

/**
 * Modal to pick an online user and start a direct conversation.
 */
export function NewChatUserPickerModal({
  opened,
  onClose,
  users,
  loading = false,
  pendingUserId = null,
  currentUserId,
  onSelectUser,
}: NewChatUserPickerModalProps): JSX.Element {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    const others = users.filter((u) => u.userId !== currentUserId);
    if (!q) return others;
    return others.filter(
      (u) =>
        u.displayName.toLowerCase().includes(q) ||
        u.userId.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q),
    );
  }, [users, search, currentUserId]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Start a new chat"
      size="md"
      centered
      onExitTransitionEnd={() => setSearch("")}
    >
      <Stack gap="md">
        <TextInput
          placeholder="Search by name or role…"
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          rightSection={
            search ? (
              <ActionIcon
                size="sm"
                variant="subtle"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <IconX size={14} />
              </ActionIcon>
            ) : null
          }
        />

        {loading ? (
          <Group justify="center" py="xl">
            <Loader size="sm" />
            <Text size="sm" c="dimmed">
              Loading users…
            </Text>
          </Group>
        ) : filteredUsers.length === 0 ? (
          <Stack align="center" gap="xs" py="xl">
            <IconMessageCircle
              size={40}
              stroke={1.2}
              color="var(--mantine-color-gray-4)"
            />
            <Text size="sm" c="dimmed" ta="center">
              {search.trim()
                ? "No users match your search."
                : "No other users are online right now. Try again when someone is available."}
            </Text>
          </Stack>
        ) : (
          <ScrollArea.Autosize mah={360} type="auto">
            <Stack gap={4}>
              {filteredUsers.map((user) => {
                const isPending = pendingUserId === user.userId;
                return (
                  <UnstyledButton
                    key={user.userId}
                    onClick={() => onSelectUser(user.userId)}
                    disabled={Boolean(pendingUserId)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      opacity: pendingUserId && !isPending ? 0.5 : 1,
                      transition: "background-color 150ms ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!pendingUserId) {
                        e.currentTarget.style.backgroundColor =
                          "var(--mantine-color-gray-0)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <Group justify="space-between" wrap="nowrap">
                      <Group wrap="nowrap" gap="sm" style={{ flex: 1, overflow: "hidden" }}>
                        <div style={{ position: "relative" }}>
                          <Avatar radius="xl" size="md" color="blue">
                            {user.displayName.substring(0, 2).toUpperCase()}
                          </Avatar>
                          <div
                            style={{
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              backgroundColor: "var(--mantine-color-green-6)",
                              border: "2px solid var(--mantine-color-body)",
                            }}
                          />
                        </div>
                        <div style={{ overflow: "hidden", flex: 1 }}>
                          <Text size="sm" fw={500} truncate>
                            {user.displayName}
                          </Text>
                          {user.role ? (
                            <Text size="xs" c="dimmed" truncate>
                              {user.role}
                            </Text>
                          ) : null}
                        </div>
                      </Group>
                      <Group gap="xs" wrap="nowrap">
                        {user.role ? (
                          <Badge size="xs" variant="light">
                            {user.role}
                          </Badge>
                        ) : null}
                        {isPending ? (
                          <Loader size="xs" />
                        ) : (
                          <IconMessageCircle
                            size={18}
                            color="var(--mantine-color-blue-6)"
                          />
                        )}
                      </Group>
                    </Group>
                  </UnstyledButton>
                );
              })}
            </Stack>
          </ScrollArea.Autosize>
        )}
      </Stack>
    </Modal>
  );
}
