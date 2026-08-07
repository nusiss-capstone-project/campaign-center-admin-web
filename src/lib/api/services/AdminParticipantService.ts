/* Hand-maintained for admin participant APIs (campaign-center-api). */
import type { data_StandardResponse } from "../models/data_StandardResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class AdminParticipantService {
  /**
   * List campaign participants (admin)
   * @param campaignId Campaign ID
   * @returns data_StandardResponse success
   * @throws ApiError
   */
  public static getAdminCampaignsUsers(
    campaignId: number,
  ): CancelablePromise<data_StandardResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/admin/campaigns/{campaignId}/users",
      path: {
        campaignId: campaignId,
      },
      errors: {
        400: `bad request`,
        404: `campaign not found`,
        503: `database unavailable`,
      },
    });
  }

  /**
   * Get campaign participant detail (admin)
   * @param campaignId Campaign ID
   * @param userId User ID
   * @returns data_StandardResponse success
   * @throws ApiError
   */
  public static getAdminCampaignsUsers1(
    campaignId: number,
    userId: number,
  ): CancelablePromise<data_StandardResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/admin/campaigns/{campaignId}/users/{userId}",
      path: {
        campaignId: campaignId,
        userId: userId,
      },
      errors: {
        400: `bad request`,
        404: `not found`,
        503: `database unavailable`,
      },
    });
  }
}
