import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * 非 Vercel Production 才可用：浏览器打开即可确认 public env 是否注入（无需在 Logs 里搜）。
 * 排查完可删整个 `api/debug` 目录。
 */
export async function GET() {
  const isVercelProduction =
    process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production";
  if (isVercelProduction) {
    return new NextResponse(null, { status: 404 });
  }

  const raw = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  console.log("[api/debug/public-env]", {
    defined: raw.length > 0,
    length: raw.length,
    VERCEL_ENV: process.env.VERCEL_ENV,
  });

  return NextResponse.json({
    NEXT_PUBLIC_API_BASE_URL_defined: raw.length > 0,
    NEXT_PUBLIC_API_BASE_URL_length: raw.length,
    NEXT_PUBLIC_API_BASE_URL_preview: raw ? `${raw.slice(0, 32)}${raw.length > 32 ? "…" : ""}` : "",
    VERCEL_ENV: process.env.VERCEL_ENV ?? null,
    NODE_ENV: process.env.NODE_ENV ?? null,
  });
}
