"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { IssueRecordsTable } from "@/components/admin/campaign-performance/issue-records-table";
import { ParticipantsUsersTable } from "@/components/admin/campaign-performance/participants-users-table";
import { UserTaskProgressTable } from "@/components/admin/campaign-performance/user-task-progress-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchCampaignParticipantMeta,
  fetchCampaignParticipants,
  type CampaignParticipantMeta,
} from "@/lib/admin/campaign-performance-api";
import { apiErrorMessage } from "@/lib/admin/campaign-performance-utils";
import { fetchUserTaskProgress } from "@/lib/admin/task-admin-fetch";
import type { UserTaskProgressVO } from "@/lib/admin/task-types";
import { fetchIssueRecordsByProjectUser } from "@/lib/admin/reward/reward-api";
import type { data_AdminParticipantVO } from "@/lib/api/models/data_AdminParticipant";
import type { data_IssueRecordVO } from "@/lib/reward-api/models/data_IssueRecordVO";

type InnerTab = "participants" | "tasks" | "rewards";

type CampaignParticipationsTabProps = {
  campaignId: number;
};

function parseUserId(raw: string): number | null {
  const trim = raw.trim();
  if (!trim) return null;
  const n = Number(trim);
  return Number.isFinite(n) ? n : null;
}

export function CampaignParticipationsTab({
  campaignId,
}: Readonly<CampaignParticipationsTabProps>) {
  const [innerTab, setInnerTab] = useState<InnerTab>("participants");

  const [participants, setParticipants] = useState<data_AdminParticipantVO[]>(
    [],
  );
  const [meta, setMeta] = useState<CampaignParticipantMeta>({
    projectId: null,
    taskGroupId: null,
  });
  const [participantsLoading, setParticipantsLoading] = useState(true);
  const [participantsError, setParticipantsError] = useState<string | null>(
    null,
  );
  const [participantFilter, setParticipantFilter] = useState("");

  const [taskUserIdInput, setTaskUserIdInput] = useState("");
  const [taskRows, setTaskRows] = useState<UserTaskProgressVO[]>([]);
  const [taskLoading, setTaskLoading] = useState(false);
  const [taskError, setTaskError] = useState<string | null>(null);
  const [taskQueried, setTaskQueried] = useState(false);

  const [rewardUserIdInput, setRewardUserIdInput] = useState("");
  const [rewardRows, setRewardRows] = useState<data_IssueRecordVO[]>([]);
  const [rewardLoading, setRewardLoading] = useState(false);
  const [rewardError, setRewardError] = useState<string | null>(null);
  const [rewardQueried, setRewardQueried] = useState(false);

  const loadParticipants = useCallback(async () => {
    setParticipantsLoading(true);
    setParticipantsError(null);
    try {
      const result = await fetchCampaignParticipants(campaignId);
      setParticipants(result.participants);
      let nextMeta = result.meta;
      if (nextMeta.projectId == null || nextMeta.taskGroupId == null) {
        try {
          const fallback = await fetchCampaignParticipantMeta(campaignId);
          nextMeta = {
            projectId: nextMeta.projectId ?? fallback.projectId,
            taskGroupId: nextMeta.taskGroupId ?? fallback.taskGroupId,
          };
        } catch {
          // Keep list meta; Tasks/Rewards will surface binding errors on load.
        }
      }
      setMeta(nextMeta);
    } catch (e) {
      setParticipants([]);
      setParticipantsError(apiErrorMessage(e));
    } finally {
      setParticipantsLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    void loadParticipants();
  }, [loadParticipants]);

  const filteredParticipants = useMemo(() => {
    const q = participantFilter.trim();
    if (!q) return participants;
    return participants.filter((p) =>
      String(p.user_id ?? "").includes(q),
    );
  }, [participantFilter, participants]);

  async function ensureMeta(): Promise<CampaignParticipantMeta> {
    if (meta.projectId != null && meta.taskGroupId != null) return meta;
    const fallback = await fetchCampaignParticipantMeta(campaignId);
    const merged = {
      projectId: meta.projectId ?? fallback.projectId,
      taskGroupId: meta.taskGroupId ?? fallback.taskGroupId,
    };
    setMeta(merged);
    return merged;
  }

  async function handleLoadTasks() {
    const userId = parseUserId(taskUserIdInput);
    if (userId == null) {
      setTaskError("Enter a valid User ID.");
      setTaskRows([]);
      setTaskQueried(false);
      return;
    }
    setTaskLoading(true);
    setTaskError(null);
    setTaskQueried(true);
    try {
      const current = await ensureMeta();
      if (current.taskGroupId == null) {
        setTaskRows([]);
        setTaskError("Campaign is not bound to a task group.");
        return;
      }
      const rows = await fetchUserTaskProgress(current.taskGroupId, userId);
      setTaskRows(rows);
    } catch (e) {
      setTaskRows([]);
      setTaskError(apiErrorMessage(e));
    } finally {
      setTaskLoading(false);
    }
  }

  async function handleLoadRewards() {
    const userId = parseUserId(rewardUserIdInput);
    if (userId == null) {
      setRewardError("Enter a valid User ID.");
      setRewardRows([]);
      setRewardQueried(false);
      return;
    }
    setRewardLoading(true);
    setRewardError(null);
    setRewardQueried(true);
    try {
      const current = await ensureMeta();
      if (current.projectId == null) {
        setRewardRows([]);
        setRewardError("Campaign is not bound to a reward project.");
        return;
      }
      const rows = await fetchIssueRecordsByProjectUser(
        current.projectId,
        userId,
      );
      setRewardRows(rows);
    } catch (e) {
      setRewardRows([]);
      setRewardError(apiErrorMessage(e));
    } finally {
      setRewardLoading(false);
    }
  }

  function renderParticipantsBody() {
    if (participantsLoading) {
      return <p className="text-sm text-zinc-500">Loading participants…</p>;
    }
    if (filteredParticipants.length === 0) {
      return (
        <p className="text-sm text-zinc-500">No participants found.</p>
      );
    }
    return <ParticipantsUsersTable rows={filteredParticipants} />;
  }

  function renderTasksBody() {
    if (!taskQueried && !taskLoading) {
      return (
        <p className="text-sm text-zinc-500">
          Enter a User ID and click Load to view task progress.
        </p>
      );
    }
    if (taskLoading) {
      return <p className="text-sm text-zinc-500">Loading task progress…</p>;
    }
    if (taskRows.length === 0) {
      return <p className="text-sm text-zinc-500">No task progress found.</p>;
    }
    return <UserTaskProgressTable rows={taskRows} />;
  }

  function renderRewardsBody() {
    if (!rewardQueried && !rewardLoading) {
      return (
        <p className="text-sm text-zinc-500">
          Enter a User ID and click Load to view issue records.
        </p>
      );
    }
    if (rewardLoading) {
      return <p className="text-sm text-zinc-500">Loading issue records…</p>;
    }
    if (rewardRows.length === 0) {
      return <p className="text-sm text-zinc-500">No issue records found.</p>;
    }
    return <IssueRecordsTable rows={rewardRows} />;
  }

  return (
    <Tabs
      value={innerTab}
      onValueChange={(v) => setInnerTab(v as InnerTab)}
      className="gap-6"
    >
      <TabsList
        variant="default"
        className="h-auto gap-2 bg-transparent p-0 text-zinc-500"
      >
        <TabsTrigger
          value="participants"
          className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 data-active:bg-zinc-800 data-active:text-white data-active:shadow-none"
        >
          Participants
        </TabsTrigger>
        <TabsTrigger
          value="tasks"
          className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 data-active:bg-zinc-800 data-active:text-white data-active:shadow-none"
        >
          Tasks
        </TabsTrigger>
        <TabsTrigger
          value="rewards"
          className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 data-active:bg-zinc-800 data-active:text-white data-active:shadow-none"
        >
          Rewards
        </TabsTrigger>
      </TabsList>

      <TabsContent value="participants" className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-white/10 bg-zinc-900/30 p-4">
          <label className="grid gap-1.5 text-sm">
            <span className="text-xs text-zinc-500">User ID filter</span>
            <Input
              inputMode="numeric"
              placeholder="Filter by user ID"
              value={participantFilter}
              onChange={(e) => setParticipantFilter(e.target.value)}
              className="h-9 w-44 border-white/10 bg-zinc-900/80"
            />
          </label>
        </div>
        {participantsError ? (
          <p
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            role="alert"
          >
            {participantsError}
          </p>
        ) : null}
        {renderParticipantsBody()}
      </TabsContent>

      <TabsContent value="tasks" className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-white/10 bg-zinc-900/30 p-4">
          <label className="grid gap-1.5 text-sm">
            <span className="text-xs text-zinc-500">User ID</span>
            <Input
              inputMode="numeric"
              placeholder="e.g. 10001"
              value={taskUserIdInput}
              onChange={(e) => setTaskUserIdInput(e.target.value)}
              className="h-9 w-44 border-white/10 bg-zinc-900/80"
            />
          </label>
          <Button
            type="button"
            className="border-0 bg-white text-black hover:bg-zinc-200"
            onClick={() => void handleLoadTasks()}
            disabled={taskLoading}
          >
            Load
          </Button>
        </div>
        {taskError ? (
          <p
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            role="alert"
          >
            {taskError}
          </p>
        ) : null}
        {renderTasksBody()}
      </TabsContent>

      <TabsContent value="rewards" className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-white/10 bg-zinc-900/30 p-4">
          <label className="grid gap-1.5 text-sm">
            <span className="text-xs text-zinc-500">User ID</span>
            <Input
              inputMode="numeric"
              placeholder="e.g. 10001"
              value={rewardUserIdInput}
              onChange={(e) => setRewardUserIdInput(e.target.value)}
              className="h-9 w-44 border-white/10 bg-zinc-900/80"
            />
          </label>
          <Button
            type="button"
            className="border-0 bg-white text-black hover:bg-zinc-200"
            onClick={() => void handleLoadRewards()}
            disabled={rewardLoading}
          >
            Load
          </Button>
        </div>
        {rewardError ? (
          <p
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            role="alert"
          >
            {rewardError}
          </p>
        ) : null}
        {renderRewardsBody()}
      </TabsContent>
    </Tabs>
  );
}
