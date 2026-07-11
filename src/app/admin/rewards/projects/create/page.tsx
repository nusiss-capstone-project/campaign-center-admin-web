"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createProject } from "@/lib/admin/reward/reward-api";
import { rewardApiErrorMessage } from "@/lib/admin/reward/reward-utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminCreateRewardProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required.");
      return;
    }
    setSubmitting(true);
    try {
      await createProject({
        name: trimmedName,
        description: description.trim() || undefined,
      });
      router.push("/admin/rewards/projects");
    } catch (err) {
      setError(rewardApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <Link
        href="/admin/rewards/projects"
        className="text-sm text-zinc-500 hover:text-zinc-300"
      >
        ← Projects
      </Link>
      <Card className="border-white/10 bg-zinc-900/40">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="flex flex-col gap-4">
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <label className="grid gap-1.5 text-sm">
              <span className="text-zinc-400">Name</span>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-zinc-400">Description</span>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </label>
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-3 border-t border-white/10 bg-transparent">
            <Button variant="outline" type="button" asChild>
              <Link href="/admin/rewards/projects">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-white text-black hover:bg-zinc-200"
            >
              {submitting ? "Creating…" : "Create"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
