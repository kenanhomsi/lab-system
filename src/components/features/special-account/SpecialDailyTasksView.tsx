"use client";

import { specialAccountService } from "./special-service";
import {
  ActionIcon,
  Button,
  Card,
  Checkbox,
  Group,
  Modal,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useState } from "react";

/**
 * Daily tasks list with create, complete, and delete for special accounts.
 */
export function SpecialDailyTasksView() {
  const t = useTranslations("specialPages");
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string | null>(dayjs().format("YYYY-MM-DD"));
  const [dueTime, setDueTime] = useState("09:00");
  const [reminderEnabled, setReminderEnabled] = useState(false);

  const tasksQuery = useQuery({
    queryKey: ["special-tasks"],
    queryFn: () => specialAccountService.listTasks(),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      specialAccountService.createTask({
        title,
        description,
        dueDate: dayjs(dueDate ?? undefined).format("YYYY-MM-DD"),
        dueTime,
        reminderEnabled,
      }),
    onSuccess: () => {
      close();
      setTitle("");
      setDescription("");
      void queryClient.invalidateQueries({ queryKey: ["special-tasks"] });
    },
  });

  const patchMutation = useMutation({
    mutationFn: (args: { id: string; completed: boolean }) =>
      specialAccountService.patchTask(args.id, { completed: args.completed }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["special-tasks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => specialAccountService.deleteTask(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["special-tasks"] });
    },
  });

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Text fw={700} fz={26}>
          {t("dailyTasks")}
        </Text>
        <Button leftSection={<IconPlus size={16} />} onClick={open}>
          {t("addTask")}
        </Button>
      </Group>

      {tasksQuery.isLoading && <Text>{t("loading")}</Text>}

      <Stack gap="sm">
        {(tasksQuery.data ?? []).length === 0 && !tasksQuery.isLoading && (
          <Text c="dimmed">{t("noTasks")}</Text>
        )}
        {(tasksQuery.data ?? []).map((task) => (
          <Card key={task.id} withBorder padding="md">
            <Group justify="space-between" align="flex-start">
              <Stack gap={4}>
                <Group gap="sm">
                  <Checkbox
                    checked={task.completed}
                    onChange={(e) =>
                      patchMutation.mutate({
                        id: task.id,
                        completed: e.currentTarget.checked,
                      })
                    }
                  />
                  <Text fw={600} td={task.completed ? "line-through" : undefined}>
                    {task.title}
                  </Text>
                </Group>
                {task.description && (
                  <Text size="sm" c="dimmed">
                    {task.description}
                  </Text>
                )}
                <Text size="xs" c="dimmed">
                  {task.dueDate} {task.dueTime}
                  {task.reminderEnabled ? ` · ${t("reminder")}` : ""}
                </Text>
              </Stack>
              <ActionIcon
                color="red"
                variant="subtle"
                onClick={() => deleteMutation.mutate(task.id)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          </Card>
        ))}
      </Stack>

      <Modal opened={opened} onClose={close} title={t("newTask")}>
        <Stack gap="md">
          <TextInput
            label={t("taskTitle")}
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
          <Textarea
            label={t("taskDescription")}
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />
          <DateInput label={t("dueDate")} value={dueDate} onChange={setDueDate} />
          <TextInput
            label={t("dueTime")}
            value={dueTime}
            onChange={(e) => setDueTime(e.currentTarget.value)}
            placeholder="09:00"
          />
          <Switch
            label={t("reminder")}
            checked={reminderEnabled}
            onChange={(e) => setReminderEnabled(e.currentTarget.checked)}
          />
          <Button loading={createMutation.isPending} onClick={() => createMutation.mutate()}>
            {t("save")}
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
