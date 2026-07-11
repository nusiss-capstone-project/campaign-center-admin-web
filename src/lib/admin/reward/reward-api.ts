import type { data_ApproveFinanceDocRequest } from "@/lib/reward-api/models/data_ApproveFinanceDocRequest";
import type { data_ApproveIssueRequestRequest } from "@/lib/reward-api/models/data_ApproveIssueRequestRequest";
import type { data_CreateFinanceDocRequest } from "@/lib/reward-api/models/data_CreateFinanceDocRequest";
import type { data_CreateFinancePaymentRequest } from "@/lib/reward-api/models/data_CreateFinancePaymentRequest";
import type { data_CreateIssueRequestRequest } from "@/lib/reward-api/models/data_CreateIssueRequestRequest";
import type { data_CreateProjectRequest } from "@/lib/reward-api/models/data_CreateProjectRequest";
import type { data_FinanceDocVO } from "@/lib/reward-api/models/data_FinanceDocVO";
import type { data_PaymentConfigVO } from "@/lib/reward-api/models/data_PaymentConfigVO";
import type { data_SubmitFinanceDocRequest } from "@/lib/reward-api/models/data_SubmitFinanceDocRequest";
import type { data_SubmitIssueRequestRequest } from "@/lib/reward-api/models/data_SubmitIssueRequestRequest";
import type { data_UpdateFinanceDocContentRequest } from "@/lib/reward-api/models/data_UpdateFinanceDocContentRequest";
import type { data_UpdateIssueRequestRequest } from "@/lib/reward-api/models/data_UpdateIssueRequestRequest";
import { AdminFinanceDocService } from "@/lib/reward-api/services/AdminFinanceDocService";
import { AdminFinancePaymentService } from "@/lib/reward-api/services/AdminFinancePaymentService";
import { AdminIssueRequestService } from "@/lib/reward-api/services/AdminIssueRequestService";
import { AdminPaymentConfigService } from "@/lib/reward-api/services/AdminPaymentConfigService";
import { AdminProjectService } from "@/lib/reward-api/services/AdminProjectService";
import {
  normalizeFinanceDocRow,
  normalizeFinanceDocRows,
  normalizeFinancePaymentRows,
  normalizeIssueRequestRows,
  normalizeProjectRows,
  type FinanceDocDisplayRow,
  type FinancePaymentDisplayRow,
  type IssueRequestDisplayRow,
  type ProjectDisplayRow,
} from "@/lib/admin/reward/reward-row";
import {
  pageItems,
  unwrapRewardResponse,
  unwrapRewardResponseNullable,
} from "@/lib/admin/reward/reward-utils";

export type PagedResult<T> = {
  rows: T[];
  page: number;
  size: number;
  total: number;
};

export async function fetchProjects(params: {
  page: number;
  size: number;
}): Promise<PagedResult<ProjectDisplayRow>> {
  const res = await AdminProjectService.getRewardMsV1AdminProjects(
    params.page,
    params.size,
  );
  const data = unwrapRewardResponse(res);
  const items = pageItems(data.items);
  return {
    rows: normalizeProjectRows(items),
    page: data.page ?? params.page,
    size: data.size ?? params.size,
    total: data.total ?? items.length,
  };
}

export async function createProject(
  payload: data_CreateProjectRequest,
): Promise<number> {
  const res = await AdminProjectService.postRewardMsV1AdminProjects(payload);
  const data = unwrapRewardResponse(res);
  if (data.project_id == null) {
    throw new Error("Project ID missing from response");
  }
  return data.project_id;
}

export async function fetchFinanceDocs(params: {
  page: number;
  size: number;
}): Promise<PagedResult<FinanceDocDisplayRow>> {
  const res = await AdminFinanceDocService.getRewardMsV1AdminFinanceDocs(
    params.page,
    params.size,
  );
  const data = unwrapRewardResponse(res);
  const items = pageItems(data.items);
  return {
    rows: normalizeFinanceDocRows(items),
    page: data.page ?? params.page,
    size: data.size ?? params.size,
    total: data.total ?? items.length,
  };
}

export async function fetchFinanceDocDetail(
  docId: string,
): Promise<data_FinanceDocVO> {
  const res = await AdminFinanceDocService.getRewardMsV1AdminFinanceDocs1(docId);
  return unwrapRewardResponse(res);
}

export async function createFinanceDoc(
  payload: data_CreateFinanceDocRequest,
): Promise<string> {
  const res = await AdminFinanceDocService.postRewardMsV1AdminFinanceDocs(payload);
  const data = unwrapRewardResponse(res);
  if (!data.doc_id) throw new Error("Finance doc ID missing from response");
  return data.doc_id;
}

export async function updateFinanceDoc(
  docId: string,
  payload: data_UpdateFinanceDocContentRequest,
): Promise<data_FinanceDocVO> {
  const res = await AdminFinanceDocService.putRewardMsV1AdminFinanceDocs(
    docId,
    payload,
  );
  return unwrapRewardResponse(res);
}

export async function submitFinanceDoc(
  docId: string,
  payload?: data_SubmitFinanceDocRequest,
): Promise<void> {
  const res = await AdminFinanceDocService.patchRewardMsV1AdminFinanceDocsSubmission(
    docId,
    payload,
  );
  unwrapRewardResponse(res);
}

export async function approveFinanceDoc(
  docId: string,
  payload: data_ApproveFinanceDocRequest,
): Promise<void> {
  const res = await AdminFinanceDocService.patchRewardMsV1AdminFinanceDocsApproval(
    docId,
    payload,
  );
  unwrapRewardResponse(res);
}

export async function fetchFinancePayments(
  docId: string,
): Promise<FinancePaymentDisplayRow[]> {
  const [res, configs] = await Promise.all([
    AdminFinancePaymentService.getRewardMsV1AdminFinanceDocsFinancePayments(
      docId,
    ),
    fetchPaymentConfigs().catch(() => [] as data_PaymentConfigVO[]),
  ]);
  const data = unwrapRewardResponseNullable(res);
  const items = Array.isArray(data) ? data : [];
  return normalizeFinancePaymentRows(
    items.map((item) => item as unknown as Record<string, unknown>),
    configs,
  );
}

export async function createFinancePayment(
  docId: string,
  payload: data_CreateFinancePaymentRequest,
): Promise<void> {
  const res =
    await AdminFinancePaymentService.postRewardMsV1AdminFinanceDocsFinancePayments(
      docId,
      payload,
    );
  unwrapRewardResponse(res);
}

export async function fetchIssueRequests(params: {
  docId: string;
  page: number;
  size: number;
}): Promise<PagedResult<IssueRequestDisplayRow>> {
  const res =
    await AdminIssueRequestService.getRewardMsV1AdminFinanceDocsIssueRequests(
      params.docId,
      params.page,
      params.size,
    );
  const data = unwrapRewardResponse(res);
  const items = pageItems(data.items);
  return {
    rows: normalizeIssueRequestRows(items),
    page: data.page ?? params.page,
    size: data.size ?? params.size,
    total: data.total ?? items.length,
  };
}

export async function createIssueRequest(
  docId: string,
  payload: data_CreateIssueRequestRequest,
): Promise<void> {
  const res =
    await AdminIssueRequestService.postRewardMsV1AdminFinanceDocsIssueRequests(
      docId,
      payload,
    );
  unwrapRewardResponse(res);
}

export async function updateIssueRequest(
  docId: string,
  issueRequestId: number,
  payload: data_UpdateIssueRequestRequest,
): Promise<void> {
  const res =
    await AdminIssueRequestService.putRewardMsV1AdminFinanceDocsIssueRequests(
      docId,
      issueRequestId,
      payload,
    );
  unwrapRewardResponse(res);
}

export async function submitIssueRequest(
  docId: string,
  issueRequestId: number,
  payload: data_SubmitIssueRequestRequest,
): Promise<void> {
  const res =
    await AdminIssueRequestService.patchRewardMsV1AdminFinanceDocsIssueRequestsSubmission(
      docId,
      issueRequestId,
      payload,
    );
  unwrapRewardResponse(res);
}

export async function approveIssueRequest(
  docId: string,
  issueRequestId: number,
  payload: data_ApproveIssueRequestRequest,
): Promise<void> {
  const res =
    await AdminIssueRequestService.patchRewardMsV1AdminFinanceDocsIssueRequestsApproval(
      docId,
      issueRequestId,
      payload,
    );
  unwrapRewardResponse(res);
}

export async function fetchPaymentConfigs(): Promise<data_PaymentConfigVO[]> {
  const res = await AdminPaymentConfigService.getRewardMsV1AdminPaymentConfigs();
  const data = unwrapRewardResponseNullable(res);
  return Array.isArray(data) ? data : [];
}

export function financeDocToDisplayRow(doc: data_FinanceDocVO): FinanceDocDisplayRow {
  const row = normalizeFinanceDocRow(doc as unknown as Record<string, unknown>);
  if (!row) {
    return {
      docId: doc.doc_id ?? "—",
      projectId: doc.project_id ?? null,
      projectName: doc.project?.name ?? "",
      description: doc.description ?? "",
      status: doc.status ?? "UNKNOWN",
      creator: doc.creator ?? "—",
      createdAtLabel: "—",
      updatedAtLabel: "—",
    };
  }
  return row;
}
