"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

import {
  DENY_ALL_CAPABILITIES,
  type AdminCapabilities,
} from "@/lib/admin/rbac/capabilities";
import { canAccessAdminPath } from "@/lib/admin/rbac/access";
import { capabilitiesForRole } from "@/lib/admin/rbac/role-matrix";
import { adminRoleLabel, type AdminRole } from "@/lib/admin/rbac/roles";
import {
  fetchCurrentUser,
  type CurrentUser,
} from "@/lib/admin/identity/current-user";

type AdminAccessValue = {
  user: CurrentUser | null;
  role: AdminRole | null;
  roleLabel: string;
  caps: AdminCapabilities;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

const AdminAccessContext = createContext<AdminAccessValue | null>(null);

export function AdminAccessProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isLoaded) return;

      // Signed out: clear state only — do not navigate (Clerk handles afterSignOutUrl).
      if (!isSignedIn) {
        if (!cancelled) {
          setUser(null);
          setError(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const next = await fetchCurrentUser();
        if (cancelled) return;
        setUser(next);
        if (!next.role) {
          router.replace("/forbidden");
        }
      } catch (e) {
        if (cancelled) return;
        setUser(null);
        setError(e instanceof Error ? e.message : "Failed to load current user");
        router.replace("/forbidden");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, refreshKey, router]);

  useEffect(() => {
    if (!isSignedIn || loading || !user?.role) return;
    if (!canAccessAdminPath(user.role, pathname)) {
      router.replace("/admin");
    }
  }, [isSignedIn, loading, user, pathname, router]);

  const value = useMemo<AdminAccessValue>(() => {
    const caps = capabilitiesForRole(user?.roleRaw ?? user?.role);
    return {
      user,
      role: user?.role ?? null,
      roleLabel: adminRoleLabel(user?.role ?? null),
      caps,
      loading,
      error,
      refresh: () => setRefreshKey((k) => k + 1),
    };
  }, [user, loading, error]);

  return (
    <AdminAccessContext.Provider value={value}>
      {children}
    </AdminAccessContext.Provider>
  );
}

export function useAdminAccess(): AdminAccessValue {
  const ctx = useContext(AdminAccessContext);
  if (!ctx) {
    return {
      user: null,
      role: null,
      roleLabel: adminRoleLabel(null),
      caps: DENY_ALL_CAPABILITIES,
      loading: false,
      error: null,
      refresh: () => undefined,
    };
  }
  return ctx;
}

export function useAdminCapabilities(): AdminCapabilities {
  return useAdminAccess().caps;
}
