"use client";

import type { data_PaymentConfigVO } from "@/lib/reward-api/models/data_PaymentConfigVO";
import type {
  TemplateConfigFormValues,
  TemplateFormValues,
  TemplateType,
} from "@/lib/admin/reward/template-form-values";
import {
  emptyDynamicConfig,
  emptyFixConfig,
} from "@/lib/admin/reward/template-form-values";
import { formatMoneyDecimal } from "@/lib/admin/reward/reward-utils";
import {
  templateConfigSchemaFor,
  type TemplateConfigFieldSchema,
} from "@/lib/admin/reward/template-config-schemas";
import { TEMPLATE_TYPE_OPTIONS } from "@/lib/admin/reward/template-options";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TemplateConfigFormProps = {
  values: TemplateFormValues;
  onChange: (values: TemplateFormValues) => void;
  paymentConfigs: data_PaymentConfigVO[];
  configOnly?: boolean;
  readOnly?: boolean;
};

function configFieldValue(
  config: TemplateConfigFormValues,
  key: string,
): string {
  return String((config as Record<string, string>)[key] ?? "");
}

export function TemplateConfigForm({
  values,
  onChange,
  paymentConfigs,
  configOnly = false,
  readOnly = false,
}: TemplateConfigFormProps) {
  const units = [
    ...new Set(
      paymentConfigs
        .map((c) => c.unit?.trim())
        .filter((v): v is string => Boolean(v)),
    ),
  ];
  const voucherTypes = [
    ...new Set(
      paymentConfigs
        .map((c) => c.voucher_type?.trim())
        .filter((v): v is string => Boolean(v)),
    ),
  ];
  const configFields = templateConfigSchemaFor(values.type);

  function setType(type: TemplateType) {
    onChange({
      ...values,
      type,
      config: type === "FIXED" ? emptyFixConfig() : emptyDynamicConfig(),
    });
  }

  function setConfigField(key: string, nextValue: string) {
    onChange({
      ...values,
      config: {
        ...(values.config as Record<string, string>),
        [key]: nextValue,
      } as TemplateConfigFormValues,
    });
  }

  function normalizeMoneyOnBlur(field: TemplateConfigFieldSchema, raw: string) {
    if (field.kind !== "money") return;
    const formatted = formatMoneyDecimal(raw, field.decimals ?? 2);
    if (formatted === raw.trim()) return;
    setConfigField(field.key, formatted);
  }

  function renderConfigField(field: TemplateConfigFieldSchema) {
    const value = configFieldValue(values.config, field.key);
    const inputMode = field.kind === "text" ? undefined : "decimal";

    return (
      <label key={field.key} className="grid gap-1.5 text-sm">
        <span className="text-zinc-400">{field.label}</span>
        <Input
          value={value}
          onChange={(e) => setConfigField(field.key, e.target.value)}
          onBlur={
            field.kind === "money"
              ? (e) => normalizeMoneyOnBlur(field, e.target.value)
              : undefined
          }
          readOnly={readOnly}
          inputMode={inputMode}
          placeholder={field.placeholder}
        />
      </label>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {!configOnly ? (
        <>
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">Type</span>
            <Select
              value={values.type}
              onValueChange={(type) => setType(type as TemplateType)}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">Voucher type</span>
            {voucherTypes.length > 0 && !readOnly ? (
              <Select
                value={values.voucherType}
                onValueChange={(voucherType) =>
                  onChange({ ...values, voucherType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select voucher type" />
                </SelectTrigger>
                <SelectContent>
                  {voucherTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={values.voucherType}
                onChange={(e) =>
                  onChange({ ...values, voucherType: e.target.value })
                }
                readOnly={readOnly}
              />
            )}
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">Unit</span>
            {units.length > 0 && !readOnly ? (
              <Select
                value={values.unit}
                onValueChange={(unit) => onChange({ ...values, unit })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={values.unit}
                onChange={(e) => onChange({ ...values, unit: e.target.value })}
                readOnly={readOnly}
              />
            )}
          </label>
        </>
      ) : null}

      <div className="rounded-lg border border-white/10 bg-zinc-900/40 p-4">
        <p className="mb-3 text-sm font-medium text-zinc-200">Config</p>
        <div className="flex flex-col gap-4">
          {configFields.map(renderConfigField)}
        </div>
      </div>
    </div>
  );
}
