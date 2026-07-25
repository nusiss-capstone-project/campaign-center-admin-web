/* Re-export shared OpenAPI client runtime to avoid duplicating generated core. */
export {
  base64,
  catchErrorCodes,
  getFormData,
  getHeaders,
  getQueryString,
  getRequestBody,
  getResponseBody,
  getResponseHeader,
  isBlob,
  isDefined,
  isFormData,
  isString,
  isStringWithValue,
  request,
  resolve,
  sendRequest,
} from "@/lib/api/core/request";
