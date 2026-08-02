"use client";

import { useEffect, useState } from "react";

import {
  fetchLandingPageLocaleDetail,
} from "@/lib/admin/landing-pages-fetch";
import {
  parseLandingPageDetailToFormValues,
  type LandingPageFormValues,
} from "@/lib/admin/landing-page-form-values";
import { isValidRouteId } from "@/lib/admin/parse-route-id";

type UseLandingLocaleOptions = {
  landingPageId: number;
  loading: boolean;
  defaultLang: string;
  selectedLang: string;
  defaultValues: LandingPageFormValues;
  translatedLangs: string[];
  missingTranslationNotice: string;
  emptyTranslationNotice: string;
};

export function useLandingLocaleSelection({
  landingPageId,
  loading,
  defaultLang,
  selectedLang,
  defaultValues,
  translatedLangs,
  missingTranslationNotice,
  emptyTranslationNotice,
}: UseLandingLocaleOptions) {
  const [values, setValues] = useState(defaultValues);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingLangDetail, setLoadingLangDetail] = useState(false);

  useEffect(() => {
    setValues(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    if (!isValidRouteId(landingPageId) || loading) return;

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
          // Banner is shared across languages — always from default content.
          setValues({
            ...parsed,
            defaultLang,
            bannerImageUrl: defaultValues.bannerImageUrl,
          });
          if (!translatedLangs.includes(selectedLang)) {
            setNotice(missingTranslationNotice);
          }
          return;
        }
        setValues({
          ...defaultValues,
          defaultLang,
          bannerImageUrl: defaultValues.bannerImageUrl,
        });
        setNotice(emptyTranslationNotice);
      } catch (e) {
        if (cancelled) return;
        setValues({ ...defaultValues, defaultLang });
        setError(
          e instanceof Error ? e.message : "Load language detail failed",
        );
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
    emptyTranslationNotice,
    landingPageId,
    loading,
    missingTranslationNotice,
    selectedLang,
    translatedLangs,
  ]);

  return {
    values,
    setValues,
    notice,
    setNotice,
    error,
    setError,
    loadingLangDetail,
  };
}
