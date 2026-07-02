"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

      <Card className="gap-0 border-white/10 bg-zinc-900/50 py-0 text-zinc-100">
        <CardHeader className="border-b border-white/10 px-6 pb-5 pt-6">
          <CardTitle className="text-xl font-semibold text-white">
            Create Task Group
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-6 px-6 py-6">
            {error ? (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            ) : null}
            <label className="grid gap-2 text-sm">
              <span className="font-medium text-zinc-300">Name</span>
              <Input
                value={values.name}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter task group name"
                required
                className="h-10 border-white/10 bg-zinc-900/80 text-zinc-100"
              />
            </label>
          </CardContent>
          <CardFooter className="justify-end gap-3 border-white/10 px-6 py-4">
            <Button
              asChild
              variant="outline"
              className="border-white/10 bg-zinc-900/50 text-zinc-200 hover:bg-zinc-800"
            >
              <Link href="/admin/task-group">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="border-0 bg-white text-black hover:bg-zinc-200"
            >
              {saving ? "Creating..." : "Create"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
