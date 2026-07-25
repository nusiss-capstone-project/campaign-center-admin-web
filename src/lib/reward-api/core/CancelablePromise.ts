/* Re-export shared OpenAPI client runtime to avoid duplicating generated core. */
export {
  CancelablePromise,
  CancelError,
} from "@/lib/api/core/CancelablePromise";
export type { OnCancel } from "@/lib/api/core/CancelablePromise";
