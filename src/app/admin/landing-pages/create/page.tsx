"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { LandingDetailsForm } from "@/components/admin/landing-details-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  emptyLandingPageFormValues,
  toLandingPageBody,
} from "@/lib/admin/landing-page-form-values";
import { AdminLandingPageService } from "@/lib/api/services/AdminLandingPageService";
import { ApiError } from "@/lib/api/core/ApiError";

export default function AdminCreateLandingPagePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState(() => emptyLandingPageFormValues());

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const body = toLandingPageBody(values);
    if (
      !body.title ||
      !body.description ||
      !body.terms ||
      !body.bannerImageUrl ||
      !body.defaultLang
    ) {
      setError("Title, language, banner, description, and terms are required.");
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
      <Card className="border-white/10 bg-zinc-900/40 text-zinc-100 ring-white/10">
        <CardHeader>
          <CardTitle className="text-white">Create landing page</CardTitle>
          <CardDescription className="text-zinc-500">
            Create a draft landing page, then edit content and publish.
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="flex flex-col gap-4">
            {error ? (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            ) : null}
            <LandingDetailsForm
              values={values}
              readOnly={false}
              onChange={setValues}
            />
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-3 border-t border-white/10 bg-transparent">
            <Button variant="outline" type="button" asChild className="border-white/10">
              <Link href="/admin/landing-pages">Cancel</Link>
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
