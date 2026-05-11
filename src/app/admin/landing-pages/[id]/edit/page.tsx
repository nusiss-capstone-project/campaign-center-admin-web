"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
import { statusCodeToLabel } from "@/lib/admin/campaign-form-values";
import {
  fetchLandingPageDetail,
  updateLandingPage,
} from "@/lib/admin/landing-pages-fetch";
import {
  emptyLandingPageFormValues,
  parseLandingPageDetailToFormValues,
  pickLandingPageStatus,
  toLandingPageBody,
} from "@/lib/admin/landing-page-form-values";

export default function AdminLandingPageEditPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id;
  const landingPageId =
    typeof idParam === "string"
      ? Number(idParam)
      : Array.isArray(idParam)
        ? Number(idParam[0])
        : NaN;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState<unknown>(null);
  const [values, setValues] = useState(() => emptyLandingPageFormValues());

  useEffect(() => {
    if (!Number.isFinite(landingPageId) || landingPageId <= 0) {
      setLoading(false);
      setError("Invalid landing page id");
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchLandingPageDetail(landingPageId);
        if (cancelled) return;
        const code = pickLandingPageStatus(data);
        if (code === 3) {
          router.replace(`/admin/landing-pages/${landingPageId}`);
          return;
        }
        if (code !== 1 && code !== 2) {
          setError("Only draft or published landing pages can be edited.");
          setRaw(data);
          setValues(parseLandingPageDetailToFormValues(data));
          return;
        }
        setRaw(data);
        setValues(parseLandingPageDetailToFormValues(data));
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Load failed");
        setRaw(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [landingPageId, router]);

  const statusCode = pickLandingPageStatus(raw);
  const statusLabel = statusCodeToLabel(statusCode);
  const canSubmit = statusCode === 1 || statusCode === 2;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSaving(true);
    const payload = toLandingPageBody(values);
    if (
      !payload.title ||
      !payload.language ||
      !payload.bannerImageUrl ||
      !payload.description ||
      !payload.terms
    ) {
      setError("All fields are required.");
      setSaving(false);
      return;
    }
    try {
      await updateLandingPage(landingPageId, payload);
      router.push(`/admin/landing-pages/${landingPageId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" asChild className="border-white/10 bg-zinc-900/50">
          <Link href={`/admin/landing-pages/${landingPageId}`}>← Details</Link>
        </Button>
      </div>

      <Card className="border-white/10 bg-zinc-900/40 text-zinc-100 ring-white/10">
        <CardHeader>
          <CardTitle className="text-white">Edit landing page</CardTitle>
          <CardDescription className="text-zinc-500">
            Update fields and save (draft or published only)
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="flex flex-col gap-4">
            {loading ? (
              <p className="text-sm text-zinc-500">Loading…</p>
            ) : (
              <>
                {error ? (
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                ) : null}
                <LandingDetailsForm
                  values={values}
                  readOnly={!canSubmit}
                  onChange={setValues}
                  statusLabel={statusLabel}
                />
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-3 border-t border-white/10 bg-transparent">
            <Button variant="outline" type="button" asChild className="border-white/10">
              <Link href={`/admin/landing-pages/${landingPageId}`}>Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={loading || saving || !canSubmit}
              className="border-0 bg-white text-black hover:bg-zinc-200"
            >
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
