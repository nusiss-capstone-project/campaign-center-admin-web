"use client";

import type {
  UserGroupConditionFormValue,
  UserGroupFormValues,
  UserGroupLogic,
} from "@/lib/admin/user-group-form-values";
import { emptyCondition } from "@/lib/admin/user-group-form-values";
import {
  KYC_STATUS_OPTIONS,
  MARKET_OPTIONS,
  USER_GROUP_FIELDS,
  USER_GROUP_FIELD_BY_KEY,
  USER_GROUP_OPERATORS,
  type UserGroupOperator,
} from "@/lib/admin/user-group-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserGroupRuleFormProps = {
  values: UserGroupFormValues;
  readOnly?: boolean;
  onChange?: (next: UserGroupFormValues) => void;
};

const fieldClass =
  "border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70";

function ConditionValueInput({
  condition,
  readOnly,
  onChange,
}: Readonly<{
  condition: UserGroupConditionFormValue;
  readOnly: boolean;
  onChange: (value: string) => void;
}>) {
  const meta = USER_GROUP_FIELD_BY_KEY[condition.field];
  const kind = meta?.valueKind ?? "number";

  if (kind === "datetime") {
    return (
      <Input
        type="datetime-local"
        value={condition.value}
        disabled={readOnly}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
      />
    );
  }

  if (kind === "number") {
    return (
      <Input
        type="number"
        value={condition.value}
        disabled={readOnly}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
      />
    );
  }

  if (kind === "boolean") {
    return (
      <Select
        value={condition.value || undefined}
        disabled={readOnly}
        onValueChange={onChange}
      >
        <SelectTrigger className={`h-9 ${fieldClass}`}>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">true</SelectItem>
          <SelectItem value="false">false</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  if (kind === "market") {
    return (
      <Select
        value={condition.value || undefined}
        disabled={readOnly}
        onValueChange={onChange}
      >
        <SelectTrigger className={`h-9 ${fieldClass}`}>
          <SelectValue placeholder="Select market" />
        </SelectTrigger>
        <SelectContent>
          {MARKET_OPTIONS.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select
      value={condition.value || undefined}
      disabled={readOnly}
      onValueChange={onChange}
    >
      <SelectTrigger className={`h-9 ${fieldClass}`}>
        <SelectValue placeholder="Select KYC status" />
      </SelectTrigger>
      <SelectContent>
        {KYC_STATUS_OPTIONS.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function UserGroupRuleForm({
  values,
  readOnly = false,
  onChange,
}: Readonly<UserGroupRuleFormProps>) {
  function set(next: Partial<UserGroupFormValues>) {
    if (readOnly || !onChange) return;
    onChange({ ...values, ...next });
  }

  function updateCondition(
    index: number,
    patch: Partial<UserGroupConditionFormValue>,
  ) {
    if (readOnly || !onChange) return;
    const conditions = values.conditions.map((c, i) => {
      if (i !== index) return c;
      const next = { ...c, ...patch };
      if (patch.field && patch.field !== c.field) {
        next.value = "";
      }
      return next;
    });
    onChange({ ...values, conditions });
  }

  function addCondition() {
    if (readOnly || !onChange) return;
    onChange({
      ...values,
      conditions: [...values.conditions, emptyCondition()],
    });
  }

  function removeCondition(index: number) {
    if (readOnly || !onChange) return;
    if (values.conditions.length <= 1) return;
    onChange({
      ...values,
      conditions: values.conditions.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="grid gap-1.5 text-sm">
        <span className="text-zinc-400">Group Name</span>
        <Input
          value={values.name}
          disabled={readOnly}
          readOnly={readOnly}
          required={!readOnly}
          onChange={(e) => set({ name: e.target.value })}
          className={fieldClass}
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="text-zinc-400">Match logic</span>
        <Select
          value={values.logic}
          disabled={readOnly}
          onValueChange={(v) => set({ logic: v as UserGroupLogic })}
        >
          <SelectTrigger className={`h-9 w-56 ${fieldClass}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AND">AND (Match all)</SelectItem>
            <SelectItem value="OR">OR (Match any)</SelectItem>
          </SelectContent>
        </Select>
      </label>

      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-zinc-400">Conditions</span>
          {!readOnly ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-white/10 bg-zinc-900/50"
              onClick={addCondition}
            >
              Add condition
            </Button>
          ) : null}
        </div>

        {values.conditions.map((condition, index) => (
          <div
            key={condition.key}
            className="rounded-lg border border-white/10 bg-zinc-950/40 p-3"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs text-zinc-500">
                Condition #{index + 1}
              </span>
              {!readOnly ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-white/10 bg-zinc-900/50"
                  disabled={values.conditions.length <= 1}
                  onClick={() => removeCondition(index)}
                >
                  Remove
                </Button>
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="grid gap-1.5 text-sm">
                <span className="text-zinc-400">Field</span>
                <Select
                  value={condition.field}
                  disabled={readOnly}
                  onValueChange={(field) => updateCondition(index, { field })}
                >
                  <SelectTrigger className={`h-9 ${fieldClass}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_GROUP_FIELDS.map((f) => (
                      <SelectItem key={f.field} value={f.field}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-zinc-400">Operator</span>
                <Select
                  value={condition.operator}
                  disabled={readOnly}
                  onValueChange={(operator) =>
                    updateCondition(index, {
                      operator: operator as UserGroupOperator,
                    })
                  }
                >
                  <SelectTrigger className={`h-9 ${fieldClass}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_GROUP_OPERATORS.map((op) => (
                      <SelectItem key={op} value={op}>
                        {op}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-zinc-400">Value</span>
                <ConditionValueInput
                  condition={condition}
                  readOnly={readOnly}
                  onChange={(value) => updateCondition(index, { value })}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
