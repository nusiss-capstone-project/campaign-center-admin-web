"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
import {
  createUserGroup,
  userGroupApiErrorMessage,
} from "@/lib/admin/user-group-fetch";
import {
  emptyUserGroupFormValues,
  toUserGroupRequest,
} from "@/lib/admin/user-group-form-values";

export default function AdminCreateUserGroupPage() {
  const router = useRouter();
  const [values, setValues] = useState(() => emptyUserGroupFormValues());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const body = toUserGroupRequest(values);
      const created = await createUserGroup(body);
      const id = created.id;
      if (id == null) {
        router.push("/admin/user-groups");
        return;
      }
      router.push(`/admin/user-groups/${id}`);
    } catch (err) {
      setError(userGroupApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <Button
        variant="outline"
        asChild
        className="w-fit border-white/10 bg-zinc-900/50"
      >
        <Link href="/admin/user-groups">← User groups</Link>
      </Button>

      <Card className="border-white/10 bg-zinc-900/40 text-zinc-100 ring-white/10">
        <CardHeader>
          <CardTitle className="text-white">Create user group</CardTitle>
          <CardDescription className="text-zinc-500">
            Save a draft rule group. Publish from the detail page when ready.
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="flex flex-col gap-4">
            {error ? (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            ) : null}
            <UserGroupRuleForm values={values} onChange={setValues} />
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-3 border-t border-white/10 bg-transparent">
            <Button
              variant="outline"
              type="button"
              asChild
              className="border-white/10"
            >
              <Link href="/admin/user-groups">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="border-0 bg-white text-black hover:bg-zinc-200"
            >
              {submitting ? "Creating…" : "Create"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
