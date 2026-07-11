"use client";

import { useEffect, useState } from "react";

import type { data_PaymentConfigVO } from "@/lib/reward-api/models/data_PaymentConfigVO";
import type { IssueRequestFormValues } from "@/lib/admin/reward/reward-form-values";
import {
  emptyIssueRequestFormValues,
} from "@/lib/admin/reward/reward-form-values";
import { EXPENSE_TYPE_OPTIONS } from "@/lib/admin/reward/reward-options";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type IssueRequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  initialValues?: IssueRequestFormValues;
  paymentConfigs: data_PaymentConfigVO[];
  hideExpenseType?: boolean;
  submitting?: boolean;
  error?: string | null;
  onSubmit: (values: IssueRequestFormValues) => void | Promise<void>;
};

export function IssueRequestDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  initialValues,
  paymentConfigs,
  hideExpenseType = false,
  submitting = false,
  error,
  onSubmit,
}: IssueRequestDialogProps) {
  const [values, setValues] = useState<IssueRequestFormValues>(
    initialValues ?? emptyIssueRequestFormValues(),
  );

  useEffect(() => {
    if (open) {
      setValues(initialValues ?? emptyIssueRequestFormValues());
    }
  }, [open, initialValues]);

  const voucherTypes = [
    ...new Set(
      paymentConfigs
        .map((c) => c.voucher_type?.trim())
        .filter((v): v is string => Boolean(v)),
    ),
  ];
  const units = [
    ...new Set(
      paymentConfigs
        .map((c) => c.unit?.trim())
        .filter((v): v is string => Boolean(v)),
    ),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <label className="grid gap-1.5 text-sm">
            <span className="text-muted-foreground">Amount</span>
            <Input
              value={values.amount}
              onChange={(e) => setValues({ ...values, amount: e.target.value })}
              inputMode="decimal"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-muted-foreground">Unit</span>
            {units.length > 0 ? (
              <Select
                value={values.unit}
                onValueChange={(unit) => setValues({ ...values, unit })}
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
                onChange={(e) => setValues({ ...values, unit: e.target.value })}
              />
            )}
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-muted-foreground">Voucher type</span>
            {voucherTypes.length > 0 ? (
              <Select
                value={values.voucherType}
                onValueChange={(voucherType) =>
                  setValues({ ...values, voucherType })
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
                  setValues({ ...values, voucherType: e.target.value })
                }
              />
            )}
          </label>
          {!hideExpenseType ? (
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted-foreground">Expense type</span>
              <Select
                value={values.expenseType}
                onValueChange={(expenseType) =>
                  setValues({ ...values, expenseType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select expense type" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          ) : null}
          <label className="grid gap-1.5 text-sm">
            <span className="text-muted-foreground">Remark (optional)</span>
            <Textarea
              value={values.remark}
              onChange={(e) => setValues({ ...values, remark: e.target.value })}
              rows={3}
            />
          </label>
        </div>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={submitting}
            onClick={() => void onSubmit(values)}
          >
            {submitting ? "Saving…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
