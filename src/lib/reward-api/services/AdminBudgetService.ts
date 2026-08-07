/* Hand-maintained for admin budget APIs. */
import type { data_BaseResponse } from "../models/data_BaseResponse";
import type { data_BudgetVO } from "../models/data_BudgetVO";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class AdminBudgetService {
  /**
   * List project budgets by finance doc
   */
  public static getRewardMsV1AdminFinanceDocsProjectBudgets(
    docId: string,
  ): CancelablePromise<
    data_BaseResponse & {
      data?: data_BudgetVO[];
    }
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/reward-ms/v1/admin/finance-docs/{doc_id}/project-budgets",
      path: {
        doc_id: docId,
      },
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * List issue budgets by issue request
   */
  public static getRewardMsV1AdminIssueRequestsIssueBudgets(
    issueRequestId: number,
  ): CancelablePromise<
    data_BaseResponse & {
      data?: data_BudgetVO[];
    }
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/reward-ms/v1/admin/issue-requests/{issue_request_id}/issue-budgets",
      path: {
        issue_request_id: issueRequestId,
      },
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }
}
