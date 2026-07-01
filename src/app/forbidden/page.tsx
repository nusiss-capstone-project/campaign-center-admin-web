import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#030712] px-4 py-12 text-center text-white">
      <p className="text-sm font-medium uppercase tracking-widest text-amber-400">
        403 Forbidden
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Admin access only
      </h1>
      <p className="mt-3 max-w-md text-sm text-zinc-400">
        This application is restricted to admin users. If you believe this is a
        mistake, contact your administrator or sign in with a different
        account.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/sign-in"
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
        >
          Sign in
        </Link>
        <SignOutButton>
          <button className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400">
            Sign out
          </button>
        </SignOutButton>
      </div>
    </main>
  );
}
