"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { DataMetricVO, MetricOperatorVO } from "@/lib/admin/task-types";
import type { TaskFormValues } from "@/lib/admin/task-form-values";
import {
  emptyCondition,
  renumberConditions,
} from "@/lib/admin/task-form-values";

type TaskDetailsFormProps = {
  values: TaskFormValues;
  readOnly: boolean;
  metrics: DataMetricVO[];
  operators: MetricOperatorVO[];
  onChange?: (next: TaskFormValues) => void;
  statusLabel?: string | null;
};

function patchValues(
  prev: TaskFormValues,
  patch: Partial<TaskFormValues>,
): TaskFormValues {
  return { ...prev, ...patch };
}

export function TaskDetailsForm({
  values,
  readOnly,
  metrics,
  operators,
  onChange,
  statusLabel,
}: TaskDetailsFormProps) {
  const set = (patch: Partial<TaskFormValues>) => {
    if (!readOnly && onChange) onChange(patchValues(values, patch));
  };

  const setConditions = (conditions: TaskFormValues["conditions"]) => {
    set({ conditions: renumberConditions(conditions) });
  };

  const updateCondition = (
    index: number,
    patch: Partial<TaskFormValues["conditions"][number]>,
  ) => {
    const next = values.conditions.map((condition, i) =>
      i === index ? { ...condition, ...patch } : condition,
    );
    setConditions(next);
  };

  const addCondition = () => {
    setConditions([
      ...values.conditions,
      emptyCondition(values.conditions.length + 1),
    ]);
  };

  const removeCondition = (index: number) => {
    if (values.conditions.length <= 1) return;
    setConditions(values.conditions.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-6">
      {statusLabel ? (
        <p className="text-sm text-zinc-400">
          Status: <span className="text-zinc-100">{statusLabel}</span>
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          <span className="text-zinc-400">Task Name</span>
          <Input
            value={values.name}
            onChange={(e) => set({ name: e.target.value })}
            disabled={readOnly}
            readOnly={readOnly}
            required={!readOnly}
            className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-zinc-400">Task Status</span>
          <Input
            value={values.status}
            disabled
            readOnly
            className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-zinc-400">Start Time</span>
          <Input
            type="datetime-local"
            value={values.startTime}
            onChange={(e) => set({ startTime: e.target.value })}
            disabled={readOnly}
            readOnly={readOnly}
            required={!readOnly}
            className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-zinc-400">End Time</span>
          <Input
            type="datetime-local"
            value={values.endTime}
            onChange={(e) => set({ endTime: e.target.value })}
            disabled={readOnly}
            readOnly={readOnly}
            required={!readOnly}
            className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
          />
        </label>
      </div>

      <label className="grid gap-1.5 text-sm">
        <span className="text-zinc-400">Condition Expression</span>
        <Textarea
          value={values.expression}
          onChange={(e) => set({ expression: e.target.value })}
          disabled={readOnly}
          readOnly={readOnly}
          placeholder="(1&2)|3"
          rows={2}
          className="border-white/10 bg-zinc-900/80 font-mono text-zinc-100 disabled:opacity-70"
        />
        <span className="text-xs text-zinc-500">
          Use numbers matching condition index (starting at 1), with &amp;, |,
          and parentheses.
        </span>
      </label>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-medium text-zinc-200">Conditions</h3>
          {!readOnly ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCondition}
              className="border-white/10 bg-zinc-900/50 text-zinc-200 hover:bg-zinc-800"
            >
              <Plus className="mr-1.5 size-4" />
              Add condition
            </Button>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          {values.conditions.map((condition, index) => (
            <div
              key={`condition-${condition.no}-${index}`}
              className="grid gap-3 rounded-xl border border-white/10 bg-zinc-900/40 p-4 md:grid-cols-[48px_1fr_1fr_1fr_auto]"
              >
              <div className="flex items-center justify-center">
                <span className="flex size-8 items-center justify-center rounded-md bg-emerald-500/15 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-500/25">
                  {condition.no}
                </span>
              </div>

              <label className="grid gap-1.5 text-sm">
                <span className="text-zinc-500">Data Metric</span>
                <Select
                  value={condition.metricId}
                  disabled={readOnly}
                  onValueChange={(metricId) =>
                    updateCondition(index, { metricId })
                  }
                >
                  <SelectTrigger className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    {metrics.map((metric) => {
                      const id = metric.id != null ? String(metric.id) : "";
                      if (!id) return null;
                      return (
                        <SelectItem key={id} value={id}>
                          {metric.code ?? id}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </label>

              <label className="grid gap-1.5 text-sm">
                <span className="text-zinc-500">Operator</span>
                <Select
                  value={condition.operatorId}
                  disabled={readOnly}
                  onValueChange={(operatorId) =>
                    updateCondition(index, { operatorId })
                  }
                >
                  <SelectTrigger className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70">
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((operator) => {
                      const id =
                        operator.id != null ? String(operator.id) : "";
                      if (!id) return null;
                      return (
                        <SelectItem key={id} value={id}>
                          {operator.display ?? operator.code ?? id}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </label>

              <label className="grid gap-1.5 text-sm">
                <span className="text-zinc-500">Value</span>
                <Input
                  value={condition.metricValue}
                  onChange={(e) =>
                    updateCondition(index, { metricValue: e.target.value })
                  }
                  disabled={readOnly}
                  readOnly={readOnly}
                  className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
                />
              </label>

              {!readOnly ? (
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeCondition(index)}
                    disabled={values.conditions.length <= 1}
                    className="border-white/10 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    aria-label={`Remove condition ${condition.no}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
