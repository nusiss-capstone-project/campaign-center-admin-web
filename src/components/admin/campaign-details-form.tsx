"use client";

import type { CampaignFormValues } from "@/lib/admin/campaign-form-values";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CAMPAIGN_MARKET_OPTIONS,
  CAMPAIGN_TYPE_OPTIONS,
  REWARD_TYPE_OPTIONS,
  USER_SEGMENT_OPTIONS,
} from "@/lib/admin/campaign-options";

type CampaignDetailsFormProps = {
  values: CampaignFormValues;
  readOnly: boolean;
  onChange?: (next: CampaignFormValues) => void;
  statusLabel?: string | null;
};

function patch(
  prev: CampaignFormValues,
  patch: Partial<CampaignFormValues>,
): CampaignFormValues {
  return { ...prev, ...patch };
}

export function CampaignDetailsForm({
  values,
  readOnly,
  onChange,
  statusLabel,
}: CampaignDetailsFormProps) {
  const ro = readOnly;
  const set = (p: Partial<CampaignFormValues>) => {
    if (!readOnly && onChange) onChange(patch(values, p));
  };
  const isPercentageReward = values.rewardMode === "PERCENTAGE";

  return (
    <div className="flex flex-col gap-4">
      {statusLabel != null && statusLabel !== "" ? (
        <p className="text-sm text-zinc-400">
          Status: <span className="text-zinc-100">{statusLabel}</span>
        </p>
      ) : null}
      <label className="grid gap-1.5 text-sm">
        <span className="text-zinc-400">Name</span>
        <Input
          value={values.name}
          onChange={(e) => set({ name: e.target.value })}
          disabled={ro}
          readOnly={ro}
          required={!ro}
          className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="text-zinc-400">Type</span>
        <Select
          value={values.type}
          disabled={ro}
          onValueChange={(type) => set({ type })}
        >
          <SelectTrigger className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70">
            <SelectValue placeholder="Select campaign type" />
          </SelectTrigger>
          <SelectContent>
            {CAMPAIGN_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="text-zinc-400">Target market</span>
        <Select
          value={values.targetMarket}
          disabled={ro}
          onValueChange={(targetMarket) => set({ targetMarket })}
        >
          <SelectTrigger className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70">
            <SelectValue placeholder="Select target market" />
          </SelectTrigger>
          <SelectContent>
            {CAMPAIGN_MARKET_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="text-zinc-400">Target user segment</span>
        <Select
          value={values.targetUserSegment}
          disabled={ro}
          onValueChange={(targetUserSegment) => set({ targetUserSegment })}
        >
          <SelectTrigger className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70">
            <SelectValue placeholder="Select user segment" />
          </SelectTrigger>
          <SelectContent>
            {USER_SEGMENT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="text-zinc-400">Landing page ID (optional)</span>
        <Input
          inputMode="numeric"
          value={values.landingPageId}
          onChange={(e) => set({ landingPageId: e.target.value })}
          disabled={ro}
          readOnly={ro}
          className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          <span className="text-zinc-400">Registration start</span>
          <Input
            type="datetime-local"
            value={values.registrationStartTime}
            onChange={(e) => set({ registrationStartTime: e.target.value })}
            disabled={ro}
            required={!ro}
            className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-zinc-400">Registration end</span>
          <Input
            type="datetime-local"
            value={values.registrationEndTime}
            onChange={(e) => set({ registrationEndTime: e.target.value })}
            disabled={ro}
            required={!ro}
            className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-zinc-400">Campaign start</span>
          <Input
            type="datetime-local"
            value={values.campaignStartTime}
            onChange={(e) => set({ campaignStartTime: e.target.value })}
            disabled={ro}
            required={!ro}
            className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-zinc-400">Campaign end</span>
          <Input
            type="datetime-local"
            value={values.campaignEndTime}
            onChange={(e) => set({ campaignEndTime: e.target.value })}
            disabled={ro}
            required={!ro}
            className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
          />
        </label>
      </div>
      <div className="border-t border-white/10 pt-4">
        <p className="mb-3 text-sm font-medium text-zinc-200">Reward rules</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">Reward type</span>
            <Select
              value={values.rewardType}
              disabled={ro}
              onValueChange={(rewardType) => set({ rewardType })}
            >
              <SelectTrigger className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70">
                <SelectValue placeholder="Select reward type" />
              </SelectTrigger>
              <SelectContent>
                {REWARD_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">Reward mode</span>
            <Select
              value={values.rewardMode}
              onValueChange={(rewardMode) => set({ rewardMode })}
              disabled={ro}
            >
              <SelectTrigger className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70">
                <SelectValue placeholder="Select reward mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIXED_AMOUNT">Fixed amount</SelectItem>
                <SelectItem value="PERCENTAGE">Percentage</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">Reward currency</span>
            <Input
              value={values.rewardCurrency}
              onChange={(e) => set({ rewardCurrency: e.target.value })}
              disabled={ro}
              readOnly={ro}
              className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
            />
          </label>
          {isPercentageReward ? (
            <>
              <label className="grid gap-1.5 text-sm">
                <span className="text-zinc-400">Reward percentage</span>
                <Input
                  type="number"
                  step="any"
                  value={values.rewardPercentage}
                  onChange={(e) => set({ rewardPercentage: e.target.value })}
                  disabled={ro}
                  required={!ro}
                  className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-zinc-400">Max reward amount</span>
                <Input
                  type="number"
                  step="any"
                  value={values.maxRewardAmount}
                  onChange={(e) => set({ maxRewardAmount: e.target.value })}
                  disabled={ro}
                  className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
                />
              </label>
            </>
          ) : (
            <label className="grid gap-1.5 text-sm">
              <span className="text-zinc-400">Reward amount</span>
              <Input
                type="number"
                step="any"
                value={values.rewardAmount}
                onChange={(e) => set({ rewardAmount: e.target.value })}
                disabled={ro}
                required={!ro}
                className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
              />
            </label>
          )}
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">Top-up threshold</span>
            <Input
              type="number"
              step="any"
              value={values.topupThreshold}
              onChange={(e) => set({ topupThreshold: e.target.value })}
              disabled={ro}
              required={!ro}
              className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">Max claim per user</span>
            <Input
              type="number"
              min={0}
              step={1}
              value={values.maxClaimPerUser}
              onChange={(e) => set({ maxClaimPerUser: e.target.value })}
              disabled={ro}
              required={!ro}
              className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">Min obtain days</span>
            <Input
              type="number"
              min={0}
              step={1}
              value={values.minObtainDays}
              onChange={(e) => set({ minObtainDays: e.target.value })}
              disabled={ro}
              required={!ro}
              className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
