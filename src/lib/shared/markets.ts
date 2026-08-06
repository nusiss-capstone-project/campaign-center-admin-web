/**
 * Shared market codes aligned with identity-mservice
 * (`server/http/data/const.go`).
 */
export const SHARED_MARKETS = [
  "GLOBAL",
  "SG",
  "HK",
  "US",
  "EEA",
  "UK",
  "UAE",
  "AU",
  "JP",
  "KR",
  "TR",
  "BR",
  "LATAM",
  "SEA",
] as const;

export type SharedMarket = (typeof SHARED_MARKETS)[number];
