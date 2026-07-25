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
  type TaskFormValues,
} from "@/lib/admin/task-form-values";
import { isDraftStatus, taskStatusLabel } from "@/lib/admin/task-row";

function parseId(raw: string | string[] | undefined): number {
  if (typeof raw === "string") return Number(raw);
  if (Array.isArray(raw)) return Number(raw[0]);
  return Number.NaN;
}

function isValidId(id: number): boolean {
  return Number.isFinite(id) && id > 0;
}

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

function useTaskDetail(groupId: number, taskId: number) {
  const [values, setValues] = useState(emptyTaskFormValues());
  const [metrics, setMetrics] = useState<DataMetricVO[]>([]);
  const [operators, setOperators] = useState<MetricOperatorVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isValidId(groupId) || !isValidId(taskId)) {
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
        setError(errorMessage(e, "Load failed"));
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

  return { values, setValues, metrics, operators, loading, error, setError };
}

type TaskEditorFormProps = {
  values: TaskFormValues;
  readOnly: boolean;
  metrics: DataMetricVO[];
  operators: MetricOperatorVO[];
  error: string | null;
  saving: boolean;
  publishing: boolean;
  backHref: string;
  onChange: (values: TaskFormValues) => void;
  onSave: (e: React.FormEvent) => void;
  onPublish: () => void;
};

function TaskEditorForm({
  values,
  readOnly,
  metrics,
  operators,
  error,
  saving,
  publishing,
  backHref,
  onChange,
  onSave,
  onPublish,
}: Readonly<TaskEditorFormProps>) {
  return (
    <form onSubmit={onSave}>
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
          onChange={onChange}
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
              onClick={onPublish}
              className="border-0 bg-emerald-500 text-slate-950 hover:bg-emerald-400"
            >
              {publishing ? "Publishing..." : "Publish Task"}
            </Button>
          </>
        ) : null}
      </CardFooter>
    </form>
  );
}

export default function AdminTaskDetailPage() {
  const params = useParams();
  const groupId = parseId(params?.groupId);
  const taskId = parseId(params?.taskId);

  const { values, setValues, metrics, operators, loading, error, setError } =
    useTaskDetail(groupId, taskId);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const readOnly = !isDraftStatus(values.status);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (readOnly) return;
    setSaving(true);
    setError(null);
    try {
      const payload = toTaskPayload(values);
      const saved = await saveTask(groupId, taskId, payload);
      setValues(parseTaskDetailToFormValues(saved));
    } catch (err) {
      setError(errorMessage(err, "Save failed"));
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
      setError(errorMessage(err, "Publish failed"));
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
          <TaskEditorForm
            values={values}
            readOnly={readOnly}
            metrics={metrics}
            operators={operators}
            error={error}
            saving={saving}
            publishing={publishing}
            backHref={backHref}
            onChange={setValues}
            onSave={handleSave}
            onPublish={handlePublish}
          />
        )}
      </Card>
    </div>
  );
}
