"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  createCampaign,
} from "@/lib/admin/campaign-admin-fetch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminCreateCampaignPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const campaignId = await createCampaign(trimmed);
      router.push(`/admin/campaigns/${campaignId}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-6">
      <Button
        variant="outline"
        asChild
        className="w-fit border-white/10 bg-zinc-900/50"
      >
        <Link href="/admin/campaigns">← Campaigns</Link>
      </Button>

      <Card className="border-white/10 bg-zinc-900/40 text-zinc-100 ring-white/10">
        <CardHeader>
          <CardTitle className="text-white">Create campaign</CardTitle>
          <CardDescription className="text-zinc-500">
            Create a campaign shell with a name. You will configure the draft
            version on the next screen.
          </CardDescription>
        </CardHeader>
        <form onSubmit={(e) => void onSubmit(e)}>
          <CardContent className="flex flex-col gap-4">
            {error ? (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            ) : null}
            <label className="grid gap-1.5 text-sm">
              <span className="text-zinc-400">Name</span>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={submitting}
                className="border-white/10 bg-zinc-900/80 text-zinc-100"
                placeholder="Campaign name"
              />
            </label>
          </CardContent>
          <CardFooter className="flex justify-between gap-3 border-t border-white/10 bg-transparent">
            <Button
              variant="outline"
              type="button"
              asChild
              className="border-white/10"
            >
              <Link href="/admin/campaigns">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="border-0 bg-white text-black hover:bg-zinc-200"
            >
              {submitting ? "Creating…" : "Create"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
