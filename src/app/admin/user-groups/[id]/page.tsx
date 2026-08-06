"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAdminCapabilities } from "@/components/admin/admin-access-provider";
import { ConfirmActionDialog } from "@/components/admin/confirm-action-dialog";
import { UserGroupRuleForm } from "@/components/admin/user-group-rule-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isValidRouteId, parseRouteId } from "@/lib/admin/parse-route-id";
import {
  estimateUserGroupSize,
  getUserGroup,
  offlineUserGroup,
  publishUserGroup,
  userGroupApiErrorMessage,
} from "@/lib/admin/user-group-fetch";
import {
  formatConditionValueForDisplay,
  parseUserGroupToFormValues,
} from "@/lib/admin/user-group-form-values";
import { USER_GROUP_FIELD_BY_KEY } from "@/lib/admin/user-group-fields";
import { userGroupStatusLabel } from "@/lib/admin/user-group-row";
import type { data_UserGroupCountVO } from "@/lib/usergroup-api/models/data_UserGroupCountVO";
import type { data_UserGroupVO } from "@/lib/usergroup-api/models/data_UserGroupVO";

export default function AdminUserGroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caps = useAdminCapabilities();
  const userGroupId = parseRouteId(params?.id);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [group, setGroup] = useState<data_UserGroupVO | null>(null);
  const [count, setCount] = useState<data_UserGroupCountVO | null>(null);
  const [counting, setCounting] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [offlineOpen, setOfflineOpen] = useState(false);
  const [actionSubmitting, setActionSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!isValidRouteId(userGroupId)) {
      setLoading(false);
      setError("Invalid user group id");
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserGroup(userGroupId);
        if (cancelled) return;
        setGroup(data);
      } catch (e) {
        if (cancelled) return;
        setError(userGroupApiErrorMessage(e));
        setGroup(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [userGroupId]);

  const status = group?.status ?? "";
  const isDraft = status === "DRAFT";
  const isActive = status === "ACTIVE";
  const formValues = parseUserGroupToFormValues(group);

  async function onEstimate() {
    if (!isValidRouteId(userGroupId)) return;
    setCounting(true);
    setError(null);
    setNotice(null);
    try {
      const result = await estimateUserGroupSize(userGroupId);
      setCount(result);
      setNotice("Estimated size updated.");
    } catch (e) {
      setError(userGroupApiErrorMessage(e));
    } finally {
      setCounting(false);
    }
  }

  async function onPublish() {
    if (!isValidRouteId(userGroupId)) return;
    setActionSubmitting(true);
    setActionError(null);
    try {
      const result = await publishUserGroup(userGroupId);
      setGroup((prev) =>
        prev
          ? {
              ...prev,
              status: result.status ?? "ACTIVE",
              updatedAt: result.updatedAt ?? prev.updatedAt,
            }
          : prev,
      );
      setPublishOpen(false);
      setNotice("User group published.");
    } catch (e) {
      setActionError(userGroupApiErrorMessage(e));
    } finally {
      setActionSubmitting(false);
    }
  }

  async function onOffline() {
    if (!isValidRouteId(userGroupId)) return;
    setActionSubmitting(true);
    setActionError(null);
    try {
      const result = await offlineUserGroup(userGroupId);
      setGroup((prev) =>
        prev
          ? {
              ...prev,
              status: result.status ?? "OFFLINE",
              updatedAt: result.updatedAt ?? prev.updatedAt,
            }
          : prev,
      );
      setOfflineOpen(false);
      setNotice("User group taken offline.");
    } catch (e) {
      setActionError(userGroupApiErrorMessage(e));
    } finally {
      setActionSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          asChild
          className="border-white/10 bg-zinc-900/50"
        >
          <Link href="/admin/user-groups">← User groups</Link>
        </Button>
        <div className="flex flex-wrap gap-2">
          {isDraft && caps.canEditUserGroup ? (
            <Button
              asChild
              className="border-0 bg-white text-black hover:bg-zinc-200"
            >
              <Link href={`/admin/user-groups/${userGroupId}/edit`}>Edit</Link>
            </Button>
          ) : null}
          {isDraft && caps.canPublishUserGroup ? (
            <Button
              type="button"
              variant="outline"
              className="border-white/10 bg-zinc-900/50"
              onClick={() => {
                setActionError(null);
                setPublishOpen(true);
              }}
            >
              Publish
            </Button>
          ) : null}
          {isActive && caps.canOfflineUserGroup ? (
            <Button
              type="button"
              variant="outline"
              className="border-amber-500/30 bg-amber-500/10 text-amber-100"
              onClick={() => {
                setActionError(null);
                setOfflineOpen(true);
              }}
            >
              Offline
            </Button>
          ) : null}
        </div>
      </div>

      <Card className="border-white/10 bg-zinc-900/40 text-zinc-100 ring-white/10">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="text-white">
              {loading ? "Loading…" : group?.name || "User group"}
            </CardTitle>
            {status ? (
              <Badge
                variant="outline"
                className="border-white/10 text-zinc-300"
              >
                {userGroupStatusLabel(status)}
              </Badge>
            ) : null}
          </div>
          <CardDescription className="text-zinc-500">
            ID {isValidRouteId(userGroupId) ? userGroupId : "—"}
            {group?.updatedAt
              ? ` · Updated ${new Date(group.updatedAt).toLocaleString()}`
              : null}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error ? (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="text-sm text-emerald-300" role="status">
              {notice}
            </p>
          ) : null}
          {loading ? (
            <p className="text-sm text-zinc-500">Loading…</p>
          ) : group ? (
            <>
              <UserGroupRuleForm values={formValues} readOnly />
              <div className="rounded-lg border border-white/10 bg-zinc-950/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      Estimated size
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {count
                        ? `${count.count ?? 0} users · computed ${
                            count.computedAt
                              ? new Date(count.computedAt).toLocaleString()
                              : "—"
                          }`
                        : "Not estimated yet."}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/10 bg-zinc-900/50"
                    disabled={counting}
                    onClick={() => void onEstimate()}
                  >
                    {counting ? "Estimating…" : "Estimate size"}
                  </Button>
                </div>
              </div>
              <div className="text-xs text-zinc-500">
                <p className="mb-1 font-medium text-zinc-400">Rule summary</p>
                <ul className="list-inside list-disc space-y-1">
                  <li>Logic: {group.ruleConfig?.logic ?? "—"}</li>
                  {(group.ruleConfig?.conditions ?? []).map((c, i) => (
                    <li key={`sum-${i}`}>
                      {USER_GROUP_FIELD_BY_KEY[c.field]?.label ?? c.field}{" "}
                      {c.operator}{" "}
                      {formatConditionValueForDisplay(c.field, c.value)}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}
        </CardContent>
        <CardFooter className="border-t border-white/10 bg-transparent">
          <Button
            type="button"
            variant="outline"
            className="border-white/10"
            onClick={() => router.refresh()}
          >
            Refresh
          </Button>
        </CardFooter>
      </Card>

      <ConfirmActionDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        title="Publish user group?"
        description="This will move the group from DRAFT to ACTIVE. Only ACTIVE groups can be matched."
        confirmLabel="Publish"
        submitting={actionSubmitting}
        error={actionError}
        onConfirm={onPublish}
      />
      <ConfirmActionDialog
        open={offlineOpen}
        onOpenChange={setOfflineOpen}
        title="Take user group offline?"
        description="This will move the group from ACTIVE to OFFLINE. It will no longer match users."
        confirmLabel="Offline"
        confirmVariant="destructive"
        submitting={actionSubmitting}
        error={actionError}
        onConfirm={onOffline}
      />
    </div>
  );
}
