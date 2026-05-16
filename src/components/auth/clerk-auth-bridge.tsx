"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

import { OpenAPI } from "@/lib/api/core/OpenAPI";
import {
  resetClerkTokenGetter,
  setClerkTokenGetter,
} from "@/lib/auth/clerk-token";

export function ClerkAuthBridge() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) {
      resetClerkTokenGetter();
      OpenAPI.TOKEN = undefined;
      return;
    }

    if (!isSignedIn) {
      OpenAPI.TOKEN = undefined;
      setClerkTokenGetter(null);
      return;
    }

    const getter = async () => (await getToken()) ?? "";
    OpenAPI.TOKEN = getter;
    setClerkTokenGetter(getter);

    return () => {
      OpenAPI.TOKEN = undefined;
      setClerkTokenGetter(null);
    };
  }, [getToken, isLoaded, isSignedIn]);

  return null;
}
