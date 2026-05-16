type ClerkTokenGetter = () => Promise<string | null>;

let clerkTokenGetter: ClerkTokenGetter | null = null;
let clerkAuthInitialized = false;
let waiters: Array<() => void> = [];

export function setClerkTokenGetter(getter: ClerkTokenGetter | null) {
  clerkTokenGetter = getter;
  clerkAuthInitialized = true;
  waiters.forEach((resolve) => resolve());
  waiters = [];
}

export function resetClerkTokenGetter() {
  clerkTokenGetter = null;
  clerkAuthInitialized = false;
}

async function waitForClerkAuthInitialized(): Promise<void> {
  if (clerkAuthInitialized) return;
  await Promise.race([
    new Promise<void>((resolve) => {
      waiters.push(resolve);
    }),
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, 1500);
    }),
  ]);
}

export async function getClerkAuthToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    await waitForClerkAuthInitialized();
  }
  return clerkTokenGetter ? clerkTokenGetter() : null;
}

export async function withClerkAuthorization(
  headers: Headers,
): Promise<Headers> {
  if (!headers.has("Authorization")) {
    const token = await getClerkAuthToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}

export async function fetchWithClerkAuthorization(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const headers = new Headers(init?.headers);
  await withClerkAuthorization(headers);
  return fetch(input, { ...init, headers });
}
