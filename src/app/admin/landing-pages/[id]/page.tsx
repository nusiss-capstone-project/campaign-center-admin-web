"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { LandingDetailsForm } from "@/components/admin/landing-details-form";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusCodeToLabel } from "@/lib/admin/campaign-form-values";
import {
  fetchLandingPageDetail,
  fetchLandingPageLocaleDetail,
  fetchLandingPageTranslatedLangs,
} from "@/lib/admin/landing-pages-fetch";
import {
  emptyLandingPageFormValues,
  parseLandingPageDetailToFormValues,
  pickLandingPageStatus,
} from "@/lib/admin/landing-page-form-values";

const LANGUAGE_OPTIONS = ["en", "zh-CN", "ja", "ko", "fr", "es"] as const;

export default function AdminLandingPageDetailPage() {
  const params = useParams();
  const idParam = params?.id;
  const landingPageId =
    typeof idParam === "string"
      ? Number(idParam)
      : Array.isArray(idParam)
        ? Number(idParam[0])
        : NaN;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [raw, setRaw] = useState<unknown>(null);
  const [values, setValues] = useState(() => emptyLandingPageFormValues());
  const [defaultValues, setDefaultValues] = useState(() =>
    emptyLandingPageFormValues(),
  );
  const [defaultLang, setDefaultLang] = useState("en");
  const [selectedLang, setSelectedLang] = useState("en");
  const [translatedLangs, setTranslatedLangs] = useState<string[]>([]);
  const [loadingLangDetail, setLoadingLangDetail] = useState(false);

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
        const parsed = parseLandingPageDetailToFormValues(data);
        setRaw(data);
        setValues(parsed);
        setDefaultValues(parsed);
        setDefaultLang(parsed.defaultLang);
        setSelectedLang(parsed.defaultLang);
        const langs = await fetchLandingPageTranslatedLangs(landingPageId);
        if (cancelled) return;
        setTranslatedLangs(langs);
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
  }, [landingPageId]);

  const statusCode = pickLandingPageStatus(raw);
  const statusLabel = statusCodeToLabel(statusCode);
  const canEdit = statusCode === 1 || statusCode === 2;

  useEffect(() => {
    if (!Number.isFinite(landingPageId) || landingPageId <= 0 || loading) {
      return;
    }

    let cancelled = false;

    async function loadSelectedLang() {
      setNotice(null);
      if (selectedLang === defaultLang) {
        setValues(defaultValues);
        return;
      }
      setLoadingLangDetail(true);
      try {
        const detail = await fetchLandingPageLocaleDetail(
          landingPageId,
          selectedLang,
        );
        if (cancelled) return;
        if (detail) {
          const parsed = parseLandingPageDetailToFormValues(detail);
          setValues({
            ...parsed,
            defaultLang,
            bannerImageUrl: parsed.bannerImageUrl || defaultValues.bannerImageUrl,
          });
          if (!translatedLangs.includes(selectedLang)) {
            setNotice(
              "This language has no saved translation tag yet. Open edit to generate and save it.",
            );
          }
        } else {
          setValues({ ...defaultValues, defaultLang });
          setNotice(
            "No saved translation for this language. Open edit to generate it.",
          );
        }
      } catch (e) {
        if (cancelled) return;
        setValues({ ...defaultValues, defaultLang });
        setNotice(e instanceof Error ? e.message : "Load language detail failed");
      } finally {
        if (!cancelled) setLoadingLangDetail(false);
      }
    }

    void loadSelectedLang();

    return () => {
      cancelled = true;
    };
  }, [
    defaultLang,
    defaultValues,
    landingPageId,
    loading,
    selectedLang,
    translatedLangs,
  ]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" asChild className="border-white/10 bg-zinc-900/50">
          <Link href="/admin/landing-pages">← Landing pages</Link>
        </Button>
        {canEdit ? (
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
        <CardContent>
          {loading ? (
            <p className="text-sm text-zinc-500">Loading…</p>
          ) : error ? (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-zinc-400">
                    Default language
                  </span>
                  <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                    {defaultLang}
                  </Badge>
                  <span className="ml-2 text-sm text-zinc-500">
                    Translated:
                  </span>
                  {translatedLangs.length > 0 ? (
                    translatedLangs.map((lang) => (
                      <Badge
                        key={lang}
                        variant="outline"
                        className="border-white/10 text-zinc-300"
                      >
                        {lang}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-zinc-600">None</span>
                  )}
                </div>
                <label className="mt-4 grid max-w-xs gap-1.5 text-sm">
                  <span className="text-zinc-400">Selected language</span>
                  <Select value={selectedLang} onValueChange={setSelectedLang}>
                    <SelectTrigger className="h-9 border-white/10 bg-zinc-900/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
              </div>
              {notice ? (
                <p className="text-sm text-emerald-300" role="status">
                  {notice}
                </p>
              ) : null}
              {loadingLangDetail ? (
                <p className="text-sm text-zinc-500">Loading language detail…</p>
              ) : null}
              <LandingDetailsForm
                values={values}
                readOnly
                statusLabel={statusLabel}
              />
            </div>
          )}
        </CardContent>
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
