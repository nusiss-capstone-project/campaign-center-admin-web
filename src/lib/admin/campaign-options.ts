/** @deprecated Prefer `SHARED_MARKETS` from `@/lib/shared/markets`. */
export { SHARED_MARKETS as CAMPAIGN_MARKET_SUGGESTIONS } from "@/lib/shared/markets";

export const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC" },
  { value: "Asia/Singapore", label: "Asia/Singapore" },
  { value: "Asia/Shanghai", label: "Asia/Shanghai" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo" },
  { value: "America/New_York", label: "America/New_York" },
  { value: "Europe/London", label: "Europe/London" },
  { value: "Europe/Berlin", label: "Europe/Berlin" },
] as const;
