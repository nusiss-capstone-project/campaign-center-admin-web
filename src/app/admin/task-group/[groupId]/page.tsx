"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { TaskGroupDetailPanel } from "@/components/admin/task-group-detail-panel";
import { Button } from "@/components/ui/button";
import {
  fetchTaskGroups,
  fetchTasksByGroup,
  publishTaskGroup,
} from "@/lib/admin/task-admin-fetch";
import {
  normalizeTaskGroupRow,
  normalizeTaskRows,
  type TaskGroupDisplayRow,
  type TaskDisplayRow,
} from "@/lib/admin/task-row";

function parseGroupId(raw: string | string[] | undefined): number {
  const value = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";
  return Number(value);
}

export default function AdminTaskGroupDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const groupId = parseGroupId(params?.groupId);

  const [tasks, setTasks] = useState<TaskDisplayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [resolvedGroup, setResolvedGroup] = useState<TaskGroupDisplayRow | null>(
    null,
  );

  const queryGroup = useMemo((): TaskGroupDisplayRow | null => {
    if (!Number.isFinite(groupId) || groupId <= 0) return null;
    const name = searchParams.get("name") ?? `Task Group ${groupId}`;
    const statusRaw = (searchParams.get("status") ?? "DRAFT").toUpperCase();
    const status = statusRaw === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
    return {
      id: groupId,
      name,
      status,
      statusLabel: status === "PUBLISHED" ? "Published" : "Draft",
    };
  }, [groupId, searchParams]);

  const group = resolvedGroup ?? queryGroup;

  useEffect(() => {
    if (!Number.isFinite(groupId) || groupId <= 0) {
      setLoading(false);
      setErrorMessage("Invalid task group id");
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setErrorMessage(null);

      try {
        const [groups, taskData] = await Promise.all([
          fetchTaskGroups(),
          fetchTasksByGroup(groupId),
        ]);
        if (cancelled) return;

        const matched = normalizeTaskGroupRow(
          groups.find((item) => item.id === groupId) ?? null,
        );
        if (matched) {
          setResolvedGroup(matched);
        }

        setTasks(normalizeTaskRows(taskData));
      } catch (e) {
        if (cancelled) return;
        setErrorMessage(e instanceof Error ? e.message : "Request failed");
        setTasks([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [groupId, refreshKey]);

  async function handlePublishGroup() {
    if (!group) return;
    setPublishing(true);
    setErrorMessage(null);
    try {
      await publishTaskGroup(group.id);
      router.replace(
        `/admin/task-group/${group.id}?name=${encodeURIComponent(group.name)}&status=PUBLISHED`,
      );
      setRefreshKey((k) => k + 1);
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "Publish failed");
    } finally {
      setPublishing(false);
    }
  }

  if (!Number.isFinite(groupId) || groupId <= 0) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-300">Invalid task group id.</p>
        <Button asChild variant="link" className="mt-2 px-0 text-zinc-300">
          <Link href="/admin/task-group">Back to list</Link>
        </Button>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="p-6">
        <p className="text-sm text-zinc-400">Loading task group...</p>
      </div>
    );
  }

  return (
    <TaskGroupDetailPanel
      group={group}
      tasks={tasks}
      loading={loading}
      errorMessage={errorMessage}
      publishing={publishing}
      onPublishGroup={handlePublishGroup}
    />
  );
}
