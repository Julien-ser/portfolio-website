import { getLinkedInProfile, formatProfileForDisplay, LinkedInProfile } from '../lib/api/linkedin';

describe('LinkedIn API Client', () => {
  beforeEach(() => {
    // Reset environment for each test
    delete process.env.LINKEDIN_CLIENT_ID;
    delete process.env.LINKEDIN_CLIENT_SECRET;
    delete process.env.LINKEDIN_REFRESH_TOKEN;
  });

  describe('getLinkedInProfile', () => {
    test('should return error when client ID is missing', async () => {
      const result = await getLinkedInProfile();
      expect(result.success).toBe(false);
      expect(result.error).toBe('LinkedIn credentials not configured');
    });

    test('should return error when client secret is missing', async () => {
      process.env.LINKEDIN_CLIENT_ID = 'test-id';
      const result = await getLinkedInProfile();
      expect(result.success).toBe(false);
      expect(result.error).toBe('LinkedIn credentials not configured');
    });

    test('should return error when refresh token is missing', async () => {
      process.env.LINKEDIN_CLIENT_ID = 'test-id';
      process.env.LINKEDIN_CLIENT_SECRET = 'test-secret';
      const result = await getLinkedInProfile();
      expect(result.success).toBe(false);
      expect(result.error).toBe('LinkedIn refresh token not configured');
    });

    test('should attempt OAuth2 flow when credentials are present', async () => {
      process.env.LINKEDIN_CLIENT_ID = 'test-id';
      process.env.LINKEDIN_CLIENT_SECRET = 'test-secret';
      process.env.LINKEDIN_REFRESH_TOKEN = 'test-refresh-token';

      // Mock the OAuth2 client
      const mockOAuth2Instance = {
        getAccessToken: jest.fn().mockResolvedValue({ token: { access_token: 'mock-access-token' } }),
      };
      const OAuth2Class = require('simple-oauth2');
      jest.spyOn(OAuth2Class, 'create').mockReturnValue(mockOAuth2Instance);

      // Mock axios
      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({
          data: {
            id: '123',
            firstName: { localized: { en_US: 'John' }, preferredLocale: { country: 'US', language: 'en' } },
            lastName: { localized: { en_US: 'Doe' }, preferredLocale: { country: 'US', language: 'en' } },
            headline: 'Software Engineer',
            summary: 'Experienced developer',
            industry: 'Technology',
            location: { country: { code: 'US' }, city: 'San Francisco', name: 'San Francisco, CA' },
            profilePicture: {
              'displayImage~': {
                elements: [{ identifiers: [{ identifier: 'https://example.com/profile.jpg' }] }],
              },
            },
            positions: {
              _total: 1,
              elements: [
                {
                  title: 'Senior Engineer',
                  company: 'Tech Co',
                  startDate: { year: 2020, month: 6 },
                  isCurrent: true,
                },
              ],
            },
          },
        }),
      };
      jest.spyOn(require('axios'), 'create').mockReturnValue(mockAxiosInstance);

      const result = await getLinkedInProfile();

      expect(result.success).toBe(true);
      expect(result.profile).toBeDefined();
      expect(result.profile?.firstName).toBe('John');
      expect(result.profile?.lastName).toBe('Doe');
      expect(result.profile?.headline).toBe('Software Engineer');
    });
  });

  describe('formatProfileForDisplay', () => {
    const mockProfile: LinkedInProfile = {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      headline: 'Software Engineer',
      summary: 'Experienced developer with a passion for building great products.',
      industry: 'Technology',
      location: { country: { code: 'US' }, city: 'San Francisco', name: 'San Francisco, CA' },
      profilePicture: { displayImage: 'https://example.com/profile.jpg' },
      positions: {
        _total: 2,
        elements: [
          {
            title: 'Senior Engineer',
            company: 'Tech Co',
            startDate: { year: 2020, month: 6 },
            isCurrent: true,
          },
          {
            title: 'Engineer',
            company: 'StartUp Inc',
            startDate: { year: 2018, month: 1 },
            endDate: { year: 2020, month: 5 },
            isCurrent: false,
          },
        ],
      },
    };

    test('should format full name correctly', () => {
      const formatted = formatProfileForDisplay(mockProfile);
      expect(formatted.name).toBe('John Doe');
    });

    test('should include headline', () => {
      const formatted = formatProfileForDisplay(mockProfile);
      expect(formatted.headline).toBe('Software Engineer');
    });

    test('should format experience with current position indicator', () => {
      const formatted = formatProfileForDisplay(mockProfile);
      expect(formatted.experience).toContain('Senior Engineer at Tech Co (6/2020 - Present)');
      expect(formatted.experience).toContain('Engineer at StartUp Inc (1/2018 - 5/2020)');
    });

    test('should include location', () => {
      const formatted = formatProfileForDisplay(mockProfile);
      expect(formatted.location).toBe('San Francisco, CA');
    });

    test('should include profile picture URL', () => {
      const formatted = formatProfileForDisplay(mockProfile);
      expect(formatted.profilePicture).toBe('https://example.com/profile.jpg');
    });

    test('should handle profile with no positions', () => {
      const profileNoPositions = { ...mockProfile, positions: undefined };
      const formatted = formatProfileForDisplay(profileNoPositions);
      expect(formatted.experience).toEqual(['No experience listed']);
    });

    test('should handle missing optional fields gracefully', () => {
      const minimalProfile: LinkedInProfile = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
      };
      const formatted = formatProfileForDisplay(minimalProfile);
      expect(formatted.name).toBe('John Doe');
      expect(formatted.headline).toBe('');
      expect(formatted.summary).toBe('');
      expect(formatted.industry).toBe('');
      expect(formatted.location).toBe('');
      expect(formatted.profilePicture).toBe('');
      expect(formatted.experience).toEqual(['No experience listed']);
      expect(formatted.skills).toEqual([]);
    });
  });
});
