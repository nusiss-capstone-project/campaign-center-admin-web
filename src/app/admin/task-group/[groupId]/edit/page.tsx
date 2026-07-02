"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchTaskGroups, saveTaskGroup } from "@/lib/admin/task-admin-fetch";
import {
  emptyTaskGroupFormValues,
  toTaskGroupPayload,
} from "@/lib/admin/task-form-values";
import { isDraftStatus, normalizeTaskGroupRow } from "@/lib/admin/task-row";

function parseGroupId(raw: string | string[] | undefined): number {
  const value = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";
  return Number(value);
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
    const params = new URLSearchParams();
    const name = searchParams.get("name");
    const statusParam = searchParams.get("status");
    if (name) params.set("name", name);
    if (statusParam) params.set("status", statusParam);
    const qs = params.toString();
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
      const params = new URLSearchParams({
        name: values.name.trim(),
        status,
      });
      router.push(`/admin/task-group/${groupId}?${params.toString()}`);
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

      <Card className="gap-0 border-white/10 bg-zinc-900/50 py-0 text-zinc-100">
        <CardHeader className="border-b border-white/10 px-6 pb-5 pt-6">
          <CardTitle className="text-xl font-semibold text-white">
            Edit Task Group
          </CardTitle>
        </CardHeader>
        {loading ? (
          <CardContent className="px-6 py-6">
            <p className="text-sm text-zinc-400">Loading...</p>
          </CardContent>
        ) : (
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
                <Link href={backHref}>Cancel</Link>
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="border-0 bg-white text-black hover:bg-zinc-200"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}