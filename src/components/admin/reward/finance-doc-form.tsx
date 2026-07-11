"use client";

import { Plus, Trash2 } from "lucide-react";

import type { data_PaymentConfigVO } from "@/lib/reward-api/models/data_PaymentConfigVO";
import type { ProjectDisplayRow } from "@/lib/admin/reward/reward-row";
import type {
  ApplicationDetailFormRow,
  FinanceDocFormValues,
} from "@/lib/admin/reward/reward-form-values";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FinanceDocFormProps = {
  values: FinanceDocFormValues;
  onChange: (values: FinanceDocFormValues) => void;
  projects: ProjectDisplayRow[];
  paymentConfigs: data_PaymentConfigVO[];
  readOnly?: boolean;
  showProjectSelect?: boolean;
};

function updateDetailRow(
  rows: ApplicationDetailFormRow[],
  index: number,
  patch: Partial<ApplicationDetailFormRow>,
): ApplicationDetailFormRow[] {
  return rows.map((row, i) => (i === index ? { ...row, ...patch } : row));
}

export function FinanceDocForm({
  values,
  onChange,
  projects,
  paymentConfigs,
  readOnly = false,
  showProjectSelect = true,
}: FinanceDocFormProps) {
  const paymentOptions = paymentConfigs.flatMap((config) => {
    const payAddress = config.pay_address?.trim();
    if (!payAddress) return [];
    return [
      {
        payAddress,
        label: config.payment_account?.trim() || payAddress,
      },
    ];
  });

  function setDetail(rows: ApplicationDetailFormRow[]) {
    onChange({ ...values, applicationDetail: rows });
  }

  return (
    <div className="flex flex-col gap-5">
      {showProjectSelect ? (
        <label className="grid gap-1.5 text-sm">
          <span className="text-zinc-400">Project</span>
          <Select
            value={values.projectId}
            onValueChange={(projectId) => onChange({ ...values, projectId })}
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name} (#{p.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      ) : null}

      <label className="grid gap-1.5 text-sm">
        <span className="text-zinc-400">Description</span>
        <Textarea
          value={values.description}
          onChange={(e) => onChange({ ...values, description: e.target.value })}
          readOnly={readOnly}
          rows={3}
        />
      </label>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-zinc-200">Application detail</p>
          {!readOnly ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setDetail([
                  ...values.applicationDetail,
                  { amount: "", payAddress: "" },
                ])
              }
            >
              <Plus className="size-4" />
              Add row
            </Button>
          ) : null}
        </div>

        {values.applicationDetail.map((row, index) => (
          <div
            key={index}
            className="grid gap-3 rounded-lg border border-white/10 bg-zinc-900/40 p-4 md:grid-cols-[1fr_1fr_auto]"
          >
            <label className="grid gap-1.5 text-sm">
              <span className="text-zinc-400">Amount</span>
              <Input
                value={row.amount}
                onChange={(e) =>
                  setDetail(
                    updateDetailRow(values.applicationDetail, index, {
                      amount: e.target.value,
                    }),
                  )
                }
                readOnly={readOnly}
                inputMode="decimal"
                placeholder="0.00"
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-zinc-400">Payment account</span>
              {paymentOptions.length > 0 && !readOnly ? (
                <Select
                  value={row.payAddress}
                  onValueChange={(payAddress) =>
                    setDetail(
                      updateDetailRow(values.applicationDetail, index, {
                        payAddress,
                      }),
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment account" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentOptions.map((option) => (
                      <SelectItem
                        key={option.payAddress}
                        value={option.payAddress}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={row.payAddress}
                  onChange={(e) =>
                    setDetail(
                      updateDetailRow(values.applicationDetail, index, {
                        payAddress: e.target.value,
                      }),
                    )
                  }
                  readOnly={readOnly}
                />
              )}
            </label>
            {!readOnly && values.applicationDetail.length > 1 ? (
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-zinc-400 hover:text-red-300"
                  aria-label="Remove row"
                  onClick={() =>
                    setDetail(
                      values.applicationDetail.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
