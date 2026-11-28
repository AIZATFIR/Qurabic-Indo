export function formatMaqamGloss(value: string): string {
  return value.replace(/_/g, ' ').replace(/\s*;\s*/g, ' · ').replace(/\s+/g, ' ').trim();
}
