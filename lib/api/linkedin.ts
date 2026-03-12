import axios from 'axios';
import { OAuth2 } from 'simple-oauth2';
import { env } from '@/lib/env';

// Types
export interface PositionsData {
  _total: number;
  elements: Array<{
    title: string;
    company: string;
    startDate: { year: number; month: number };
    endDate?: { year: number; month: number };
    isCurrent: boolean;
  }>;
}

export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  summary?: string;
  industry?: string;
  location?: {
    country: { code: string };
    city?: string;
    name?: string;
  };
  profilePicture?: {
    displayImage?: string;
  };
  positions?: PositionsData;
}

export interface LinkedInResponse {
  success: boolean;
  profile?: LinkedInProfile;
  error?: string;
  message?: string;
}

// LinkedIn OAuth2 configuration
const LINKEDIN_CONFIG = {
  client: {
    id: env.LINKEDIN_CLIENT_ID || '',
    secret: env.LINKEDIN_CLIENT_SECRET || '',
  },
  auth: {
    tokenHost: 'https://www.linkedin.com',
    tokenPath: '/oauth/v2/accessToken',
  },
  options: {
    bodyFormat: 'form',
    name: 'linkedin',
    authorizationMethod: 'body',
  },
};

/**
 * Get LinkedIn profile data using OAuth2
 * Uses refresh token to obtain access token and fetch profile
 */
export async function getLinkedInProfile(): Promise<LinkedInResponse> {
  // Check if credentials are available
  if (!env.LINKEDIN_CLIENT_ID || !env.LINKEDIN_CLIENT_SECRET) {
    return {
      success: false,
      error: 'LinkedIn credentials not configured',
      message: 'Please set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET environment variables',
    };
  }

  if (!process.env.LINKEDIN_REFRESH_TOKEN) {
    return {
      success: false,
      error: 'LinkedIn refresh token not configured',
      message: 'Please set LINKEDIN_REFRESH_TOKEN environment variable',
    };
  }

  try {
    // Create OAuth2 client inside function for better testability
    const oauth2 = OAuth2.create(LINKEDIN_CONFIG);

    // Get access token using refresh token
    const refreshToken = {
      refresh_token: process.env.LINKEDIN_REFRESH_TOKEN,
    };

    const accessToken = await oauth2.getAccessToken(refreshToken);

    if (!accessToken || !accessToken.token) {
      return {
        success: false,
        error: 'Failed to obtain access token',
        message: 'OAuth2 token exchange failed',
      };
    }

    // Configure axios with access token
    const linkedInApi = axios.create({
      baseURL: 'https://api.linkedin.com/v2',
      headers: {
        Authorization: `Bearer ${accessToken.token.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    // Fetch profile with positions included in projection
    const projection = '(id,firstName,lastName,headline,summary,industry,location,profilePicture(displayImage~:playableStreams),positions)';
    const profileResponse = await linkedInApi.get('/me', {
      params: { projection },
    });

    const rawData = profileResponse.data;

    // Process profile data
    const profile: LinkedInProfile = {
      id: rawData.id as string,
      firstName: getLocalizedName(rawData.firstName as Record<string, unknown>),
      lastName: getLocalizedName(rawData.lastName as Record<string, unknown>),
      headline: rawData.headline as string | undefined,
      summary: rawData.summary as string | undefined,
      industry: rawData.industry as string | undefined,
      location: rawData.location as LinkedInProfile['location'],
      profilePicture: getProfilePicture(rawData),
      positions: rawData.positions as PositionsData | undefined,
    };

    return {
      success: true,
      profile,
    };
  } catch (error: unknown) {
    console.error('LinkedIn API error:', error);
    
    let errorMessage = 'Failed to fetch LinkedIn profile';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'error' in error) {
      const err = error as { error?: { description?: string } };
      errorMessage = err.error?.description || errorMessage;
    }
    
    return {
      success: false,
      error: 'LinkedIn API request failed',
      message: errorMessage,
    };
  }
}

/**
 * Get localized name from LinkedIn name object
 */
function getLocalizedName(nameData: Record<string, unknown> | undefined): string {
  if (!nameData) return '';
  const localized = nameData['localized'] as Record<string, string> || {};
  const preferred = nameData['preferredLocale'] as { country: string; language: string } || { country: 'en_US', language: 'en' };
  const key = `${preferred.language}_${preferred.country}`;
  return localized[key] || Object.values(localized)[0] || '';
}

/**
 * Extract profile picture URL from raw data
 */
function getProfilePicture(rawData: Record<string, unknown>): LinkedInProfile['profilePicture'] {
  const picture = rawData.profilePicture as Record<string, unknown> | undefined;
  if (!picture) return undefined;
  const elements = (picture['displayImage~'] as Record<string, unknown> | undefined)?.elements as Array<{ identifiers: Array<{ identifier: string }> }> | undefined;
  if (!elements?.length) return undefined;
  return { displayImage: elements[0]?.identifiers?.[0]?.identifier };
}

/**
 * Format profile for display in About component
 */
export function formatProfileForDisplay(profile: LinkedInProfile): Record<string, string | string[]> {
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  
  const experience = profile.positions?.elements?.map(pos => {
    const dateStr = pos.isCurrent 
      ? `${pos.startDate.month}/${pos.startDate.year} - Present`
      : pos.endDate
      ? `${pos.startDate.month}/${pos.startDate.year} - ${pos.endDate.month}/${pos.endDate.year}`
      : `${pos.startDate.month}/${pos.startDate.year}`;
    return `${pos.title} at ${pos.company} (${dateStr})`;
  }) || ['No experience listed'];

  const skills: string[] = []; // LinkedIn API v2 doesn't directly provide skills without additional scopes

  return {
    name: fullName,
    headline: profile.headline || '',
    summary: profile.summary || '',
    industry: profile.industry || '',
    location: profile.location?.name || profile.location?.city || '',
    profilePicture: profile.profilePicture?.displayImage || '',
    experience,
    skills,
  };
}
