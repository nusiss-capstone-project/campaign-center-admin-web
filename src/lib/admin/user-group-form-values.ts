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

export function emptyCondition(): UserGroupConditionFormValue {
  return {
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

function valueToFormString(field: string, value: unknown): string {
  const meta = USER_GROUP_FIELD_BY_KEY[field];
  if (!meta) {
    return value == null ? "" : String(value);
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
  return String(value);
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
        throw new Error(`${meta.label} must be a number.`);
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
  if (!meta) return value == null ? "—" : String(value);
  if (meta.valueKind === "datetime") {
    const local = timestampToDatetimeLocal(value);
    return local || (value == null ? "—" : String(value));
  }
  if (meta.valueKind === "boolean") {
    if (value === true || value === "true") return "true";
    if (value === false || value === "false") return "false";
    return "—";
  }
  return value == null || value === "" ? "—" : String(value);
}
