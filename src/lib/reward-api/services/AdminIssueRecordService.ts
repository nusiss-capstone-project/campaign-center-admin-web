/* Hand-maintained for admin issue-record APIs. */
import type { data_BaseResponse } from "../models/data_BaseResponse";
import type { data_IssueRecordVO } from "../models/data_IssueRecordVO";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class AdminIssueRecordService {
  /**
   * List issue records by project and user
   */
  public static getRewardMsV1AdminIssueRecordsProjectsUsers(
    projectId: number,
    userId: number,
  ): CancelablePromise<
    data_BaseResponse & {
      data?: data_IssueRecordVO[];
    }
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/reward-ms/v1/admin/issue-records/projects/{project_id}/users/{user_id}",
      path: {
        project_id: projectId,
        user_id: userId,
      },
      errors: {
        400: `Bad Request`,
        500: `Internal Server Error`,
      },
    });
  }
}
