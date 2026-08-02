"use client";

import type { LandingRepeatableItem } from "@/lib/admin/landing-page-form-values";
import { emptyLandingRepeatableItem } from "@/lib/admin/landing-page-form-values";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type LandingRepeatableItemsEditorProps = {
  label: string;
  items: LandingRepeatableItem[];
  readOnly: boolean;
  onChange?: (next: LandingRepeatableItem[]) => void;
};

export function LandingRepeatableItemsEditor({
  label,
  items,
  readOnly,
  onChange,
}: Readonly<LandingRepeatableItemsEditorProps>) {
  const fieldClass =
    "border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70";

  function updateItem(index: number, patch: Partial<LandingRepeatableItem>) {
    if (readOnly || !onChange) return;
    onChange(
      items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  function addItem() {
    if (readOnly || !onChange) return;
    onChange([...items, emptyLandingRepeatableItem()]);
  }

  function removeItem(index: number) {
    if (readOnly || !onChange) return;
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-zinc-400">{label}</span>
        {!readOnly ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-white/10 bg-zinc-900/50"
            onClick={addItem}
          >
            Add
          </Button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-600">No items</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div
              key={`${label}-${index}`}
              className="rounded-lg border border-white/10 bg-zinc-950/40 p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs text-zinc-500">
                  {label} #{index + 1}
                </span>
                {!readOnly ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-white/10 bg-zinc-900/50 text-zinc-300"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
              <label className="mb-2 grid gap-1.5 text-sm">
                <span className="text-zinc-400">Title</span>
                <Input
                  value={item.title}
                  onChange={(e) => updateItem(index, { title: e.target.value })}
                  disabled={readOnly}
                  readOnly={readOnly}
                  className={fieldClass}
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-zinc-400">Description</span>
                <Textarea
                  value={item.description}
                  onChange={(e) =>
                    updateItem(index, { description: e.target.value })
                  }
                  disabled={readOnly}
                  readOnly={readOnly}
                  rows={3}
                  className={fieldClass}
                />
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
