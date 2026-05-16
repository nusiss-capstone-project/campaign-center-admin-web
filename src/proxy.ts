import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/wallet(.*)",
  "/campaigns(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req)) return NextResponse.next();

  const authObject = await auth.protect();

  if (isAdminRoute(req)) {
    const claims = authObject.sessionClaims as Record<string, unknown>;
    const metadata =
      (claims.publicMetadata as Record<string, unknown> | undefined) ??
      (claims.metadata as Record<string, unknown> | undefined);
    const role = metadata?.role;

    // If Clerk metadata is not configured yet, keep frontend authorization minimal
    // and let the backend enforce admin permissions.
    if (role != null && role !== "admin") {
      return NextResponse.redirect(new URL("/wallet", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
