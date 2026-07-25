"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { TaskGroupFormValues } from "@/lib/admin/task-form-values";

type TaskGroupFormCardProps = {
  title: string;
  values: TaskGroupFormValues;
  error: string | null;
  saving: boolean;
  submitLabel: string;
  savingLabel: string;
  cancelHref: string;
  onChange: (values: TaskGroupFormValues) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function TaskGroupFormCard({
  title,
  values,
  error,
  saving,
  submitLabel,
  savingLabel,
  cancelHref,
  onChange,
  onSubmit,
}: Readonly<TaskGroupFormCardProps>) {
  return (
    <Card className="gap-0 border-white/10 bg-zinc-900/50 py-0 text-zinc-100">
      <CardHeader className="border-b border-white/10 px-6 pb-5 pt-6">
        <CardTitle className="text-xl font-semibold text-white">
          {title}
        </CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit}>
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
              onChange={(e) => onChange({ ...values, name: e.target.value })}
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
            <Link href={cancelHref}>Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="border-0 bg-white text-black hover:bg-zinc-200"
          >
            {saving ? savingLabel : submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
