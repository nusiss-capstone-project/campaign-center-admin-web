import { SHARED_MARKETS } from "@/lib/shared/markets";

export const USER_GROUP_OPERATORS = [
  "EQ",
  "NEQ",
  "GT",
  "GTE",
  "LT",
  "LTE",
] as const;

export type UserGroupOperator = (typeof USER_GROUP_OPERATORS)[number];

export type UserGroupFieldValueKind =
  | "datetime"
  | "market"
  | "kycStatus"
  | "number"
  | "boolean";

export type UserGroupFieldMeta = {
  field: string;
  label: string;
  valueKind: UserGroupFieldValueKind;
};

export const USER_GROUP_FIELDS: UserGroupFieldMeta[] = [
  { field: "registeredAt", label: "Registered At", valueKind: "datetime" },
  { field: "market", label: "Market", valueKind: "market" },
  { field: "kycStatus", label: "KYC Status", valueKind: "kycStatus" },
  {
    field: "totalFiatDepositUSD",
    label: "Total Fiat Deposit (USD)",
    valueKind: "number",
  },
  {
    field: "fiatDepositCount",
    label: "Fiat Deposit Count",
    valueKind: "number",
  },
  {
    field: "totalPurchaseAmountUSD",
    label: "Total Purchase Amount (USD)",
    valueKind: "number",
  },
  { field: "purchaseCount", label: "Purchase Count", valueKind: "number" },
  { field: "isRiskUser", label: "Is Risk User", valueKind: "boolean" },
];

export const USER_GROUP_FIELD_BY_KEY = Object.fromEntries(
  USER_GROUP_FIELDS.map((f) => [f.field, f]),
) as Record<string, UserGroupFieldMeta>;

export const KYC_STATUS_OPTIONS = ["PENDING", "PASSED"] as const;

export const MARKET_OPTIONS = SHARED_MARKETS;

export const USER_GROUP_STATUSES = ["DRAFT", "ACTIVE", "OFFLINE"] as const;

export type UserGroupStatus = (typeof USER_GROUP_STATUSES)[number];

export function isUserGroupStatus(value: string): value is UserGroupStatus {
  return (USER_GROUP_STATUSES as readonly string[]).includes(value);
}
