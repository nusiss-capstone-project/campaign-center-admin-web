/** Suggested markets from campaign-api v2 TD (manual entry + datalist). */
export const CAMPAIGN_MARKET_SUGGESTIONS = [
  "SG",
  "EEA",
  "US",
  "TR",
  "BR",
] as const;

export const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC" },
  { value: "Asia/Singapore", label: "Asia/Singapore" },
  { value: "Asia/Shanghai", label: "Asia/Shanghai" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo" },
  { value: "America/New_York", label: "America/New_York" },
  { value: "Europe/London", label: "Europe/London" },
  { value: "Europe/Berlin", label: "Europe/Berlin" },
] as const;
