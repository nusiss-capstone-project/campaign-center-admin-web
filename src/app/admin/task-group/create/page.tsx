"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { TaskGroupFormCard } from "@/components/admin/task-group-form-card";
import { saveTaskGroup } from "@/lib/admin/task-admin-fetch";
import {
  emptyTaskGroupFormValues,
  toTaskGroupPayload,
} from "@/lib/admin/task-form-values";

export default function AdminTaskGroupCreatePage() {
  const router = useRouter();
  const [values, setValues] = useState(emptyTaskGroupFormValues());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = toTaskGroupPayload(values);
      const created = await saveTaskGroup(payload);
      const id = created.id;
      if (id == null) {
        throw new Error("Task group was created without an id.");
      }
      const params = new URLSearchParams({
        name: created.name ?? values.name.trim(),
        status: created.status ?? "DRAFT",
      });
      router.push(`/admin/task-group/${id}?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <Link
        href="/admin/task-group"
        className="text-sm text-zinc-500 transition hover:text-zinc-300"
      >
        ← Back to task groups
      </Link>

      <TaskGroupFormCard
        title="Create Task Group"
        values={values}
        error={error}
        saving={saving}
        submitLabel="Create"
        savingLabel="Creating..."
        cancelHref="/admin/task-group"
        onChange={setValues}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
