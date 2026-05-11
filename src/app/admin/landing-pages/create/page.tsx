"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { api_LandingPageBody } from "@/lib/api/models/api_LandingPageBody";
import { AdminLandingPageService } from "@/lib/api/services/AdminLandingPageService";
import { ApiError } from "@/lib/api/core/ApiError";
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
import { Textarea } from "@/components/ui/textarea";

export default function AdminCreateLandingPagePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [terms, setTerms] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [language, setLanguage] = useState("en-US");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const body: api_LandingPageBody = {
      title: title.trim(),
      description: description.trim(),
      terms: terms.trim(),
      bannerImageUrl: bannerImageUrl.trim(),
      language: language.trim(),
    };
    if (
      !body.title ||
      !body.description ||
      !body.terms ||
      !body.bannerImageUrl ||
      !body.language
    ) {
      setError("All fields are required.");
      setSubmitting(false);
      return;
    }
    try {
      await AdminLandingPageService.postAdminLandingPages(body);
      router.push("/admin/landing-pages");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? `${err.status} ${err.statusText}`
          : err instanceof Error
            ? err.message
            : "Create failed",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create landing page</CardTitle>
          <CardDescription>POST /admin/landing-pages</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="flex flex-col gap-4">
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted-foreground">Title</span>
              <Input
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted-foreground">Language</span>
              <Input
                value={language}
                onChange={(ev) => setLanguage(ev.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted-foreground">Banner image URL</span>
              <Input
                value={bannerImageUrl}
                onChange={(ev) => setBannerImageUrl(ev.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted-foreground">Description</span>
              <Textarea
                value={description}
                onChange={(ev) => setDescription(ev.target.value)}
                required
                rows={5}
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted-foreground">Terms</span>
              <Textarea
                value={terms}
                onChange={(ev) => setTerms(ev.target.value)}
                required
                rows={6}
              />
            </label>
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-3 border-t bg-transparent">
            <Button variant="outline" type="button" asChild>
              <Link href="/admin/landing-pages">Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating…" : "Create"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
