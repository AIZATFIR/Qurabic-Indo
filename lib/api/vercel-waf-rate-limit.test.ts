import test from 'node:test';
import assert from 'node:assert/strict';
import { isVercelWafRateLimitEnabled } from './vercel-waf-rate-limit';

test('Quran Foundation proxy protection requires a WAF attestation in production', () => {
  assert.equal(isVercelWafRateLimitEnabled({ VERCEL: '1' }), false);
  assert.equal(isVercelWafRateLimitEnabled({ NODE_ENV: 'production' }), false);
  assert.equal(isVercelWafRateLimitEnabled({ NODE_ENV: 'production', QURABIC_VERCEL_WAF_RATE_LIMIT: 'false' }), false);
  assert.equal(isVercelWafRateLimitEnabled({ NODE_ENV: 'production', QURABIC_VERCEL_WAF_RATE_LIMIT: 'true' }), true);
});

test('local development does not require a production WAF setting', () => {
  assert.equal(isVercelWafRateLimitEnabled({}), true);
  assert.equal(isVercelWafRateLimitEnabled({ NODE_ENV: 'development' }), true);
});
