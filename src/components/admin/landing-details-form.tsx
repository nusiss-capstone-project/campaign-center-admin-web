"use client";

import type { LandingPageFormValues } from "@/lib/admin/landing-page-form-values";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type LandingDetailsFormProps = {
  values: LandingPageFormValues;
  readOnly: boolean;
  onChange?: (next: LandingPageFormValues) => void;
  statusLabel?: string | null;
  defaultLangReadOnly?: boolean;
  bannerReadOnly?: boolean;
};

function patch(
  prev: LandingPageFormValues,
  p: Partial<LandingPageFormValues>,
): LandingPageFormValues {
  return { ...prev, ...p };
}

export function LandingDetailsForm({
  values,
  readOnly,
  onChange,
  statusLabel,
  defaultLangReadOnly = false,
  bannerReadOnly = false,
}: LandingDetailsFormProps) {
  const ro = readOnly;
  const set = (p: Partial<LandingPageFormValues>) => {
    if (!readOnly && onChange) onChange(patch(values, p));
  };

  const fieldClass =
    "border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70";

  return (
    <div className="flex flex-col gap-4">
      {statusLabel != null && statusLabel !== "" ? (
        <p className="text-sm text-zinc-400">
          Status: <span className="text-zinc-100">{statusLabel}</span>
        </p>
      ) : null}
      <label className="grid gap-1.5 text-sm">
        <span className="text-zinc-400">Title</span>
        <Input
          value={values.title}
          onChange={(e) => set({ title: e.target.value })}
          disabled={ro}
          readOnly={ro}
          required={!ro}
          className={fieldClass}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="text-zinc-400">Default Language</span>
        <Input
          value={values.defaultLang}
          onChange={(e) => set({ defaultLang: e.target.value })}
          disabled={ro || defaultLangReadOnly}
          readOnly={ro || defaultLangReadOnly}
          required={!ro}
          className={fieldClass}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="text-zinc-400">Banner image URL</span>
        <Input
          value={values.bannerImageUrl}
          onChange={(e) => set({ bannerImageUrl: e.target.value })}
          disabled={ro || bannerReadOnly}
          readOnly={ro || bannerReadOnly}
          required={!ro}
          className={fieldClass}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="text-zinc-400">Description</span>
        <Textarea
          value={values.description}
          onChange={(e) => set({ description: e.target.value })}
          disabled={ro}
          readOnly={ro}
          required={!ro}
          rows={5}
          className={fieldClass}
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="text-zinc-400">Terms</span>
        <Textarea
          value={values.terms}
          onChange={(e) => set({ terms: e.target.value })}
          disabled={ro}
          readOnly={ro}
          required={!ro}
          rows={6}
          className={fieldClass}
        />
      </label>
    </div>
  );
}
