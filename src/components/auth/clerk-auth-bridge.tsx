"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { OpenAPI } from "@/lib/api/core/OpenAPI";
import { getCampaignCenterApiV1Base } from "@/lib/api/openapi-base-url";
import { OpenAPI as RewardOpenAPI } from "@/lib/reward-api/core/OpenAPI";
import { getRewardMsApiBase } from "@/lib/reward-api/reward-api-base-url";
import { getPublicApiBaseUrl } from "@/lib/admin/campaign-admin-api";
import {
  isTrustedApiUrl,
  resetClerkTokenGetter,
  setClerkTokenGetter,
} from "@/lib/auth/clerk-token";

export function ClerkAuthBridge({ children }: { children: ReactNode }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);

    if (!isLoaded) {
      resetClerkTokenGetter();
      OpenAPI.TOKEN = undefined;
      RewardOpenAPI.TOKEN = undefined;
      return;
    }

    OpenAPI.BASE = getCampaignCenterApiV1Base();
    RewardOpenAPI.BASE = getRewardMsApiBase();
    const apiBaseConfigured = getPublicApiBaseUrl() !== "";

    if (!isSignedIn) {
      setClerkTokenGetter(null);
      OpenAPI.TOKEN = undefined;
      RewardOpenAPI.TOKEN = undefined;
      setReady(true);
      return;
    }

    const getter = async () => (await getToken()) ?? "";
    const openApiTokenGetter = async () => {
      if (!isTrustedApiUrl(OpenAPI.BASE)) return "";
      return getter();
    };
    const rewardOpenApiTokenGetter = async () => {
      if (!isTrustedApiUrl(RewardOpenAPI.BASE)) return "";
      return getter();
    };
    setClerkTokenGetter(getter);
    OpenAPI.TOKEN = apiBaseConfigured ? openApiTokenGetter : undefined;
    RewardOpenAPI.TOKEN = apiBaseConfigured ? rewardOpenApiTokenGetter : undefined;
    setReady(true);

    return () => {
      setClerkTokenGetter(null);
      OpenAPI.TOKEN = undefined;
      RewardOpenAPI.TOKEN = undefined;
    };
  }, [getToken, isLoaded, isSignedIn]);

  if (!ready) return null;
  return <>{children}</>;
}
