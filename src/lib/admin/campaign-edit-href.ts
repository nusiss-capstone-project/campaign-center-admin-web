/** Path to the campaign version editor (no side effects). */
export function campaignEditHref(campaignId: number): string {
  return `/admin/campaigns/${campaignId}/edit`;
}
