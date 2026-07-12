import type { TemplateType } from "@/lib/admin/reward/template-form-values";

export const TEMPLATE_TYPE_OPTIONS: {
  value: TemplateType;
  label: string;
}[] = [
  { value: "FIXED", label: "Fixed" },
  { value: "DYNAMIC", label: "Dynamic" },
];
