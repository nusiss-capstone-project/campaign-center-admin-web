import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { fetchCurrentUserWithToken } from "@/lib/admin/identity/current-user";
import { canAccessAdminPath } from "@/lib/admin/rbac/access";
import { normalizeAdminRole } from "@/lib/admin/rbac/roles";

// Next.js 16 renamed the middleware file convention to `proxy.ts`.
// `next build` reports this entrypoint as "Proxy (Middleware)".
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

async function resolveAdminRole(authObject: {
  userId: string | null;
  sessionClaims: unknown;
  getToken: () => Promise<string | null>;
}) {
  // 1) identity-ms current-user (source of truth for finance_admin / campaign_ops)
  try {
    const token = await authObject.getToken();
    if (token) {
      const identityUser = await fetchCurrentUserWithToken(token);
      if (identityUser?.role) return identityUser.role;
    }
  } catch {
    // fall through to Clerk metadata
  }

  // 2) Clerk publicMetadata fallback
  const claims = authObject.sessionClaims as Record<string, unknown> | null;
  const metadata =
    (claims?.publicMetadata as Record<string, unknown> | undefined) ??
    (claims?.public_metadata as Record<string, unknown> | undefined) ??
    (claims?.metadata as Record<string, unknown> | undefined);
  let roleRaw = metadata?.role;

  if (roleRaw == null && authObject.userId) {
    const client = await clerkClient();
    const user = await client.users.getUser(authObject.userId);
    roleRaw = (user.publicMetadata as Record<string, unknown>).role;
  }

  return normalizeAdminRole(roleRaw);
}

export default clerkMiddleware(async (auth, req) => {
  if (!isAdminRoute(req)) return NextResponse.next();

  const authObject = await auth.protect();
  const role = await resolveAdminRole(authObject);
  const pathname = req.nextUrl.pathname;
  const isHome = pathname === "/admin" || pathname === "/admin/";

  // Always allow the default home so the client can load identity current-user.
  // Clerk metadata alone often lacks finance_admin / campaign_ops.
  if (isHome) {
    return NextResponse.next();
  }

  if (!role) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (!canAccessAdminPath(role, pathname)) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
