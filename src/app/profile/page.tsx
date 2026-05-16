"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Bell, ChevronRight, Shield, User, WalletCards } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UserShell,
  useUserIdFromQuery,
  withUserId,
} from "@/components/user/user-shell";

export default function ProfilePage() {
  const userId = useUserIdFromQuery();

  return (
    <UserShell userId={userId}>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Profile
          </h1>
          <p className="mt-2 text-lg text-slate-400">Manage your account.</p>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-emerald-950/10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex size-20 items-center justify-center rounded-[1.75rem] bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20">
                <User className="size-10" aria-hidden />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  CryptoUser #{userId}
                </h2>
                <p className="mt-1 text-slate-400">user@example.com</p>
                <p className="mt-2 text-sm font-medium text-emerald-400">
                  ✓ Verified
                </p>
              </div>
            </div>
            <Badge className="w-fit rounded-full border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-emerald-300">
              VIP 2
            </Badge>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <ProfileStat value="12" label="Campaigns" />
          <ProfileStat value="28" label="Transactions" />
          <ProfileStat value="$450" label="Rewards" accent />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <ProfileAction
            icon={<Shield className="size-6" aria-hidden />}
            title="Security Settings"
            subtitle="Password, 2FA, and account verification"
          />
          <ProfileAction
            icon={<Bell className="size-6" aria-hidden />}
            title="Notifications"
            subtitle="Campaign and reward alerts"
            badge="3"
          />
          <ProfileAction
            icon={<WalletCards className="size-6" aria-hidden />}
            title="Wallet"
            subtitle="View balance and recent transactions"
            href={withUserId("/wallet", userId)}
          />
        </section>

        <div>
          <Button
            variant="outline"
            asChild
            className="rounded-full border-white/10 bg-slate-950/60"
          >
            <Link href={withUserId("/campaigns", userId)}>
              Browse campaigns
            </Link>
          </Button>
        </div>
      </div>
    </UserShell>
  );
}

function ProfileStat({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-6 text-center">
      <p
        className={
          accent
            ? "text-3xl font-semibold text-emerald-400"
            : "text-3xl font-semibold text-white"
        }
      >
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-500">{label}</p>
    </div>
  );
}

function ProfileAction({
  icon,
  title,
  subtitle,
  badge,
  href = "#",
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-950/50 p-5 transition hover:border-emerald-400/30 hover:bg-white/[0.03]"
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-slate-900 text-slate-400 ring-1 ring-white/10 group-hover:text-emerald-400">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {badge ? (
        <span className="flex size-7 items-center justify-center rounded-full bg-red-500 text-sm font-semibold text-white">
          {badge}
        </span>
      ) : null}
      <ChevronRight className="size-5 text-slate-600 group-hover:text-emerald-400" />
    </Link>
  );
}
