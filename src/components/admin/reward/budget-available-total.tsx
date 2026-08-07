import type { data_BudgetVO } from "@/lib/reward-api/models/data_BudgetVO";
import { formatMoneyDecimal } from "@/lib/admin/reward/reward-utils";
import type { ReactNode } from "react";

function formatBudgetAmount(raw: string | undefined): string {
  const trimmed = raw?.trim();
  if (!trimmed) return "—";
  const formatted = formatMoneyDecimal(trimmed, 2);
  return formatted || "—";
}

export function formatBudgetAvailableTotal(budget: data_BudgetVO): string {
  return `${formatBudgetAmount(budget.available_amount)}/${formatBudgetAmount(budget.total_amount)}`;
}

type BudgetListProps = {
  budgets: data_BudgetVO[];
  emptyLabel?: string;
  /** When true, each row shows unit. */
  showUnit?: boolean;
};

export function BudgetAvailableTotalList({
  budgets,
  emptyLabel = "No budget data.",
  showUnit = false,
}: Readonly<BudgetListProps>) {
  if (budgets.length === 0) {
    return <p className="text-sm text-zinc-500">{emptyLabel}</p>;
  }

  return (
    <ul className="grid gap-3 text-sm">
      {budgets.map((budget) => {
        const unit = budget.unit?.trim() || "—";
        const amount = formatBudgetAvailableTotal(budget);
        return (
          <li
            key={`${unit}-${amount}`}
            className={
              showUnit
                ? "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
                : undefined
            }
          >
            {showUnit ? (
              <span className="text-zinc-400">{unit}</span>
            ) : null}
            <span className="whitespace-nowrap tabular-nums text-zinc-300">
              {amount}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

type BudgetLoadStateProps = {
  loading: boolean;
  error: string | null;
  budgets: data_BudgetVO[];
  showUnit?: boolean;
};

/** Avoid nested ternaries for loading / error / list states. */
export function BudgetLoadState({
  loading,
  error,
  budgets,
  showUnit = false,
}: Readonly<BudgetLoadStateProps>): ReactNode {
  if (loading) {
    return <p className="text-sm text-zinc-500">Loading budgets…</p>;
  }
  if (error) {
    return (
      <p className="text-sm text-red-300" role="alert">
        {error}
      </p>
    );
  }
  return <BudgetAvailableTotalList budgets={budgets} showUnit={showUnit} />;
}
