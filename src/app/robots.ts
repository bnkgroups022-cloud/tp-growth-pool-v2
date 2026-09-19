import type { MetadataRoute } from 'next';

// This is a private member platform, not a marketing site — keep it out of
// search indexes entirely.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', disallow: '/' },
  };
}
