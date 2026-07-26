"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const LANDING_LANGUAGE_OPTIONS = [
  "en",
  "zh-CN",
  "ja",
  "ko",
  "fr",
  "es",
] as const;

type LandingLanguagePanelProps = {
  defaultLang: string;
  selectedLang: string;
  translatedLangs: string[];
  onSelectedLangChange: (lang: string) => void;
  action?: React.ReactNode;
};

export function LandingLanguagePanel({
  defaultLang,
  selectedLang,
  translatedLangs,
  onSelectedLangChange,
  action,
}: Readonly<LandingLanguagePanelProps>) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-zinc-400">Default language</span>
        <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
          {defaultLang}
        </Badge>
        <span className="ml-2 text-sm text-zinc-500">Translated:</span>
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
          <Select value={selectedLang} onValueChange={onSelectedLangChange}>
            <SelectTrigger className="h-9 w-40 border-white/10 bg-zinc-900/80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANDING_LANGUAGE_OPTIONS.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        {action}
      </div>
    </div>
  );
}
