import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Vercel “Deployment → Logs” 里 RSC 的 `console.log` 往往不出现在 Messages 列；
 * Middleware 的 stdout 一般会带上，便于确认 `NEXT_PUBLIC_API_BASE_URL` 是否在 Edge 构建里可见。
 */
export function middleware(request: NextRequest) {
  const isVercelProduction =
    process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production";
  if (!isVercelProduction) {
    console.log("[API_BASE_URL middleware]", {
      path: request.nextUrl.pathname,
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
      VERCEL_ENV: process.env.VERCEL_ENV,
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
