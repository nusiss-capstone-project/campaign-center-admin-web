export function parseRouteId(
  raw: string | string[] | undefined,
): number {
  if (typeof raw === "string") return Number(raw);
  if (Array.isArray(raw)) return Number(raw[0]);
  return Number.NaN;
}

export function isValidRouteId(id: number): boolean {
  return Number.isFinite(id) && id > 0;
}
