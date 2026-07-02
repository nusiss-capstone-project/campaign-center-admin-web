"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { TaskDetailsForm } from "@/components/admin/task-details-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  fetchDataMetricOperators,
  fetchDataMetrics,
  fetchTaskDetail,
  publishTask,
  saveTask,
} from "@/lib/admin/task-admin-fetch";
import type { DataMetricVO, MetricOperatorVO } from "@/lib/admin/task-types";
import {
  emptyTaskFormValues,
  parseTaskDetailToFormValues,
  toTaskPayload,
} from "@/lib/admin/task-form-values";
import { isDraftStatus, taskStatusLabel } from "@/lib/admin/task-row";

function parseId(raw: string | string[] | undefined): number {
  const value = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";
  return Number(value);
}

export default function AdminTaskDetailPage() {
  const params = useParams();
  const groupId = parseId(params?.groupId);
  const taskId = parseId(params?.taskId);

  const [values, setValues] = useState(emptyTaskFormValues());
  const [metrics, setMetrics] = useState<DataMetricVO[]>([]);
  const [operators, setOperators] = useState<MetricOperatorVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readOnly = !isDraftStatus(values.status);

  useEffect(() => {
    if (
      !Number.isFinite(groupId) ||
      groupId <= 0 ||
      !Number.isFinite(taskId) ||
      taskId <= 0
    ) {
      setLoading(false);
      setError("Invalid task id");
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [task, metricData, operatorData] = await Promise.all([
          fetchTaskDetail(groupId, taskId),
          fetchDataMetrics(),
          fetchDataMetricOperators(),
        ]);
        if (cancelled) return;
        setValues(parseTaskDetailToFormValues(task));
        setMetrics(metricData);
        setOperators(operatorData);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Load failed");
        setValues(emptyTaskFormValues());
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [groupId, taskId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = toTaskPayload(values);
      const saved = await saveTask(groupId, taskId, payload);
      setValues(parseTaskDetailToFormValues(saved));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setPublishing(true);
    setError(null);
    try {
      await publishTask(taskId);
      setValues((prev) => ({
        ...prev,
        status: "PUBLISHED",
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setPublishing(false);
    }
  }

  const backHref = `/admin/task-group/${groupId}`;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <Link
        href={backHref}
        className="text-sm text-zinc-500 transition hover:text-zinc-300"
      >
        ← Back to task group
      </Link>

      <Card className="gap-0 border-white/10 bg-zinc-900/50 py-0 text-zinc-100">
        <CardHeader className="border-b border-white/10 px-6 pb-5 pt-6">
          <CardTitle className="text-xl font-semibold text-white">
            {readOnly ? "Task Detail" : "Edit Task"}
          </CardTitle>
        </CardHeader>
        {loading ? (
          <CardContent className="px-6 py-6">
            <p className="text-sm text-zinc-400">Loading task...</p>
          </CardContent>
        ) : (
          <form onSubmit={readOnly ? (e) => e.preventDefault() : handleSave}>
            <CardContent className="flex flex-col gap-6 px-6 py-6">
              {error ? (
                <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </p>
              ) : null}
              <TaskDetailsForm
                values={values}
                readOnly={readOnly}
                metrics={metrics}
                operators={operators}
                onChange={setValues}
                statusLabel={taskStatusLabel(
                  values.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
                )}
              />
            </CardContent>
            <CardFooter className="justify-end gap-3 border-white/10 px-6 py-4">
              <Button
                asChild
                variant="outline"
                className="border-white/10 bg-zinc-900/50 text-zinc-200 hover:bg-zinc-800"
              >
                <Link href={backHref}>Back</Link>
              </Button>
              {!readOnly ? (
                <>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="border-0 bg-white text-black hover:bg-zinc-200"
                  >
                    {saving ? "Saving..." : "Save Task"}
                  </Button>
                  <Button
                    type="button"
                    disabled={publishing}
                    onClick={handlePublish}
                    className="border-0 bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                  >
                    {publishing ? "Publishing..." : "Publish Task"}
                  </Button>
                </>
              ) : null}
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
