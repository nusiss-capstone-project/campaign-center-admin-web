"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Gift, Trophy, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UserShell,
  useLangFromQuery,
  useDemoUserId,
  withLangParam,
} from "@/components/user/user-shell";
import {
  apiErrorMessage,
  fetchUserCampaignCards,
  type UserCampaignCard,
} from "@/lib/web/user-app-api";

export default function CampaignsPage() {
  const userId = useDemoUserId();
  const lang = useLangFromQuery();
  const [campaigns, setCampaigns] = useState<UserCampaignCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCampaigns(await fetchUserCampaignCards());
    } catch (e) {
      setCampaigns([]);
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
            Campaigns
          </h1>
          <p className="mt-2 text-lg text-slate-400">
            Participate in growth campaigns and earn rewards.
          </p>
        </div>

        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20">
              <Trophy className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Active Campaigns
              </h2>
              <p className="text-sm text-slate-500">
                Campaign detail links reuse the existing landing page.
              </p>
            </div>
          </div>

          {error ? (
            <p
              className="rounded-2xl border border-red-500/20 bg-red-950/40 px-4 py-3 text-sm text-red-200"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          {loading ? (
            <p className="rounded-3xl border border-white/10 bg-slate-950/60 p-8 text-sm text-slate-500">
              Loading campaigns…
            </p>
          ) : campaigns.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-white/10 bg-slate-950/40 p-12 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-slate-900 text-slate-500 ring-1 ring-white/10">
                <Trophy className="size-8" aria-hidden />
              </div>
              <p className="mt-4 text-sm text-slate-500">
                No active campaigns yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {campaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={withLangParam(`/campaigns/${campaign.id}`, lang)}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-950 to-emerald-950/35 p-6 shadow-2xl shadow-emerald-950/10 transition hover:-translate-y-0.5 hover:border-emerald-400/30"
                >
                  <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_95%_5%,rgba(34,197,94,0.16),transparent_35%)]"
                    aria-hidden
                  />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-semibold text-white">
                          {campaign.title}
                        </h3>
                        <p className="mt-3 line-clamp-2 max-w-2xl text-base leading-relaxed text-slate-400">
                          {campaign.description}
                        </p>
                      </div>
                      <ArrowRight className="mt-1 size-6 shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-emerald-400" />
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                      <span className="inline-flex items-center gap-2 text-emerald-400">
                        <Gift className="size-4" aria-hidden />
                        {campaign.rewardLabel}
                      </span>
                      <span className="inline-flex items-center gap-2 text-slate-400">
                        <Users className="size-4" aria-hidden />
                        {campaign.participantLabel}
                      </span>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                      <Badge className="rounded-full border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                        {campaign.statusLabel}
                      </Badge>
                      <p className="text-sm text-slate-500">
                        {campaign.periodLabel}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-white">
            Coming Soon
          </h2>
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-slate-950/30 p-12 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-slate-900 text-slate-500 ring-1 ring-white/10">
              <Trophy className="size-8" aria-hidden />
            </div>
            <p className="mt-4 text-sm text-slate-500">
              More growth campaigns will appear here.
            </p>
          </div>
        </section>

        <div className="flex justify-center">
          <Button asChild className="rounded-full bg-emerald-500 text-slate-950">
            <Link href={withLangParam("/wallet", lang)}>Back to wallet</Link>
          </Button>
        </div>
      </div>
    </UserShell>
  );
}
