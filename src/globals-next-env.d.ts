export {};

declare global {
  interface Window {
    /** Set in root `layout` from server `process.env` so Preview/runtime env works without rebuild. */
    __CAMPAIGN_CENTER_API_ORIGIN__?: string;
  }

  /** Next inlines `env.NEXT_PUBLIC_*` at build time; minimal shape for app code + `tsc`. */
  // eslint-disable-next-line no-var -- global augmentation
  var process: {
    env: {
      NODE_ENV?: string;
      NEXT_PUBLIC_API_BASE_URL?: string;
      VERCEL?: string;
      VERCEL_ENV?: string;
    };
  };
}
