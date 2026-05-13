type GlobalWithProcessEnv = typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
};

/** Reads `process.env[name]` without requiring Node global typings (browser-safe). */
export function readPublicEnv(name: string): string | undefined {
  return (globalThis as GlobalWithProcessEnv).process?.env?.[name];
}
