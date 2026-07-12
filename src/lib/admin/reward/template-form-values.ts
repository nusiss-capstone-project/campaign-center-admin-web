import type { data_TemplateConfigBody } from "@/lib/reward-api/models/data_TemplateConfigBody";
import type { data_TemplateVOSwagger } from "@/lib/reward-api/models/data_TemplateVOSwagger";
import {
  formatMoneyDecimal,
  hasAtMostDecimalPlaces,
} from "@/lib/admin/reward/reward-utils";

export type TemplateType = "FIXED" | "DYNAMIC";

export type FixTemplateConfig = {
  amount: string;
};

export type DynamicTemplateConfig = {
  base_metric: string;
  rate: string;
  cap: string;
};

export type TemplateConfigFormValues = FixTemplateConfig | DynamicTemplateConfig;

export type TemplateFormValues = {
  type: TemplateType;
  unit: string;
  voucherType: string;
  config: TemplateConfigFormValues;
};

export type TemplateCreatePayload = {
  type: TemplateType;
  unit: string;
  voucher_type: string;
  config: data_TemplateConfigBody;
};

export type TemplateUpdatePayload = {
  config: data_TemplateConfigBody;
};

const NUMERIC_STRING_PATTERN = /^-?\d+(\.\d+)?$/;

export function isNumericString(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return NUMERIC_STRING_PATTERN.test(trimmed);
}

export function emptyFixConfig(): FixTemplateConfig {
  return { amount: "" };
}

export function emptyDynamicConfig(): DynamicTemplateConfig {
  return { base_metric: "", rate: "", cap: "" };
}

export function emptyTemplateFormValues(
  type: TemplateType = "FIXED",
): TemplateFormValues {
  return {
    type,
    unit: "",
    voucherType: "",
    config: type === "FIXED" ? emptyFixConfig() : emptyDynamicConfig(),
  };
}

const MONEY_DECIMALS = 2;

function normalizeMoneyField(raw: string): string {
  return formatMoneyDecimal(raw, MONEY_DECIMALS);
}

function pickConfigString(
  record: Record<string, unknown>,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value = record[key];
    if (value == null || value === "") continue;
    return String(value);
  }
  return "";
}

function configRecordFromUnknown(
  config: unknown,
  type: TemplateType,
): TemplateConfigFormValues {
  const record =
    config != null && typeof config === "object" && !Array.isArray(config)
      ? (config as Record<string, unknown>)
      : {};

  if (type === "DYNAMIC") {
    return {
      base_metric:
        pickConfigString(record, "base_metric", "metric") || "",
      rate: pickConfigString(record, "rate") || "",
      cap: normalizeMoneyField(pickConfigString(record, "cap")),
    };
  }

  return {
    amount: normalizeMoneyField(pickConfigString(record, "amount")),
  };
}

export function parseTemplateType(raw: unknown): TemplateType {
  const value = String(raw ?? "")
    .trim()
    .toUpperCase();
  return value === "DYNAMIC" ? "DYNAMIC" : "FIXED";
}

export function parseTemplateToFormValues(
  template: data_TemplateVOSwagger,
): TemplateFormValues {
  const type = parseTemplateType(template.type);
  return {
    type,
    unit: template.unit ?? "",
    voucherType: template.voucher_type ?? "",
    config: configRecordFromUnknown(template.config, type),
  };
}

function validateConfig(
  type: TemplateType,
  config: TemplateConfigFormValues,
): data_TemplateConfigBody {
  if (type === "FIXED") {
    const amount = (config as FixTemplateConfig).amount.trim();
    if (!amount) throw new Error("Amount is required.");
    if (!isNumericString(amount)) {
      throw new Error("Amount must be a valid number.");
    }
    if (!hasAtMostDecimalPlaces(amount, MONEY_DECIMALS)) {
      throw new Error(`Amount must have at most ${MONEY_DECIMALS} decimal places.`);
    }
    return { amount: normalizeMoneyField(amount) };
  }

  const dynamic = config as DynamicTemplateConfig;
  const baseMetric = dynamic.base_metric.trim();
  const rateRaw = dynamic.rate.trim();
  const cap = dynamic.cap.trim();

  if (!baseMetric) throw new Error("Base metric is required.");
  if (!rateRaw) throw new Error("Rate is required.");
  if (!isNumericString(rateRaw)) {
    throw new Error("Rate must be a valid number.");
  }
  if (!cap) throw new Error("Cap is required.");
  if (!isNumericString(cap)) {
    throw new Error("Cap must be a valid number.");
  }
  if (!hasAtMostDecimalPlaces(cap, MONEY_DECIMALS)) {
    throw new Error(`Cap must have at most ${MONEY_DECIMALS} decimal places.`);
  }

  return {
    base_metric: baseMetric,
    rate: Number(rateRaw),
    cap: normalizeMoneyField(cap),
  };
}

export function toCreateTemplatePayload(
  values: TemplateFormValues,
): TemplateCreatePayload {
  const unit = values.unit.trim();
  const voucherType = values.voucherType.trim();
  if (!unit) throw new Error("Unit is required.");
  if (!voucherType) throw new Error("Voucher type is required.");

  return {
    type: values.type,
    unit,
    voucher_type: voucherType,
    config: validateConfig(values.type, values.config),
  };
}

export function toUpdateTemplatePayload(
  type: TemplateType,
  config: TemplateConfigFormValues,
): TemplateUpdatePayload {
  return {
    config: validateConfig(type, config),
  };
}

export function configSummary(
  type: TemplateType,
  config: unknown,
): string {
  const parsed = configRecordFromUnknown(config, type);
  if (type === "FIXED") {
    const amount = (parsed as FixTemplateConfig).amount;
    return amount ? `Amount: ${normalizeMoneyField(amount)}` : "—";
  }

  const dynamic = parsed as DynamicTemplateConfig;
  if (!dynamic.rate && !dynamic.base_metric && !dynamic.cap) return "—";
  const baseMetric = dynamic.base_metric || "—";
  const rate = dynamic.rate || "—";
  const cap = dynamic.cap ? normalizeMoneyField(dynamic.cap) : "—";
  return `Base metric: ${baseMetric}, Rate: ${rate}, Cap: ${cap}`;
}
