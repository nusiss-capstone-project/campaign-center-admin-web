export type TaskEnvelope<T = unknown> = {
  code?: number;
  data?: T;
  err_msg?: string;
};

export type TaskGroupVO = {
  id?: number;
  name: string;
  status?: string;
};

export type TaskConditionVO = {
  no?: number;
  metric_id: number;
  operator_id: number;
  metric_value: string;
};

export type TaskVO = {
  id?: number;
  name: string;
  status?: string;
  start_time?: string;
  end_time?: string;
  expression?: string;
  task_group_id?: number;
  conditions?: TaskConditionVO[];
};

export type DataMetricVO = {
  id?: number;
  code?: string;
};

export type MetricOperatorVO = {
  id?: number;
  code?: string;
  display?: string;
};

export type PublishStatusVO = {
  id: number;
  status: string;
};

export type TaskStatus = "DRAFT" | "PUBLISHED";
