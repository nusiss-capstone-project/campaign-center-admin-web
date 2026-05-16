"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Mail, User, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  UserShell,
  useLangFromQuery,
  useDemoUserId,
} from "@/components/user/user-shell";
import {
  apiErrorMessage,
  fetchUserProfile,
  formatDate,
  type UserProfile,
} from "@/lib/web/user-app-api";

export default function ProfilePage() {
  const userId = useDemoUserId();
  const lang = useLangFromQuery();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProfile(await fetchUserProfile());
    } catch (e) {
      setProfile(null);
      setError(apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <UserShell userId={userId} lang={lang}>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Profile
          </h1>
          <p className="mt-2 text-lg text-slate-400">Manage your account.</p>
        </div>

        {error ? (
          <p
            className="rounded-2xl border border-red-500/20 bg-red-950/40 px-4 py-3 text-sm text-red-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-emerald-950/10">
          {loading ? (
            <p className="text-sm text-slate-500">Loading profile…</p>
          ) : profile ? (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-5">
                  <div className="flex size-20 items-center justify-center rounded-[1.75rem] bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20">
                    <User className="size-10" aria-hidden />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      {profile.username || "—"}
                    </h2>
                    <p className="mt-1 text-slate-400">{profile.email || "—"}</p>
                  </div>
                </div>
                <Badge
                  className={
                    profile.kycChecked
                      ? "w-fit rounded-full border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-emerald-300"
                      : "w-fit rounded-full border-amber-500/20 bg-amber-500/10 px-4 py-2 text-amber-300"
                  }
                >
                  {profile.kycChecked ? "KYC Verified" : "KYC Pending"}
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <ProfileField
                  icon={<User className="size-5" aria-hidden />}
                  label="Username"
                  value={profile.username || "—"}
                />
                <ProfileField
                  icon={<Mail className="size-5" aria-hidden />}
                  label="Email"
                  value={profile.email || "—"}
                />
                <ProfileField
                  icon={
                    profile.kycChecked ? (
                      <CheckCircle2 className="size-5" aria-hidden />
                    ) : (
                      <XCircle className="size-5" aria-hidden />
                    )
                  }
                  label="KYC Status"
                  value={profile.kycChecked ? "Checked" : "Not checked"}
                />
                <ProfileField
                  icon={<CalendarDays className="size-5" aria-hidden />}
                  label="Registered At"
                  value={formatDate(profile.registeredAt)}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No profile data.</p>
          )}
        </section>
      </div>
    </UserShell>
  );
}

function ProfileField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-950/50 p-5">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-slate-900 text-emerald-400 ring-1 ring-white/10">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 break-words text-lg font-semibold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
