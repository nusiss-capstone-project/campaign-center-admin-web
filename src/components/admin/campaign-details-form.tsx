"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import type { CampaignFormValues } from "@/lib/admin/campaign-form-values";
import {
  CAMPAIGN_MARKET_SUGGESTIONS,
  TIMEZONE_OPTIONS,
} from "@/lib/admin/campaign-options";
import { fetchTaskGroups, fetchTasksByGroup } from "@/lib/admin/task-admin-fetch";
import { fetchPublishedLandingPages } from "@/lib/admin/landing-pages-fetch";
import type { LandingPageDisplayRow } from "@/lib/admin/landing-page-row";
import {
  fetchProjects,
  fetchTemplates,
} from "@/lib/admin/reward/reward-api";
import type { ProjectDisplayRow, TemplateDisplayRow } from "@/lib/admin/reward/reward-row";
import type { TaskGroupVO, TaskVO } from "@/lib/admin/task-types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NONE = "__none__";

function FormSection({
  title,
  description,
  children,
  defaultOpen = true,
}: Readonly<{
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}>) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <section className="rounded-xl border border-white/10 bg-zinc-950/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
      >
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold tracking-wide text-white">
            {title}
          </h3>
          {description ? (
            <p className="mt-1 text-xs text-zinc-500">{description}</p>
          ) : null}
        </div>
        <ChevronDown
          className={cn(
            "mt-0.5 size-4 shrink-0 text-zinc-400 transition-transform duration-200",
            open ? "rotate-0" : "-rotate-90",
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          id={panelId}
          className="flex flex-col gap-4 border-t border-white/10 px-5 py-4"
        >
          {children}
        </div>
      ) : null}
    </section>
  );
}

const FIELD_CLASS =
  "w-full border-white/10 bg-zinc-900/80 text-zinc-100 disabled:opacity-70";
const SELECT_TRIGGER_CLASS = `${FIELD_CLASS} min-w-0 justify-between`;
const SELECT_CONTENT_CLASS =
  "w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-w-[min(100vw-2rem,40rem)]";

function useCampaignImportLists(readOnly: boolean) {
  const [projects, setProjects] = useState<ProjectDisplayRow[]>([]);
  const [templates, setTemplates] = useState<TemplateDisplayRow[]>([]);
  const [taskGroups, setTaskGroups] = useState<TaskGroupVO[]>([]);
  const [landingPages, setLandingPages] = useState<LandingPageDisplayRow[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [loadingImports, setLoadingImports] = useState(false);

  useEffect(() => {
    if (readOnly) return;
    let cancelled = false;
    async function load() {
      setLoadingImports(true);
      setImportError(null);
      try {
        const [projectPage, templatePage, groups, publishedLandings] =
          await Promise.all([
            fetchProjects({ page: 1, size: 100 }),
            fetchTemplates({ page: 1, size: 100 }),
            fetchTaskGroups(),
            fetchPublishedLandingPages({ page: 1, pageSize: 100 }),
          ]);
        if (cancelled) return;
        setProjects(projectPage.rows);
        setTemplates(templatePage.rows);
        setTaskGroups(groups);
        setLandingPages(publishedLandings);
      } catch (e) {
        if (cancelled) return;
        setImportError(
          e instanceof Error ? e.message : "Failed to load import lists",
        );
      } finally {
        if (!cancelled) setLoadingImports(false);
      }
    }
    load().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [readOnly]);

  return {
    projects,
    templates,
    taskGroups,
    landingPages,
    importError,
    setImportError,
    loadingImports,
  };
}

function taskRewardLabel(item: CampaignFormValues["taskRewardItems"][number]) {
  if (item.rewardTemplateName) return item.rewardTemplateName;
  if (item.rewardTemplateId) return `#${item.rewardTemplateId}`;
  return "no template";
}

type TaskRewardItemsPanelProps = {
  loadingTasks: boolean;
  taskGroupId: string;
  taskRewardItems: CampaignFormValues["taskRewardItems"];
  templates: TemplateDisplayRow[];
  selectTriggerClass: string;
  selectContentClass: string;
  onSelectTaskTemplate: (taskId: string, templateId: string) => void;
};

function TaskRewardItemsPanel({
  loadingTasks,
  taskGroupId,
  taskRewardItems,
  templates,
  selectTriggerClass,
  selectContentClass,
  onSelectTaskTemplate,
}: Readonly<TaskRewardItemsPanelProps>) {
  if (loadingTasks) {
    return <p className="text-sm text-zinc-500">Loading tasks…</p>;
  }
  if (taskRewardItems.length > 0) {
    return (
      <div className="flex flex-col gap-3">
        {taskRewardItems.map((item) => (
          <div
            key={item.taskId || item.taskName}
            className="grid gap-2 rounded-lg border border-white/10 bg-zinc-900/40 p-3 sm:grid-cols-[1fr_1fr]"
          >
            <div className="text-sm text-zinc-200">
              <p className="font-medium">
                {item.taskName || `Task ${item.taskId}`}
              </p>
              <p className="text-xs text-zinc-500">ID {item.taskId}</p>
            </div>
            <Select
              value={item.rewardTemplateId || NONE}
              onValueChange={(v) => onSelectTaskTemplate(item.taskId, v)}
            >
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder="Reward template" />
              </SelectTrigger>
              <SelectContent position="popper" className={selectContentClass}>
                <SelectItem value={NONE}>None</SelectItem>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    #{t.id} · {t.typeLabel} · {t.voucherType || t.unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    );
  }
  if (taskGroupId) {
    return (
      <p className="text-sm text-zinc-500">No tasks in this group.</p>
    );
  }
  return null;
}

type CampaignTaskRewardsSectionProps = {
  values: CampaignFormValues;
  readOnly: boolean;
  importError: string | null;
  loadingImports: boolean;
  loadingTasks: boolean;
  projects: ProjectDisplayRow[];
  templates: TemplateDisplayRow[];
  taskGroups: TaskGroupVO[];
  onSelectTaskGroup: (taskGroupId: string) => void | Promise<void>;
  onSelectGroupReward: (templateId: string) => void;
  onSelectTaskTemplate: (taskId: string, templateId: string) => void;
};

function CampaignTaskRewardsSection({
  values,
  readOnly,
  importError,
  loadingImports,
  loadingTasks,
  projects,
  templates,
  taskGroups,
  onSelectTaskGroup,
  onSelectGroupReward,
  onSelectTaskTemplate,
}: Readonly<CampaignTaskRewardsSectionProps>) {
  return (
    <FormSection
      title="Task group & rewards"
      description="Import a task group, then assign a reward template per task. Optional group-completion template uses taskGroupReward."
    >
      {importError ? (
        <p className="text-sm text-red-400" role="alert">
          {importError}
        </p>
      ) : null}
      {readOnly ? (
        <div className="flex flex-col gap-2 text-sm text-zinc-300">
          <p>
            Task group: {values.taskGroupId ? `#${values.taskGroupId}` : "—"}
          </p>
          <p>
            Group reward template:{" "}
            {values.taskGroupRewardTemplateId
              ? `#${values.taskGroupRewardTemplateId}`
              : "—"}
          </p>
          {values.taskRewardItems.length === 0 ? (
            <p className="text-zinc-500">No task reward items.</p>
          ) : (
            <ul className="list-inside list-disc space-y-1 text-zinc-400">
              {values.taskRewardItems.map((item) => (
                <li key={item.taskId || item.taskName}>
                  {item.taskName || `Task ${item.taskId}`} →{" "}
                  {taskRewardLabel(item)}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <>
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">Task group</span>
            <Select
              value={values.taskGroupId || NONE}
              onValueChange={(v) => {
                Promise.resolve(onSelectTaskGroup(v)).catch(() => undefined);
              }}
              disabled={loadingImports || loadingTasks}
            >
              <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                <SelectValue placeholder="Select task group" />
              </SelectTrigger>
              <SelectContent position="popper" className={SELECT_CONTENT_CLASS}>
                <SelectItem value={NONE}>None</SelectItem>
                {taskGroups.map((g) => (
                  <SelectItem
                    key={g.id ?? g.name}
                    value={g.id != null ? String(g.id) : NONE}
                    disabled={g.id == null}
                  >
                    {g.name}
                    {g.status ? ` · ${g.status}` : ""}
                    {g.id != null ? ` (#${g.id})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">
              Group completion reward template (optional)
            </span>
            <Select
              value={values.taskGroupRewardTemplateId || NONE}
              onValueChange={onSelectGroupReward}
              disabled={loadingImports || !values.taskGroupId}
            >
              <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent position="popper" className={SELECT_CONTENT_CLASS}>
                <SelectItem value={NONE}>None</SelectItem>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    #{t.id} · {t.typeLabel} · {t.voucherType || t.unit} ·{" "}
                    {t.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <TaskRewardItemsPanel
            loadingTasks={loadingTasks}
            taskGroupId={values.taskGroupId}
            taskRewardItems={values.taskRewardItems}
            templates={templates}
            selectTriggerClass={SELECT_TRIGGER_CLASS}
            selectContentClass={SELECT_CONTENT_CLASS}
            onSelectTaskTemplate={onSelectTaskTemplate}
          />
          {!loadingImports &&
          projects.length === 0 &&
          taskGroups.length === 0 ? (
            <Button
              type="button"
              variant="outline"
              className="w-fit border-white/10"
              onClick={() => window.location.reload()}
            >
              Reload import lists
            </Button>
          ) : null}
        </>
      )}
    </FormSection>
  );
}

type CampaignDetailsFormProps = {
  values: CampaignFormValues;
  readOnly: boolean;
  onChange?: (next: CampaignFormValues) => void;
  statusLabel?: string | null;
  versionLabel?: string | null;
};

function patch(
  prev: CampaignFormValues,
  next: Partial<CampaignFormValues>,
): CampaignFormValues {
  return { ...prev, ...next };
}

export function CampaignDetailsForm({
  values,
  readOnly,
  onChange,
  statusLabel,
  versionLabel,
}: Readonly<CampaignDetailsFormProps>) {
  const ro = readOnly;
  const set = (p: Partial<CampaignFormValues>) => {
    if (!readOnly && onChange) onChange(patch(values, p));
  };

  const {
    projects,
    templates,
    taskGroups,
    landingPages,
    importError,
    setImportError,
    loadingImports,
  } = useCampaignImportLists(ro);
  const [loadingTasks, setLoadingTasks] = useState(false);

  async function onSelectTaskGroup(taskGroupId: string) {
    if (ro) return;
    if (!taskGroupId || taskGroupId === NONE) {
      set({
        taskGroupId: "",
        taskGroupRewardTemplateId: "",
        taskRewardItems: [],
      });
      return;
    }
    set({ taskGroupId });
    setLoadingTasks(true);
    setImportError(null);
    try {
      const tasks = await fetchTasksByGroup(Number(taskGroupId));
      const items = tasks.map((task: TaskVO) => {
        const existing = values.taskRewardItems.find(
          (row) => row.taskId === String(task.id ?? ""),
        );
        return {
          taskId: task.id != null ? String(task.id) : "",
          taskName: task.name ?? "",
          rewardTemplateId: existing?.rewardTemplateId ?? "",
          rewardTemplateName: existing?.rewardTemplateName ?? "",
        };
      });
      set({ taskGroupId, taskRewardItems: items });
    } catch (e) {
      setImportError(
        e instanceof Error ? e.message : "Failed to load tasks for group",
      );
    } finally {
      setLoadingTasks(false);
    }
  }

  function onSelectBudget(projectId: string) {
    if (projectId === NONE) {
      set({ budgetProjectId: "", budgetProjectName: "" });
      return;
    }
    const project = projects.find((p) => String(p.id) === projectId);
    set({
      budgetProjectId: projectId,
      budgetProjectName: project?.name ?? values.budgetProjectName,
    });
  }

  function onSelectLandingPage(landingPageId: string) {
    set({
      landingPageId: landingPageId === NONE ? "" : landingPageId,
    });
  }

  function onSelectTaskTemplate(taskId: string, templateId: string) {
    const template =
      templateId === NONE
        ? null
        : templates.find((t) => String(t.id) === templateId);
    set({
      taskRewardItems: values.taskRewardItems.map((row) =>
        row.taskId === taskId
          ? {
              ...row,
              rewardTemplateId: templateId === NONE ? "" : templateId,
              rewardTemplateName: template
                ? `${template.typeLabel} · ${template.voucherType || template.unit}`
                : "",
            }
          : row,
      ),
    });
  }

  function onSelectGroupReward(templateId: string) {
    set({
      taskGroupRewardTemplateId: templateId === NONE ? "" : templateId,
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {(statusLabel || versionLabel) && (
        <div className="flex flex-wrap gap-4 rounded-xl border border-white/10 bg-zinc-950/40 px-5 py-3 text-sm text-zinc-400">
          {statusLabel ? (
            <p>
              Status: <span className="text-zinc-100">{statusLabel}</span>
            </p>
          ) : null}
          {versionLabel ? (
            <p>
              Version: <span className="text-zinc-100">{versionLabel}</span>
            </p>
          ) : null}
        </div>
      )}

      <FormSection title="Basics">
        <label className="grid gap-1.5 text-sm">
          <span className="text-zinc-400">Name</span>
          {ro ? (
            <p className="rounded-lg border border-white/10 bg-zinc-900/80 px-2.5 py-1.5 text-sm text-zinc-100">
              {values.name.trim() ? values.name : "—"}
            </p>
          ) : (
            <Input
              value={values.name}
              onChange={(e) => set({ name: e.target.value })}
              required
              className={FIELD_CLASS}
            />
          )}
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-zinc-400">Market</span>
          <Input
            list="campaign-market-suggestions"
            value={values.market}
            onChange={(e) => set({ market: e.target.value })}
            disabled={ro}
            readOnly={ro}
            placeholder="e.g. SG"
            className={FIELD_CLASS}
          />
          <datalist id="campaign-market-suggestions">
            {CAMPAIGN_MARKET_SUGGESTIONS.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-zinc-400">Time zone</span>
          {ro ? (
            <Input value={values.timeZone} readOnly disabled className={FIELD_CLASS} />
          ) : (
            <Select
              value={values.timeZone || TIMEZONE_OPTIONS[0].value}
              onValueChange={(timeZone) => set({ timeZone })}
            >
              <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                <SelectValue placeholder="Select time zone" />
              </SelectTrigger>
              <SelectContent position="popper" className={SELECT_CONTENT_CLASS}>
                {TIMEZONE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">Registration start</span>
            <Input
              type="datetime-local"
              value={values.registrationStartTime}
              onChange={(e) => set({ registrationStartTime: e.target.value })}
              disabled={ro}
              readOnly={ro}
              className={FIELD_CLASS}
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">Registration end</span>
            <Input
              type="datetime-local"
              value={values.registrationEndTime}
              onChange={(e) => set({ registrationEndTime: e.target.value })}
              disabled={ro}
              readOnly={ro}
              className={FIELD_CLASS}
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">Campaign start</span>
            <Input
              type="datetime-local"
              value={values.campaignStartTime}
              onChange={(e) => set({ campaignStartTime: e.target.value })}
              disabled={ro}
              readOnly={ro}
              className={FIELD_CLASS}
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">Campaign end</span>
            <Input
              type="datetime-local"
              value={values.campaignEndTime}
              onChange={(e) => set({ campaignEndTime: e.target.value })}
              disabled={ro}
              readOnly={ro}
              className={FIELD_CLASS}
            />
          </label>
        </div>
      </FormSection>

      <FormSection
        title="Target user group"
        description="Manual entry for now. Identity service list will be wired later."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">Group ID</span>
            <Input
              inputMode="numeric"
              value={values.targetUserGroupId}
              onChange={(e) => set({ targetUserGroupId: e.target.value })}
              disabled={ro}
              readOnly={ro}
              className={FIELD_CLASS}
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">Group name</span>
            <Input
              value={values.targetUserGroupName}
              onChange={(e) => set({ targetUserGroupName: e.target.value })}
              disabled={ro}
              readOnly={ro}
              className={FIELD_CLASS}
            />
          </label>
        </div>
      </FormSection>

      <FormSection
        title="Landing page"
        description="Select a published landing page."
      >
        {ro ? (
          <p className="text-sm text-zinc-300">
            {values.landingPageId ? `#${values.landingPageId}` : "—"}
          </p>
        ) : (
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">Landing page</span>
            <Select
              value={values.landingPageId || NONE}
              onValueChange={onSelectLandingPage}
              disabled={loadingImports}
            >
              <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                <SelectValue placeholder="Select landing page" />
              </SelectTrigger>
              <SelectContent position="popper" className={SELECT_CONTENT_CLASS}>
                <SelectItem value={NONE}>None</SelectItem>
                {landingPages.map((page) => (
                  <SelectItem key={page.id} value={String(page.id)}>
                    {page.title} (#{page.id}) · {page.language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        )}
      </FormSection>

      <FormSection
        title="Budget"
        description="Import a reward project (status filter coming later)."
      >
        {ro ? (
          <p className="text-sm text-zinc-300">
            {values.budgetProjectId
              ? `${values.budgetProjectName || "Project"} (#${values.budgetProjectId})`
              : "—"}
          </p>
        ) : (
          <label className="grid gap-1.5 text-sm">
            <span className="text-zinc-400">Reward project</span>
            <Select
              value={values.budgetProjectId || NONE}
              onValueChange={onSelectBudget}
              disabled={loadingImports}
            >
              <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent position="popper" className={SELECT_CONTENT_CLASS}>
                <SelectItem value={NONE}>None</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name} (#{p.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        )}
      </FormSection>

      <CampaignTaskRewardsSection
        values={values}
        readOnly={ro}
        importError={importError}
        loadingImports={loadingImports}
        loadingTasks={loadingTasks}
        projects={projects}
        templates={templates}
        taskGroups={taskGroups}
        onSelectTaskGroup={onSelectTaskGroup}
        onSelectGroupReward={onSelectGroupReward}
        onSelectTaskTemplate={onSelectTaskTemplate}
      />
    </div>
  );
}
