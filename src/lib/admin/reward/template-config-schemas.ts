import type { TemplateType } from "@/lib/admin/reward/template-form-values";

export type TemplateConfigFieldKind = "money" | "text" | "rate";

export type TemplateConfigFieldSchema = {
  key: string;
  label: string;
  kind: TemplateConfigFieldKind;
  required: boolean;
  placeholder?: string;
  decimals?: number;
};

/** Hardcoded template config schemas (replaces GET /admin/templates/config-schemas). */
export const TEMPLATE_CONFIG_SCHEMAS = {
  FIXED: [
    {
      key: "amount",
      label: "Amount",
      kind: "money",
      required: true,
      placeholder: "0.00",
      decimals: 2,
    },
  ],
  DYNAMIC: [
    {
      key: "base_metric",
      label: "Base metric",
      kind: "text",
      required: true,
      placeholder: "e.g. net_deposit",
    },
    {
      key: "rate",
      label: "Rate",
      kind: "rate",
      required: true,
      placeholder: "0.1",
    },
    {
      key: "cap",
      label: "Cap",
      kind: "money",
      required: true,
      placeholder: "0.00",
      decimals: 2,
    },
  ],
} as const satisfies Record<TemplateType, readonly TemplateConfigFieldSchema[]>;

export function templateConfigSchemaFor(
  type: TemplateType,
): readonly TemplateConfigFieldSchema[] {
  return TEMPLATE_CONFIG_SCHEMAS[type];
}
