import { chromium, Browser } from 'playwright';
import { getFallbackResponse } from '@/data/yc-fallback';

// Types
export interface YCCompany {
  name: string;
  slug: string;
  url: string;
  description?: string;
  batch?: string;
  founders?: string[];
  logoUrl?: string;
  industry?: string;
}

export interface YCResponse {
  success: boolean;
  source: 'live' | 'fallback';
  companies: YCCompany[];
  message?: string;
  error?: string;
  timestamp: string;
}

/**
 * Y Combinator Company Profile Scraper
 * Uses Playwright to search YC's company directory for a specific person
 */
export async function searchYCombinatorCompanies(query: string = "Julien Serbanescu"): Promise<YCResponse> {
  let browser: Browser | null = null;

  try {
    // Launch browser in headless mode
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });

    // Navigate to YC companies page
    const baseUrl = 'https://www.ycombinator.com';
    await page.goto(`${baseUrl}/companies`, { waitUntil: 'networkidle' });

    // Wait for search input to be available
    await page.waitForSelector('input[type="search"]', { timeout: 10000 });

    // Enter search query
    await page.fill('input[type="search"]', query);
    await page.press('input[type="search"]', 'Enter');

    // Wait for results to load
    await page.waitForTimeout(2000);

    // Extract company data from the page
    const companies = await page.evaluate((): any[] => {
      const results: any[] = [];

      // YC uses company cards with specific class names
      const companyCards = document.querySelectorAll('[data-testid="company-card"], .CompanyCard, .company-card');

      companyCards.forEach((card) => {
        try {
          const nameEl = card.querySelector('h3, .company-name, [class*="name"]');
          const linkEl = card.querySelector('a[href*="/companies/"]');
          const descEl = card.querySelector('.company-description, [class*="description"]');
          const batchEl = card.querySelector('.batch, [class*="batch"]');
          const logoEl = card.querySelector('img');

          const name = nameEl?.textContent?.trim() || '';
          const href = linkEl?.getAttribute('href') || '';
          const description = descEl?.textContent?.trim() || '';
          const batch = batchEl?.textContent?.trim() || '';
          const logoUrl = logoEl?.getAttribute('src') || '';

          if (name) {
            results.push({
              name,
              slug: href.split('/').pop() || '',
              url: href.startsWith('http') ? href : `https://www.ycombinator.com${href}`,
              description,
              batch,
              logoUrl,
            });
          }
        } catch (e) {
          console.error('Error parsing company card:', e);
        }
      });

      return results;
    });

    // Close browser
    await browser.close();
    browser = null;

    // Process results
    if (companies.length === 0) {
      return {
        success: true,
        source: 'live',
        companies: [],
        message: `No companies found for query: "${query}"`,
        timestamp: new Date().toISOString(),
      } as YCResponse;
    }

    // Enhance company data with founder extraction (requires additional page visits)
    const enhancedCompanies = await enhanceWithFounderData(companies);

    return {
      success: true,
      source: 'live',
      companies: enhancedCompanies,
      message: `Found ${enhancedCompanies.length} company(s) matching "${query}"`,
      timestamp: new Date().toISOString(),
    } as YCResponse;

  } catch (error) {
    console.error('YC scraper error:', error);

    // If browser is still open, close it
    if (browser) {
      await browser.close();
    }

    // Return fallback data on error
    console.warn('YC scraper failed, using fallback data');
    return getFallbackResponse() as YCResponse;
  }
}

/**
 * Visit each company page to extract founder information
 */
async function enhanceWithFounderData(companies: any[]): Promise<YCCompany[]> {
  return await Promise.allSettled(
    companies.map(async (company): Promise<YCCompany> => {
      try {
        // For performance, skip detailed scraping if we don't have a URL
        if (!company.url || company.slug === 'no-results') {
          return {
            ...company,
            founders: [],
            industry: undefined,
          };
        }

        // We could visit each company page, but for now, we'll just keep the basic info
        // In a production system, you might add caching or only visit top N results
        return {
          ...company,
          founders: [], // Would be populated by visiting company page
          industry: undefined,
        };
      } catch (error) {
        console.error(`Failed to enhance company ${company.name}:`, error);
        return {
          ...company,
          founders: [],
          industry: undefined,
        };
      }
    })
  ).then(results => {
    return results
      .filter((result): result is PromiseFulfilledResult<YCCompany> => result.status === 'fulfilled')
      .map(result => result.value);
  });
}

/**
 * Quick search that returns only company names and URLs
 */
export async function quickYCSearch(query: string = "Julien Serbanescu"): Promise<YCCompany[]> {
  const result = await searchYCombinatorCompanies(query);
  return result.companies;
}
