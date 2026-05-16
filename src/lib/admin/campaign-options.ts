export const CAMPAIGN_TYPE_OPTIONS = [
  { value: "TOPUP_REWARD", label: "Top-up Reward" },
] as const;

export const CAMPAIGN_MARKET_OPTIONS = [
  { value: "GLOBAL", label: "Global" },
  { value: "US", label: "United States" },
  { value: "EU", label: "Europe" },
  { value: "SEA", label: "Southeast Asia" },
  { value: "HK", label: "Hong Kong" },
  { value: "JP", label: "Japan" },
  { value: "SG", label: "Singapore" },
] as const;

export const USER_SEGMENT_OPTIONS = [
  { value: "NEW_USER", label: "New User" },
  { value: "VIP_USER", label: "VIP User" },
  { value: "INACTIVE_USER", label: "Inactive User" },
  { value: "HIGH_NET_WORTH", label: "High Net Worth" },
  { value: "FIRST_TIME_DEPOSITOR", label: "First-time Depositor" },
  { value: "ALL_USERS", label: "All Users" },
] as const;

export const REWARD_TYPE_OPTIONS = [
  { value: "BONUS_CREDIT", label: "Bonus Credit" },
  { value: "TOKEN_BONUS", label: "Token Bonus" },
  { value: "TRADING_FEE_REBATE", label: "Trading Fee Rebate" },
  { value: "VOUCHER", label: "Voucher" },
  { value: "MYSTERY_BOX", label: "Mystery Box" },
  { value: "POINTS", label: "Points" },
] as const;
