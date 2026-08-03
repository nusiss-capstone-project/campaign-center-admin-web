"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { LandingDetailsForm } from "@/components/admin/landing-details-form";
import { LandingLanguagePanel } from "@/components/admin/landing-language-panel";
import { useAdminCapabilities } from "@/components/admin/admin-access-provider";
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
  fetchLandingPageTranslatedLangs,
} from "@/lib/admin/landing-pages-fetch";
import {
  emptyLandingPageFormValues,
  parseLandingPageDetailToFormValues,
  pickLandingPageStatus,
} from "@/lib/admin/landing-page-form-values";
import { isValidRouteId, parseRouteId } from "@/lib/admin/parse-route-id";
import { useLandingLocaleSelection } from "@/lib/admin/use-landing-locale-selection";

export default function AdminLandingPageDetailPage() {
  const params = useParams();
  const landingPageId = parseRouteId(params?.id);
  const caps = useAdminCapabilities();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [raw, setRaw] = useState<unknown>(null);
  const [defaultValues, setDefaultValues] = useState(() =>
    emptyLandingPageFormValues(),
  );
  const [defaultLang, setDefaultLang] = useState("en");
  const [selectedLang, setSelectedLang] = useState("en");
  const [translatedLangs, setTranslatedLangs] = useState<string[]>([]);

  useEffect(() => {
    if (!isValidRouteId(landingPageId)) {
      setLoading(false);
      setLoadError("Invalid landing page id");
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await fetchLandingPageDetail(landingPageId);
        if (cancelled) return;
        const parsed = parseLandingPageDetailToFormValues(data);
        setRaw(data);
        setDefaultValues(parsed);
        setDefaultLang(parsed.defaultLang);
        setSelectedLang(parsed.defaultLang);
        const langs = await fetchLandingPageTranslatedLangs(landingPageId);
        if (cancelled) return;
        setTranslatedLangs(langs);
      } catch (e) {
        if (cancelled) return;
        setLoadError(e instanceof Error ? e.message : "Load failed");
        setRaw(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [landingPageId]);

  const {
    values,
    notice,
    error: localeError,
    loadingLangDetail,
  } = useLandingLocaleSelection({
    landingPageId,
    loading,
    defaultLang,
    selectedLang,
    defaultValues,
    translatedLangs,
    missingTranslationNotice:
      "This language has no saved translation tag yet. Open edit to generate and save it.",
    emptyTranslationNotice:
      "No saved translation for this language. Open edit to generate it.",
  });

  const statusCode = pickLandingPageStatus(raw);
  const statusLabel = statusCodeToLabel(statusCode);
  const canEdit = statusCode === 1 || statusCode === 2;
  const error = loadError ?? localeError;

  function renderContent() {
    if (loading) {
      return <p className="text-sm text-zinc-500">Loading…</p>;
    }
    if (error) {
      return (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      );
    }
    return (
      <div className="flex flex-col gap-4">
        <LandingLanguagePanel
          defaultLang={defaultLang}
          selectedLang={selectedLang}
          translatedLangs={translatedLangs}
          onSelectedLangChange={setSelectedLang}
        />
        {notice ? (
          <p className="text-sm text-emerald-300" role="status">
            {notice}
          </p>
        ) : null}
        {loadingLangDetail ? (
          <p className="text-sm text-zinc-500">Loading language detail…</p>
        ) : null}
        <LandingDetailsForm values={values} readOnly statusLabel={statusLabel} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" asChild className="border-white/10 bg-zinc-900/50">
          <Link href="/admin/landing-pages">← Landing pages</Link>
        </Button>
        {canEdit && caps.canEditLandingPage ? (
          <Button asChild className="border-0 bg-white text-black hover:bg-zinc-200">
            <Link href={`/admin/landing-pages/${landingPageId}/edit`}>Edit</Link>
          </Button>
        ) : null}
      </div>

      <Card className="border-white/10 bg-zinc-900/40 text-zinc-100 ring-white/10">
        <CardHeader>
          <CardTitle className="text-white">
            {values.title || `Landing page ${landingPageId}`}
          </CardTitle>
          <CardDescription className="text-zinc-500">
            View landing page details
          </CardDescription>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
        {!loading && !error ? (
          <CardFooter className="border-t border-white/10 bg-transparent">
            <Button variant="outline" asChild className="border-white/10">
              <Link href="/admin/landing-pages">Back to list</Link>
            </Button>
          </CardFooter>
        ) : null}
      </Card>
    </div>
  );
}
