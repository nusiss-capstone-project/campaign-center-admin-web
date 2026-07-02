"use client";

import Link from "next/link";

import { TaskGroupStatusBadge } from "@/components/admin/task-group-status-badge";
import { Button } from "@/components/ui/button";
import type { TaskDisplayRow, TaskGroupDisplayRow } from "@/lib/admin/task-row";
import { allTasksPublished, isDraftStatus } from "@/lib/admin/task-row";

type TaskGroupDetailPanelProps = {
  group: TaskGroupDisplayRow;
  tasks: TaskDisplayRow[];
  loading: boolean;
  errorMessage: string | null;
  publishing: boolean;
  onPublishGroup: () => void;
};

function taskHref(groupId: number, taskId: number): string {
  return `/admin/task-group/${groupId}/tasks/${taskId}`;
}

function groupQuery(group: TaskGroupDisplayRow): string {
  return new URLSearchParams({
    name: group.name,
    status: group.status,
  }).toString();
}

export function TaskGroupDetailPanel({
  group,
  tasks,
  loading,
  errorMessage,
  publishing,
  onPublishGroup,
}: TaskGroupDetailPanelProps) {
  const groupIsDraft = isDraftStatus(group.status);
  const canPublishGroup =
    groupIsDraft && allTasksPublished(tasks) && tasks.length > 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <Link
            href="/admin/task-group"
            className="text-sm text-zinc-500 transition hover:text-zinc-300"
          >
            ← Task Groups
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {group.name}
            </h1>
            <TaskGroupStatusBadge
              status={group.status}
              label={group.statusLabel}
            />
          </div>
          <p className="mt-2 text-sm text-zinc-500">task_group_id: {group.id}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {groupIsDraft ? (
            <>
              <Button
                asChild
                variant="outline"
                className="border-white/10 bg-zinc-900/50 text-zinc-200 hover:bg-zinc-800"
              >
                <Link href={`/admin/task-group/${group.id}/edit?${groupQuery(group)}`}>
                  Edit Group
                </Link>
              </Button>
              <Button
                asChild
                className="border-0 bg-white text-black hover:bg-zinc-200"
              >
                <Link href={`/admin/task-group/${group.id}/tasks/create?${groupQuery(group)}`}>
                  Create Task
                </Link>
              </Button>
              {canPublishGroup ? (
                <Button
                  type="button"
                  onClick={onPublishGroup}
                  disabled={publishing}
                  className="border-0 bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                >
                  {publishing ? "Publishing..." : "Publish Group"}
                </Button>
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      {!groupIsDraft ? null : tasks.length > 0 && !allTasksPublished(tasks) ? (
        <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Publish every task before publishing this task group.
        </p>
      ) : null}

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-medium text-white">Tasks</h2>
          <span className="text-sm text-zinc-500">{tasks.length} total</span>
        </div>

        {loading ? (
          <p className="rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-8 text-center text-sm text-zinc-400">
            Loading tasks...
          </p>
        ) : errorMessage ? (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-8 text-center text-sm text-red-200">
            {errorMessage}
          </p>
        ) : tasks.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-8 text-center text-sm text-zinc-400">
            No tasks in this group yet.
            {groupIsDraft ? " Create a task to define completion conditions." : ""}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {tasks.map((task) => (
              <li key={task.id}>
                <Link
                  href={taskHref(group.id, task.id)}
                  className="block rounded-xl border border-white/10 bg-zinc-900/60 p-4 transition-colors hover:border-white/20 hover:bg-zinc-900"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-medium text-white">{task.name}</h3>
                      <p className="mt-1 text-sm text-zinc-500">task_id: {task.id}</p>
                      {task.expression ? (
                        <p className="mt-2 font-mono text-xs text-zinc-400">
                          {task.expression}
                        </p>
                      ) : null}
                    </div>
                    <TaskGroupStatusBadge
                      status={task.status}
                      label={task.statusLabel}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-500">
                    {task.startTime ? <span>Start: {task.startTime}</span> : null}
                    {task.endTime ? <span>End: {task.endTime}</span> : null}
                    <span>{task.conditionCount} conditions</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
