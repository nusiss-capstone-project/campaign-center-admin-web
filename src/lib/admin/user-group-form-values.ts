import type { data_Condition } from "@/lib/usergroup-api/models/data_Condition";
import type { data_CreateUserGroupRequest } from "@/lib/usergroup-api/models/data_CreateUserGroupRequest";
import type { data_RuleConfig } from "@/lib/usergroup-api/models/data_RuleConfig";
import type { data_UserGroupVO } from "@/lib/usergroup-api/models/data_UserGroupVO";
import {
  localDatetimeToUnixSeconds,
  timestampToDatetimeLocal,
} from "@/lib/admin/campaign-form-values";
import {
  USER_GROUP_FIELD_BY_KEY,
  USER_GROUP_OPERATORS,
  type UserGroupOperator,
} from "@/lib/admin/user-group-fields";

export type UserGroupLogic = "AND" | "OR";

export type UserGroupConditionFormValue = {
  /** Stable client key for React lists (not sent to API). */
  key: string;
  field: string;
  operator: UserGroupOperator;
  /** UI string; converted to typed value on submit. */
  value: string;
};

export type UserGroupFormValues = {
  name: string;
  logic: UserGroupLogic;
  conditions: UserGroupConditionFormValue[];
};

function newConditionKey(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  if (c && typeof c.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    c.getRandomValues(bytes);
    bytes[6] = (bytes[6]! & 0x0f) | 0x40;
    bytes[8] = (bytes[8]! & 0x3f) | 0x80;
    const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  throw new Error("Secure random UUID is unavailable in this environment.");
}

export function emptyCondition(): UserGroupConditionFormValue {
  return {
    key: newConditionKey(),
    field: "market",
    operator: "EQ",
    value: "",
  };
}

export function emptyUserGroupFormValues(): UserGroupFormValues {
  return {
    name: "",
    logic: "AND",
    conditions: [emptyCondition()],
  };
}

function unknownToDisplayString(value: unknown): string {
  if (value == null) return "";
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return String(value);
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }
  return "";
}

function valueToFormString(field: string, value: unknown): string {
  const meta = USER_GROUP_FIELD_BY_KEY[field];
  if (!meta) {
    return unknownToDisplayString(value);
  }
  if (meta.valueKind === "datetime") {
    return timestampToDatetimeLocal(value);
  }
  if (meta.valueKind === "boolean") {
    if (value === true || value === "true") return "true";
    if (value === false || value === "false") return "false";
    return "";
  }
  if (value == null) return "";
  return unknownToDisplayString(value);
}

function parseCondition(raw: unknown): UserGroupConditionFormValue {
  if (!raw || typeof raw !== "object") return emptyCondition();
  const o = raw as Record<string, unknown>;
  const field =
    typeof o.field === "string" && USER_GROUP_FIELD_BY_KEY[o.field]
      ? o.field
      : "market";
  const opRaw = typeof o.operator === "string" ? o.operator.toUpperCase() : "EQ";
  const operator = (USER_GROUP_OPERATORS as readonly string[]).includes(opRaw)
    ? (opRaw as UserGroupOperator)
    : "EQ";
  return {
    key: newConditionKey(),
    field,
    operator,
    value: valueToFormString(field, o.value),
  };
}

export function parseUserGroupToFormValues(
  data: data_UserGroupVO | null | undefined,
): UserGroupFormValues {
  const base = emptyUserGroupFormValues();
  if (!data) return base;
  const logicRaw = data.ruleConfig?.logic?.toUpperCase();
  const logic: UserGroupLogic = logicRaw === "OR" ? "OR" : "AND";
  const conditions = Array.isArray(data.ruleConfig?.conditions)
    ? data.ruleConfig.conditions.map(parseCondition)
    : [emptyCondition()];
  return {
    name: data.name?.trim() ?? "",
    logic,
    conditions: conditions.length > 0 ? conditions : [emptyCondition()],
  };
}

function conditionValueForApi(
  field: string,
  raw: string,
): string | number | boolean {
  const meta = USER_GROUP_FIELD_BY_KEY[field];
  if (!meta) throw new Error(`Unsupported field: ${field}`);
  const trimmed = raw.trim();
  if (!trimmed) throw new Error(`${meta.label} value is required.`);

  switch (meta.valueKind) {
    case "datetime": {
      const seconds = localDatetimeToUnixSeconds(trimmed);
      if (seconds == null) {
        throw new Error(`${meta.label} must be a valid date/time.`);
      }
      return seconds;
    }
    case "number": {
      const n = Number(trimmed);
      if (!Number.isFinite(n)) {
        throw new TypeError(`${meta.label} must be a number.`);
      }
      return n;
    }
    case "boolean": {
      if (trimmed === "true") return true;
      if (trimmed === "false") return false;
      throw new Error(`${meta.label} must be true or false.`);
    }
    case "market":
    case "kycStatus":
      return trimmed;
    default:
      return trimmed;
  }
}

export function toUserGroupRequest(
  values: UserGroupFormValues,
): data_CreateUserGroupRequest {
  const name = values.name.trim();
  if (!name) throw new Error("Group name is required.");
  if (values.conditions.length < 1) {
    throw new Error("At least one condition is required.");
  }

  const conditions: data_Condition[] = values.conditions.map((c, index) => {
    if (!USER_GROUP_FIELD_BY_KEY[c.field]) {
      throw new Error(`Condition ${index + 1}: invalid field.`);
    }
    if (!(USER_GROUP_OPERATORS as readonly string[]).includes(c.operator)) {
      throw new Error(`Condition ${index + 1}: invalid operator.`);
    }
    return {
      field: c.field,
      operator: c.operator,
      value: conditionValueForApi(c.field, c.value),
    };
  });

  const ruleConfig: data_RuleConfig = {
    logic: values.logic,
    conditions,
  };

  return { name, ruleConfig };
}

export function formatConditionValueForDisplay(
  field: string,
  value: unknown,
): string {
  const meta = USER_GROUP_FIELD_BY_KEY[field];
  if (!meta) {
    const text = unknownToDisplayString(value);
    return text || "—";
  }
  if (meta.valueKind === "datetime") {
    const local = timestampToDatetimeLocal(value);
    if (local) return local;
    const text = unknownToDisplayString(value);
    return text || "—";
  }
  if (meta.valueKind === "boolean") {
    if (value === true || value === "true") return "true";
    if (value === false || value === "false") return "false";
    return "—";
  }
  if (value == null || value === "") return "—";
  return unknownToDisplayString(value) || "—";
}
