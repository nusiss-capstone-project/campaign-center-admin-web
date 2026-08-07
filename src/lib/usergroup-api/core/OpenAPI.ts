import type { OpenAPIConfig as SharedOpenAPIConfig } from "@/lib/api/core/OpenAPI";

/** Same shape as shared OpenAPIConfig; separate instance so usergroup-ms keeps its own BASE/TOKEN. */
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
