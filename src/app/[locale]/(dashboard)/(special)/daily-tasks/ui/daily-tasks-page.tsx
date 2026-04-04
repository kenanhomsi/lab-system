"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

const INPUT_CLASS =
  "w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

type TaskRow = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  reminderEnabled: boolean;
  completed: boolean;
};

function normalizeTasks(data: unknown): TaskRow[] {
  if (Array.isArray(data)) return data as TaskRow[];
  if (data && typeof data === "object" && "tasks" in data) {
    const t = (data as { tasks: unknown }).tasks;
    if (Array.isArray(t)) return t as TaskRow[];
  }
  return [];
}

export function DailyTasksPage() {
  const t = useTranslations("specialPages");
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<"pending" | "completed">("pending");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/special/tasks");
      const data = await res.json();
      setTasks(normalizeTasks(data));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () => tasks.filter((x) => (filter === "pending" ? !x.completed : x.completed)),
    [tasks, filter],
  );

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const reminder = fd.get("reminderEnabled") === "on";
    const body = {
      title: String(fd.get("title") || "").trim(),
      description: String(fd.get("description") || ""),
      dueDate: String(fd.get("dueDate") || ""),
      dueTime: String(fd.get("dueTime") || ""),
      reminderEnabled: reminder,
    };

    try {
      const res = await fetch("/api/special/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        form.reset();
        setShowForm(false);
        await load();
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleComplete(task: TaskRow) {
    const res = await fetch(`/api/special/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    if (res.ok) await load();
  }

  async function removeTask(id: string) {
    const res = await fetch(`/api/special/tasks/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 pb-24 pt-6 sm:p-6 md:max-w-3xl md:p-8 lg:pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
            <Icon name="task_alt" filled size="sm" />
            {t("dailyTasks")}
          </span>
          <h1 className="mt-2 font-headline text-2xl font-black tracking-tight text-on-surface sm:text-3xl md:text-4xl">
            {t("dailyTasks")}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="clinical-gradient inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98]"
        >
          <Icon name={showForm ? "close" : "add_task"} size="sm" />
          {showForm ? t("cancelAdd") : t("addTask")}
        </button>
      </header>

      {showForm && (
        <Card className="border-primary/20 shadow-lg shadow-primary/10 transition-opacity duration-200" padding="lg">
          <h2 className="mb-4 font-headline text-lg font-bold text-on-surface">{t("newTask")}</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-bold text-on-surface">
                {t("taskTitle")}
              </label>
              <input id="title" name="title" required className={INPUT_CLASS} />
            </div>
            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-bold text-on-surface">
                {t("taskDescription")}
              </label>
              <textarea
                id="description"
                name="description"
                rows={2}
                className={`${INPUT_CLASS} min-h-[4rem] resize-y`}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="dueDate" className="mb-2 block text-sm font-bold text-on-surface">
                  {t("dueDate")}
                </label>
                <input id="dueDate" name="dueDate" type="date" required className={INPUT_CLASS} />
              </div>
              <div>
                <label htmlFor="dueTime" className="mb-2 block text-sm font-bold text-on-surface">
                  {t("dueTime")}
                </label>
                <input id="dueTime" name="dueTime" type="time" className={INPUT_CLASS} />
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3">
              <input
                type="checkbox"
                name="reminderEnabled"
                className="size-4 rounded border-outline-variant text-primary focus:ring-primary/30"
              />
              <span className="text-sm font-bold text-on-surface">{t("reminder")}</span>
              <Icon name="notifications_active" className="ms-auto text-primary" size="sm" />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="clinical-gradient flex w-full items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-bold tracking-widest text-on-primary shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {submitting ? (
                <Icon name="progress_activity" className="animate-spin" size="sm" />
              ) : (
                <Icon name="save" size="sm" />
              )}
              {t("save")}
            </button>
          </form>
        </Card>
      )}

      <div className="flex rounded-xl border border-outline-variant/20 bg-surface-container-low p-1">
        {(["pending", "completed"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={cn(
              "flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all",
              filter === key
                ? "clinical-gradient text-on-primary shadow-md"
                : "text-on-surface-variant hover:bg-surface",
            )}
          >
            {t(key)}
          </button>
        ))}
      </div>

      {loading ? (
        <Card className="py-16 text-center text-on-surface-variant" padding="lg">
          <Icon name="progress_activity" className="mx-auto mb-3 animate-spin" size="lg" />
          {t("loading")}
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="py-16 text-center" padding="lg">
          <Icon name="event_busy" className="mx-auto mb-3 text-on-surface-variant/50" size="lg" />
          <p className="text-on-surface-variant">{t("noTasks")}</p>
        </Card>
      ) : (
        <ul className="space-y-4">
          {filtered.map((task) => (
            <li key={task.id}>
              <Card
                className={cn(
                  "relative overflow-hidden border-s-4 transition-shadow",
                  task.completed
                    ? "border-s-outline-variant opacity-90"
                    : "border-s-primary shadow-sm",
                )}
                padding="md"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={cn(
                          "font-headline text-lg font-bold text-on-surface",
                          task.completed && "text-on-surface-variant line-through",
                        )}
                      >
                        {task.title}
                      </h3>
                      {task.reminderEnabled && (
                        <span
                          className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-200"
                          title={t("reminder")}
                        >
                          <Icon name="notifications_active" filled size="sm" />
                          {t("reminder")}
                        </span>
                      )}
                    </div>
                    {task.description ? (
                      <p className="text-sm text-on-surface-variant">{task.description}</p>
                    ) : null}
                    <div className="flex flex-wrap gap-3 text-sm text-on-surface-variant">
                      <span className="inline-flex items-center gap-1">
                        <Icon name="calendar_today" size="sm" />
                        {task.dueDate}
                      </span>
                      {task.dueTime ? (
                        <span className="inline-flex items-center gap-1">
                          <Icon name="schedule" size="sm" />
                          {task.dueTime}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-outline-variant/30 px-3 py-2 text-sm font-bold">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => void toggleComplete(task)}
                        className="size-4 rounded border-outline-variant text-primary"
                      />
                      {t("markComplete")}
                    </label>
                    <button
                      type="button"
                      onClick={() => void removeTask(task.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 px-3 py-2 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-500/10 dark:text-rose-400"
                    >
                      <Icon name="delete" size="sm" />
                      {t("deleteTask")}
                    </button>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
