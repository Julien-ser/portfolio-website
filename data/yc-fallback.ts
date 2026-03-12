/**
 * Fallback YC data when scraping fails
 * This is hardcoded data to display if the live scraper encounters errors
 */

import { YCCompany, YCResponse } from '@/lib/api/yc';

export type { YCCompany };

export const YC_FALLBACK_DATA: YCCompany[] = [
  {
    name: "No YC Affiliation Found",
    slug: "no-results",
    url: "https://www.ycombinator.com",
    description: "No Y Combinator company affiliation found for Julien Serbanescu. This could mean the person hasn't started a YC company yet, or the information isn't publicly available.",
    batch: "N/A",
    founders: [],
    industry: "N/A",
  },
];

/**
 * Get fallback data as a formatted response
 */
export function getFallbackResponse(): YCResponse {
  return {
    success: true,
    source: "fallback",
    companies: YC_FALLBACK_DATA,
    message: "Using fallback data - YC scraper unavailable or no results found",
    timestamp: new Date().toISOString(),
  };
}
