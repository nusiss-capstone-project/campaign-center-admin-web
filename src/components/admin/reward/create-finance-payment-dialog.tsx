"use client";

import { useEffect, useState } from "react";

import type { data_PaymentConfigVO } from "@/lib/reward-api/models/data_PaymentConfigVO";
import type { FinancePaymentFormValues } from "@/lib/admin/reward/reward-form-values";
import { emptyFinancePaymentFormValues } from "@/lib/admin/reward/reward-form-values";
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

type CreateFinancePaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pay addresses submitted in the finance doc's application_detail. */
  allowedPayAddresses: string[];
  paymentConfigs: data_PaymentConfigVO[];
  submitting?: boolean;
  error?: string | null;
  onSubmit: (values: FinancePaymentFormValues) => void | Promise<void>;
};

export function CreateFinancePaymentDialog({
  open,
  onOpenChange,
  allowedPayAddresses,
  paymentConfigs,
  submitting = false,
  error,
  onSubmit,
}: CreateFinancePaymentDialogProps) {
  const [values, setValues] = useState<FinancePaymentFormValues>(
    emptyFinancePaymentFormValues(),
  );

  useEffect(() => {
    if (!open) {
      setValues(emptyFinancePaymentFormValues());
    }
  }, [open]);

  // Only accounts whose pay_address appears in the finance doc application_detail.
  const accountOptions = allowedPayAddresses.map((payAddress) => {
    const config = paymentConfigs.find(
      (c) => c.pay_address?.trim() === payAddress,
    );
    return {
      payAddress,
      label: config?.payment_account?.trim() || payAddress,
      unit: config?.unit?.trim() ?? "",
    };
  });

  function selectAccount(payAddress: string) {
    const option = accountOptions.find((o) => o.payAddress === payAddress);
    setValues((prev) => ({
      ...prev,
      paymentAddress: payAddress,
      unit: option?.unit || prev.unit,
    }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record disbursement</DialogTitle>
          <DialogDescription>
            Add a disbursement entry for this approved finance doc.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <label className="grid gap-1.5 text-sm">
            <span className="text-muted-foreground">Payout account</span>
            <Select
              value={values.paymentAddress}
              onValueChange={selectAccount}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payout account" />
              </SelectTrigger>
              <SelectContent>
                {accountOptions.map((option) => (
                  <SelectItem key={option.payAddress} value={option.payAddress}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
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
            <Input
              value={values.unit}
              onChange={(e) => setValues({ ...values, unit: e.target.value })}
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
            {submitting ? "Recording…" : "Record disbursement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
