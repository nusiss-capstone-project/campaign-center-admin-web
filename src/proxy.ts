import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Next.js 16 renamed the middleware file convention to `proxy.ts`.
// `next build` reports this entrypoint as "Proxy (Middleware)".
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isAdminRoute(req)) return NextResponse.next();

  const authObject = await auth.protect();

  const claims = authObject.sessionClaims as Record<string, unknown> | null;
  const metadata =
    (claims?.publicMetadata as Record<string, unknown> | undefined) ??
    (claims?.public_metadata as Record<string, unknown> | undefined) ??
    (claims?.metadata as Record<string, unknown> | undefined);
  let role = metadata?.role;

  if (role == null && authObject.userId) {
    const client = await clerkClient();
    const user = await client.users.getUser(authObject.userId);
    role = (user.publicMetadata as Record<string, unknown>).role;
  }

  // Fail closed: admin UI is only available to users explicitly marked admin
  // in Clerk metadata. Backend RBAC must still enforce admin API access.
  if (role !== "admin") {
    return NextResponse.redirect(new URL("/forbidden", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
