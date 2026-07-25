"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { TaskGroupFormCard } from "@/components/admin/task-group-form-card";
import { Card, CardContent } from "@/components/ui/card";
import { fetchTaskGroups, saveTaskGroup } from "@/lib/admin/task-admin-fetch";
import {
  emptyTaskGroupFormValues,
  toTaskGroupPayload,
} from "@/lib/admin/task-form-values";
import { isDraftStatus, normalizeTaskGroupRow } from "@/lib/admin/task-row";

function parseGroupId(raw: string | string[] | undefined): number {
  if (typeof raw === "string") return Number(raw);
  if (Array.isArray(raw)) return Number(raw[0]);
  return Number.NaN;
}

export default function AdminTaskGroupEditPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const groupId = parseGroupId(params?.groupId);

  const [values, setValues] = useState(emptyTaskGroupFormValues());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("DRAFT");

  const backHref = useMemo(() => {
    const query = new URLSearchParams();
    const name = searchParams.get("name");
    const statusParam = searchParams.get("status");
    if (name) query.set("name", name);
    if (statusParam) query.set("status", statusParam);
    const qs = query.toString();
    return qs
      ? `/admin/task-group/${groupId}?${qs}`
      : `/admin/task-group/${groupId}`;
  }, [groupId, searchParams]);

  useEffect(() => {
    if (!Number.isFinite(groupId) || groupId <= 0) {
      setLoading(false);
      setError("Invalid task group id");
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const groups = await fetchTaskGroups();
        if (cancelled) return;
        const row = normalizeTaskGroupRow(
          groups.find((item) => item.id === groupId) ?? {
            id: groupId,
            name: searchParams.get("name") ?? "",
            status: searchParams.get("status") ?? "DRAFT",
          },
        );
        if (!row) {
          setError("Task group not found");
          return;
        }
        if (!isDraftStatus(row.status)) {
          router.replace(backHref);
          return;
        }
        setValues({ name: row.name });
        setStatus(row.status);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Load failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [backHref, groupId, router, searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = toTaskGroupPayload(values, groupId);
      await saveTaskGroup(payload);
      const query = new URLSearchParams({
        name: values.name.trim(),
        status,
      });
      router.push(`/admin/task-group/${groupId}?${query.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <Link
        href={backHref}
        className="text-sm text-zinc-500 transition hover:text-zinc-300"
      >
        ← Back to task group
      </Link>

      {loading ? (
        <Card className="gap-0 border-white/10 bg-zinc-900/50 py-0 text-zinc-100">
          <CardContent className="px-6 py-6">
            <p className="text-sm text-zinc-400">Loading...</p>
          </CardContent>
        </Card>
      ) : (
        <TaskGroupFormCard
          title="Edit Task Group"
          values={values}
          error={error}
          saving={saving}
          submitLabel="Save"
          savingLabel="Saving..."
          cancelHref={backHref}
          onChange={setValues}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
