export function isVercelWafRateLimitEnabled(
  environment: Record<string, string | undefined> = process.env,
): boolean {
  const isProduction = environment.NODE_ENV === 'production' || environment.VERCEL === '1';
  return !isProduction || environment.QURABIC_VERCEL_WAF_RATE_LIMIT === 'true';
}
