"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { UserGroupRuleForm } from "@/components/admin/user-group-rule-form";
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
  getUserGroup,
  updateUserGroup,
  userGroupApiErrorMessage,
} from "@/lib/admin/user-group-fetch";
import {
  emptyUserGroupFormValues,
  parseUserGroupToFormValues,
  toUserGroupRequest,
} from "@/lib/admin/user-group-form-values";

export default function AdminEditUserGroupPage() {
  const params = useParams();
  const router = useRouter();
  const userGroupId = parseRouteId(params?.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState(() => emptyUserGroupFormValues());

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
        if (data.status !== "DRAFT") {
          router.replace(`/admin/user-groups/${userGroupId}`);
          return;
        }
        setValues(parseUserGroupToFormValues(data));
      } catch (e) {
        if (cancelled) return;
        setError(userGroupApiErrorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [userGroupId, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidRouteId(userGroupId)) return;
    setError(null);
    setSaving(true);
    try {
      const body = toUserGroupRequest(values);
      await updateUserGroup(userGroupId, body);
      router.push(`/admin/user-groups/${userGroupId}`);
    } catch (err) {
      setError(userGroupApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <Button
        variant="outline"
        asChild
        className="w-fit border-white/10 bg-zinc-900/50"
      >
        <Link href={`/admin/user-groups/${userGroupId}`}>← Details</Link>
      </Button>

      <Card className="border-white/10 bg-zinc-900/40 text-zinc-100 ring-white/10">
        <CardHeader>
          <CardTitle className="text-white">Edit user group</CardTitle>
          <CardDescription className="text-zinc-500">
            Only DRAFT groups can be updated.
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="flex flex-col gap-4">
            {error ? (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            ) : null}
            {loading ? (
              <p className="text-sm text-zinc-500">Loading…</p>
            ) : (
              <UserGroupRuleForm values={values} onChange={setValues} />
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-3 border-t border-white/10 bg-transparent">
            <Button
              variant="outline"
              type="button"
              asChild
              className="border-white/10"
            >
              <Link href={`/admin/user-groups/${userGroupId}`}>Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={loading || saving}
              className="border-0 bg-white text-black hover:bg-zinc-200"
            >
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
