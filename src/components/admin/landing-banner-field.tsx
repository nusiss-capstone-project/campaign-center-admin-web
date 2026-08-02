"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { uploadLandingBannerImage } from "@/lib/admin/landing-pages-fetch";

const BANNER_PREVIEW_WIDTH = 480;
const BANNER_PREVIEW_HEIGHT = 270;
const MAX_BANNER_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

type LandingBannerFieldProps = {
  value: string;
  readOnly: boolean;
  onChange?: (url: string) => void;
};

export function LandingBannerField({
  value,
  readOnly,
  onChange,
}: Readonly<LandingBannerFieldProps>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFileChange(file: File | undefined) {
    if (!file || readOnly || !onChange) return;
    setError(null);

    if (!ACCEPTED_TYPES.has(file.type)) {
      setError("Use jpg, png, webp, or gif.");
      return;
    }
    if (file.size > MAX_BANNER_BYTES) {
      setError("Image must be 5MB or smaller.");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadLandingBannerImage(file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-zinc-400">Banner image</span>
        {!readOnly ? (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => void onFileChange(e.target.files?.[0])}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-white/10 bg-zinc-900/50"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
            </Button>
          </>
        ) : null}
      </div>

      {value ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote OSS URLs; fixed preview size
        <img
          src={value}
          alt="Landing page banner"
          width={BANNER_PREVIEW_WIDTH}
          height={BANNER_PREVIEW_HEIGHT}
          className="rounded-lg border border-white/10 object-cover bg-zinc-950"
          style={{
            width: BANNER_PREVIEW_WIDTH,
            height: BANNER_PREVIEW_HEIGHT,
            maxWidth: "100%",
          }}
        />
      ) : (
        <div
          className="flex items-center justify-center rounded-lg border border-dashed border-white/10 bg-zinc-950/50 text-zinc-600"
          style={{
            width: BANNER_PREVIEW_WIDTH,
            height: BANNER_PREVIEW_HEIGHT,
            maxWidth: "100%",
          }}
        >
          No banner
        </div>
      )}

      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      {!readOnly ? (
        <p className="text-xs text-zinc-500">
          Shared across all languages. jpg/png/webp/gif, max 5MB.
        </p>
      ) : null}
    </div>
  );
}
