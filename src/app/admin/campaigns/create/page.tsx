"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import type { api_CreateCampaignReq } from "@/lib/api/models/api_CreateCampaignReq";
import { AdminCampaignService } from "@/lib/api/services/AdminCampaignService";
import { ApiError } from "@/lib/api/core/ApiError";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCampaignDetail } from "@/lib/admin/campaign-admin-fetch";
import {
  parseCampaignDetailToFormValues,
  toRewardRulesPayload,
} from "@/lib/admin/campaign-form-values";

function toIsoFromLocal(dtLocal: string): string {
  if (!dtLocal) return "";
  const d = new Date(dtLocal);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}

function AdminCreateCampaignPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const duplicateFrom = searchParams.get("duplicateFrom");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dupLoading, setDupLoading] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState("TOPUP_REWARD");
  const [targetMarket, setTargetMarket] = useState("");
  const [targetUserSegment, setTargetUserSegment] = useState("");
  const [registrationStartTime, setRegistrationStartTime] = useState("");
  const [registrationEndTime, setRegistrationEndTime] = useState("");
  const [campaignStartTime, setCampaignStartTime] = useState("");
  const [campaignEndTime, setCampaignEndTime] = useState("");
  const [landingPageId, setLandingPageId] = useState("");
  const [rewardType, setRewardType] = useState("TOPUP");
  const [rewardMode, setRewardMode] = useState("FIXED_AMOUNT");
  const [rewardAmount, setRewardAmount] = useState("0");
  const [rewardCurrency, setRewardCurrency] = useState("USD");
  const [rewardPercentage, setRewardPercentage] = useState("0");
  const [maxRewardAmount, setMaxRewardAmount] = useState("0");
  const [topupThreshold, setTopupThreshold] = useState("0");
  const [maxClaimPerUser, setMaxClaimPerUser] = useState("1");
  const [minObtainDays, setMinObtainDays] = useState("0");

  useEffect(() => {
    if (!duplicateFrom) return;
    const id = Number(duplicateFrom);
    if (!Number.isFinite(id) || id <= 0) return;

    let cancelled = false;
    setDupLoading(true);
    setError(null);

    void (async () => {
      try {
        const data = await fetchCampaignDetail(id);
        if (cancelled) return;
        const v = parseCampaignDetailToFormValues(data);
        setName(`${v.name} (copy)`);
        setType(v.type);
        setTargetMarket(v.targetMarket);
        setTargetUserSegment(v.targetUserSegment);
        setRegistrationStartTime(v.registrationStartTime);
        setRegistrationEndTime(v.registrationEndTime);
        setCampaignStartTime(v.campaignStartTime);
        setCampaignEndTime(v.campaignEndTime);
        setLandingPageId(v.landingPageId);
        setRewardType(v.rewardType);
        setRewardMode(v.rewardMode);
        setRewardAmount(v.rewardAmount);
        setRewardCurrency(v.rewardCurrency);
        setRewardPercentage(v.rewardPercentage);
        setMaxRewardAmount(v.maxRewardAmount);
        setTopupThreshold(v.topupThreshold);
        setMaxClaimPerUser(v.maxClaimPerUser);
        setMinObtainDays(v.minObtainDays);
      } catch (e) {
        if (cancelled) return;
        setError(
          e instanceof Error ? e.message : "Could not load campaign to duplicate",
        );
      } finally {
        if (!cancelled) setDupLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [duplicateFrom]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const landingIdTrim = landingPageId.trim();
    const body: api_CreateCampaignReq = {
      name: name.trim(),
      type: type.trim(),
      targetMarket: targetMarket.trim(),
      targetUserSegment: targetUserSegment.trim(),
      registrationStartTime: toIsoFromLocal(registrationStartTime),
      registrationEndTime: toIsoFromLocal(registrationEndTime),
      campaignStartTime: toIsoFromLocal(campaignStartTime),
      campaignEndTime: toIsoFromLocal(campaignEndTime),
      rewardRules: toRewardRulesPayload({
        name,
        type,
        targetMarket,
        targetUserSegment,
        registrationStartTime,
        registrationEndTime,
        campaignStartTime,
        campaignEndTime,
        landingPageId,
        rewardType,
        rewardMode,
        rewardAmount,
        rewardCurrency,
        rewardPercentage,
        maxRewardAmount,
        topupThreshold,
        maxClaimPerUser,
        minObtainDays,
      }),
    };
    if (landingIdTrim !== "") {
      const n = Number(landingIdTrim);
      if (!Number.isNaN(n)) body.landingPageId = n;
    }
    if (
      !body.name ||
      !body.type ||
      !body.targetMarket ||
      !body.targetUserSegment ||
      !body.registrationStartTime ||
      !body.registrationEndTime ||
      !body.campaignStartTime ||
      !body.campaignEndTime
    ) {
      setError("Fill required fields and valid date/time values.");
      setSubmitting(false);
      return;
    }
    try {
      const res = await AdminCampaignService.postAdminCampaigns(body);
      const created =
        res.data &&
        typeof res.data === "object" &&
        "id" in res.data &&
        typeof (res.data as { id: unknown }).id === "number"
          ? (res.data as { id: number }).id
          : null;
      if (created != null) {
        router.push(`/admin/campaigns/${created}`);
        return;
      }
      router.push("/admin/campaigns");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? `${err.status} ${err.statusText}`
          : err instanceof Error
            ? err.message
            : "Create failed",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create campaign</CardTitle>
          <CardDescription>POST /admin/campaigns</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="flex flex-col gap-4">
            {dupLoading ? (
              <p className="text-sm text-muted-foreground">Loading template…</p>
            ) : null}
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted-foreground">Name</span>
              <Input
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted-foreground">Type</span>
              <Input
                value={type}
                onChange={(ev) => setType(ev.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted-foreground">Target market</span>
              <Input
                value={targetMarket}
                onChange={(ev) => setTargetMarket(ev.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted-foreground">Target user segment</span>
              <Input
                value={targetUserSegment}
                onChange={(ev) => setTargetUserSegment(ev.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted-foreground">Landing page ID (optional)</span>
              <Input
                inputMode="numeric"
                value={landingPageId}
                onChange={(ev) => setLandingPageId(ev.target.value)}
                placeholder="e.g. 12"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm">
                <span className="text-muted-foreground">Registration start</span>
                <Input
                  type="datetime-local"
                  value={registrationStartTime}
                  onChange={(ev) => setRegistrationStartTime(ev.target.value)}
                  required
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-muted-foreground">Registration end</span>
                <Input
                  type="datetime-local"
                  value={registrationEndTime}
                  onChange={(ev) => setRegistrationEndTime(ev.target.value)}
                  required
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-muted-foreground">Campaign start</span>
                <Input
                  type="datetime-local"
                  value={campaignStartTime}
                  onChange={(ev) => setCampaignStartTime(ev.target.value)}
                  required
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-muted-foreground">Campaign end</span>
                <Input
                  type="datetime-local"
                  value={campaignEndTime}
                  onChange={(ev) => setCampaignEndTime(ev.target.value)}
                  required
                />
              </label>
            </div>
            <div className="border-t pt-4">
              <p className="mb-3 text-sm font-medium">Reward rules</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm">
                  <span className="text-muted-foreground">Reward type</span>
                  <Input
                    value={rewardType}
                    onChange={(ev) => setRewardType(ev.target.value)}
                    required
                  />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="text-muted-foreground">Reward mode</span>
                  <Select value={rewardMode} onValueChange={setRewardMode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reward mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FIXED_AMOUNT">Fixed amount</SelectItem>
                      <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="text-muted-foreground">Reward currency</span>
                  <Input
                    value={rewardCurrency}
                    onChange={(ev) => setRewardCurrency(ev.target.value)}
                    placeholder="USD"
                  />
                </label>
                {rewardMode === "PERCENTAGE" ? (
                  <>
                    <label className="grid gap-1.5 text-sm">
                      <span className="text-muted-foreground">
                        Reward percentage
                      </span>
                      <Input
                        type="number"
                        step="any"
                        value={rewardPercentage}
                        onChange={(ev) => setRewardPercentage(ev.target.value)}
                        required
                      />
                    </label>
                    <label className="grid gap-1.5 text-sm">
                      <span className="text-muted-foreground">
                        Max reward amount
                      </span>
                      <Input
                        type="number"
                        step="any"
                        value={maxRewardAmount}
                        onChange={(ev) => setMaxRewardAmount(ev.target.value)}
                      />
                    </label>
                  </>
                ) : (
                  <label className="grid gap-1.5 text-sm">
                    <span className="text-muted-foreground">Reward amount</span>
                    <Input
                      type="number"
                      step="any"
                      value={rewardAmount}
                      onChange={(ev) => setRewardAmount(ev.target.value)}
                      required
                    />
                  </label>
                )}
                <label className="grid gap-1.5 text-sm">
                  <span className="text-muted-foreground">Top-up threshold</span>
                  <Input
                    type="number"
                    step="any"
                    value={topupThreshold}
                    onChange={(ev) => setTopupThreshold(ev.target.value)}
                    required
                  />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="text-muted-foreground">Max claim per user</span>
                  <Input
                    type="number"
                    min={0}
                    step={1}
                    value={maxClaimPerUser}
                    onChange={(ev) => setMaxClaimPerUser(ev.target.value)}
                    required
                  />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="text-muted-foreground">Min obtain days</span>
                  <Input
                    type="number"
                    min={0}
                    step={1}
                    value={minObtainDays}
                    onChange={(ev) => setMinObtainDays(ev.target.value)}
                    required
                  />
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-3 border-t bg-transparent">
            <Button variant="outline" type="button" asChild>
              <Link href="/admin/campaigns">Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitting || dupLoading}>
              {submitting ? "Creating…" : "Create"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function AdminCreateCampaignPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl p-6 text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <AdminCreateCampaignPageInner />
    </Suspense>
  );
}
