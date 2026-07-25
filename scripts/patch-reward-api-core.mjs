import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const coreDir = join(root, "src/lib/reward-api/core");

const files = {
  "ApiError.ts": `/* Re-export shared OpenAPI client runtime to avoid duplicating generated core. */
export { ApiError } from "@/lib/api/core/ApiError";
`,
  "ApiRequestOptions.ts": `/* Re-export shared OpenAPI client runtime to avoid duplicating generated core. */
export type { ApiRequestOptions } from "@/lib/api/core/ApiRequestOptions";
`,
  "ApiResult.ts": `/* Re-export shared OpenAPI client runtime to avoid duplicating generated core. */
export type { ApiResult } from "@/lib/api/core/ApiResult";
`,
  "CancelablePromise.ts": `/* Re-export shared OpenAPI client runtime to avoid duplicating generated core. */
export {
  CancelablePromise,
  CancelError,
} from "@/lib/api/core/CancelablePromise";
export type { OnCancel } from "@/lib/api/core/CancelablePromise";
`,
  "request.ts": `/* Re-export shared OpenAPI client runtime to avoid duplicating generated core. */
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
`,
  "OpenAPI.ts": `import type { OpenAPIConfig as SharedOpenAPIConfig } from "@/lib/api/core/OpenAPI";

/** Same shape as shared OpenAPIConfig; separate instance so reward-ms keeps its own BASE/TOKEN. */
export type OpenAPIConfig = SharedOpenAPIConfig;

export const OpenAPI: OpenAPIConfig = {
  BASE: "",
  VERSION: "",
  WITH_CREDENTIALS: false,
  CREDENTIALS: "include",
  TOKEN: undefined,
  USERNAME: undefined,
  PASSWORD: undefined,
  HEADERS: undefined,
  ENCODE_PATH: undefined,
};
`,
};

for (const [name, contents] of Object.entries(files)) {
  writeFileSync(join(coreDir, name), contents);
}

console.log("Patched src/lib/reward-api/core to re-export shared api/core runtime.");
