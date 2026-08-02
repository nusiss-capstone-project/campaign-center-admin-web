import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ADMIN_HOME_PATH } from "@/lib/admin/rbac/access";

export default async function Home() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  redirect(ADMIN_HOME_PATH);
}
