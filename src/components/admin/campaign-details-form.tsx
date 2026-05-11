"use client";

import type { CampaignFormValues } from "@/lib/admin/campaign-form-values";
import { Input } from "@/components/ui/input";

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
        <Input
          value={values.type}
          onChange={(e) => set({ type: e.target.value })}
          disabled={ro}
          readOnly={ro}
          required={!ro}
          className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="text-zinc-400">Target market</span>
        <Input
          value={values.targetMarket}
          onChange={(e) => set({ targetMarket: e.target.value })}
          disabled={ro}
          readOnly={ro}
          required={!ro}
          className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="text-zinc-400">Target user segment</span>
        <Input
          value={values.targetUserSegment}
          onChange={(e) => set({ targetUserSegment: e.target.value })}
          disabled={ro}
          readOnly={ro}
          required={!ro}
          className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
        />
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
            <Input
              value={values.rewardType}
              onChange={(e) => set({ rewardType: e.target.value })}
              disabled={ro}
              readOnly={ro}
              required={!ro}
              className="border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70"
            />
          </label>
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
        </div>
      </div>
    </div>
  );
}
