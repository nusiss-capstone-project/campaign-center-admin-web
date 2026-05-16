"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  generateLandingPageTranslation,
  saveLandingPageTranslation,
  updateLandingPage,
} from "@/lib/admin/landing-pages-fetch";
import {
  emptyLandingPageFormValues,
  parseLandingPageDetailToFormValues,
  pickLandingPageStatus,
  toLandingPageBody,
} from "@/lib/admin/landing-page-form-values";

const LANGUAGE_OPTIONS = ["en", "zh-CN", "ja", "ko", "fr", "es"] as const;

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
  const [generatingTranslation, setGeneratingTranslation] = useState(false);

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
          const parsed = parseLandingPageDetailToFormValues(data);
          setValues(parsed);
          setDefaultValues(parsed);
          setDefaultLang(parsed.defaultLang);
          setSelectedLang(parsed.defaultLang);
          return;
        }
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
  }, [landingPageId, router]);

  const statusCode = pickLandingPageStatus(raw);
  const statusLabel = statusCodeToLabel(statusCode);
  const canSubmit = statusCode === 1 || statusCode === 2;
  const editingDefault = selectedLang === defaultLang;

  useEffect(() => {
    if (!Number.isFinite(landingPageId) || landingPageId <= 0 || loading) {
      return;
    }

    let cancelled = false;

    async function loadSelectedLang() {
      setNotice(null);
      setError(null);
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
              "No saved translation tag found for this language. Review or generate before saving.",
            );
          }
        } else {
          setValues({
            ...defaultValues,
            defaultLang,
          });
          setNotice("No saved translation yet. Click Translate to generate a draft.");
        }
      } catch (e) {
        if (cancelled) return;
        setValues({ ...defaultValues, defaultLang });
        setError(e instanceof Error ? e.message : "Load language detail failed");
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

  async function onGenerateTranslation() {
    if (editingDefault || !canSubmit) return;
    setError(null);
    setNotice(null);
    setGeneratingTranslation(true);
    try {
      const generated = await generateLandingPageTranslation(landingPageId, {
        sourceLang: defaultLang,
        targetLang: selectedLang,
        title: defaultValues.title,
        description: defaultValues.description,
        terms: defaultValues.terms,
      });
      if (!generated) {
        setNotice("No translated content returned.");
        return;
      }
      const parsed = parseLandingPageDetailToFormValues(generated);
      setValues({
        ...values,
        title: parsed.title || values.title,
        description: parsed.description || values.description,
        terms: parsed.terms || values.terms,
        defaultLang,
        bannerImageUrl: values.bannerImageUrl || defaultValues.bannerImageUrl,
      });
      setNotice("Translation generated. Please review and save.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generate translation failed");
    } finally {
      setGeneratingTranslation(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSaving(true);
    const payload = toLandingPageBody(values);
    if (
      !payload.title ||
      !payload.defaultLang ||
      !payload.bannerImageUrl ||
      !payload.description ||
      !payload.terms
    ) {
      setError("All fields are required.");
      setSaving(false);
      return;
    }
    try {
      if (editingDefault) {
        await updateLandingPage(landingPageId, payload);
        setDefaultValues(values);
        setDefaultLang(payload.defaultLang);
        setSelectedLang(payload.defaultLang);
        router.push(`/admin/landing-pages/${landingPageId}`);
      } else {
        await saveLandingPageTranslation(landingPageId, selectedLang, {
          title: values.title.trim(),
          description: values.description.trim(),
          terms: values.terms.trim(),
          operator: "admin",
        });
        setTranslatedLangs((langs) =>
          langs.includes(selectedLang) ? langs : [...langs, selectedLang],
        );
        setNotice("Translation saved.");
      }
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
            Update default content or manage translated landing page content
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="flex flex-col gap-4">
            {loading ? (
              <p className="text-sm text-zinc-500">Loading…</p>
            ) : (
              <>
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

                  <div className="mt-4 flex flex-wrap items-end gap-3">
                    <label className="grid gap-1.5 text-sm">
                      <span className="text-zinc-400">Selected language</span>
                      <Select
                        value={selectedLang}
                        onValueChange={setSelectedLang}
                      >
                        <SelectTrigger className="h-9 w-40 border-white/10 bg-zinc-900/80">
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
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/10 bg-zinc-900/50"
                      disabled={
                        editingDefault ||
                        loadingLangDetail ||
                        generatingTranslation ||
                        !canSubmit
                      }
                      onClick={() => void onGenerateTranslation()}
                    >
                      {generatingTranslation ? "Translating…" : "Translate"}
                    </Button>
                  </div>
                </div>
                {error ? (
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                ) : null}
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
                  readOnly={!canSubmit}
                  onChange={setValues}
                  statusLabel={statusLabel}
                  defaultLangReadOnly={!editingDefault}
                  bannerReadOnly={!editingDefault}
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
              {saving
                ? "Saving…"
                : editingDefault
                  ? "Save changes"
                  : "Save Translation"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
