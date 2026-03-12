import { getRecentTweets, formatTweetsForDisplay, TwitterUser, TwitterTweet } from '../lib/api/twitter';

// Mock the twitter-api-v2 module
const mockReadOnlyClient = {
  v2: {
    userByUsername: jest.fn(),
    userTimeline: jest.fn(),
  },
};

const mockTwitterClientInstance = {
  readOnly: mockReadOnlyClient,
};

jest.mock('twitter-api-v2', () => {
  return {
    TwitterApi: jest.fn().mockImplementation(() => mockTwitterClientInstance),
  };
});

describe('Twitter API Client', () => {
  beforeEach(() => {
    // Reset environment and mocks
    delete process.env.TWITTER_API_KEY;
    delete process.env.TWITTER_API_SECRET;
    delete process.env.TWITTER_ACCESS_TOKEN;
    delete process.env.TWITTER_ACCESS_SECRET;

    // Clear mock calls
    jest.clearAllMocks();
    mockReadOnlyClient.v2.userByUsername.mockClear();
    mockReadOnlyClient.v2.userTimeline.mockClear();
  });

  describe('getRecentTweets', () => {
    test('should return error when API key is missing', async () => {
      const result = await getRecentTweets('julien');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Twitter credentials not configured');
    });

    test('should return error when API secret is missing', async () => {
      process.env.TWITTER_API_KEY = 'test-key';
      const result = await getRecentTweets('julien');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Twitter credentials not configured');
    });

    test('should attempt to fetch tweets when credentials are present', async () => {
      process.env.TWITTER_API_KEY = 'test-key';
      process.env.TWITTER_API_SECRET = 'test-secret';

      mockReadOnlyClient.v2.userByUsername.mockResolvedValue({
        data: {
          id: '12345',
          username: 'julien',
          name: 'Julien Serbanescu',
          description: 'Developer',
          profile_image_url: 'https://example.com/avatar.jpg',
        },
      });

      mockReadOnlyClient.v2.userTimeline.mockResolvedValue({
        data: {
          data: [
            {
              id: 'tweet1',
              text: 'Hello world!',
              created_at: '2024-01-15T10:30:00Z',
              public_metrics: {
                retweet_count: 5,
                reply_count: 10,
                like_count: 50,
                quote_count: 2,
              },
              entities: {
                hashtags: [{ tag: 'coding' }],
                mentions: [{ username: 'testuser' }],
                urls: [{ url: 'https://short.url', expanded_url: 'https://full.url' }],
              },
            },
          ],
        },
      });

      const result = await getRecentTweets('julien', 5);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.username).toBe('julien');
      expect(result.tweets).toHaveLength(1);
      expect(result.tweets?.[0].text).toBe('Hello world!');
    });

    test('should return error when user is not found', async () => {
      process.env.TWITTER_API_KEY = 'test-key';
      process.env.TWITTER_API_SECRET = 'test-secret';

      mockReadOnlyClient.v2.userByUsername.mockResolvedValue({ data: null });

      const result = await getRecentTweets('nonexistent');

      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found');
    });

    test('should handle API errors gracefully', async () => {
      process.env.TWITTER_API_KEY = 'test-key';
      process.env.TWITTER_API_SECRET = 'test-secret';

      mockReadOnlyClient.v2.userByUsername.mockRejectedValue(new Error('Rate limit exceeded'));

      const result = await getRecentTweets('julien');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Twitter API request failed');
      expect(result.message).toContain('Rate limit exceeded');
    });

    test('should limit tweet count to 100 (API limit)', async () => {
      process.env.TWITTER_API_KEY = 'test-key';
      process.env.TWITTER_API_SECRET = 'test-secret';

      mockReadOnlyClient.v2.userByUsername.mockResolvedValue({
        data: {
          id: '12345',
          username: 'julien',
          name: 'Julien Serbanescu',
        },
      });

      await getRecentTweets('julien', 150);

      expect(mockReadOnlyClient.v2.userTimeline).toHaveBeenCalledWith(
        '12345',
        expect.objectContaining({
          max_results: 100,
          exclude: ['retweets', 'replies'],
        })
      );
    });
  });

  describe('formatTweetsForDisplay', () => {
    const mockUser: TwitterUser = {
      id: '123',
      username: 'julien',
      name: 'Julien Serbanescu',
      description: 'Full stack developer',
      profile_image_url: 'https://example.com/avatar.jpg',
    };

    const mockTweets: TwitterTweet[] = [
      {
        id: 'tweet1',
        text: 'Check out my latest project! #coding',
        created_at: '2024-01-15T10:30:00Z',
        public_metrics: {
          retweet_count: 5,
          reply_count: 10,
          like_count: 50,
          quote_count: 2,
        },
        entities: {
          hashtags: [{ tag: 'coding' }],
          mentions: [{ username: 'github' }],
          urls: [{ url: 'https://short.url', expanded_url: 'https://full.url' }],
        },
      },
      {
        id: 'tweet2',
        text: 'Another tweet without metrics',
        created_at: '2024-01-14T15:45:00Z',
        entities: undefined,
      },
    ];

    test('should format tweets correctly', () => {
      const formatted = formatTweetsForDisplay(mockUser, mockTweets);

      expect(formatted.user).toBeDefined();
      expect((formatted.user as any).username).toBe('julien');
      expect((formatted.user as any).name).toBe('Julien Serbanescu');
      expect((formatted.user as any).description).toBe('Full stack developer');
      expect((formatted.user as any).avatar).toBe('https://example.com/avatar.jpg');
      expect(formatted.total).toBe(2);
      expect((formatted.tweets as any[])).toHaveLength(2);
    });

    test('should include tweet metrics', () => {
      const formatted = formatTweetsForDisplay(mockUser, mockTweets);
      const firstTweet = (formatted.tweets as any[])[0];

      expect(firstTweet.metrics).toBeDefined();
      expect(firstTweet.metrics.retweets).toBe(5);
      expect(firstTweet.metrics.replies).toBe(10);
      expect(firstTweet.metrics.likes).toBe(50);
      expect(firstTweet.metrics.quotes).toBe(2);
    });

    test('should handle missing metrics', () => {
      const formatted = formatTweetsForDisplay(mockUser, mockTweets);
      const secondTweet = (formatted.tweets as any[])[1];

      expect(secondTweet.metrics).toBeDefined();
      expect(secondTweet.metrics.retweets).toBe(0);
      expect(secondTweet.metrics.replies).toBe(0);
      expect(secondTweet.metrics.likes).toBe(0);
      expect(secondTweet.metrics.quotes).toBe(0);
    });

    test('should extract hashtags and mentions', () => {
      const formatted = formatTweetsForDisplay(mockUser, mockTweets);
      const firstTweet = (formatted.tweets as any[])[0];

      expect(firstTweet.hashtags).toEqual(['coding']);
      expect(firstTweet.mentions).toEqual(['github']);
      expect(firstTweet.links).toEqual([{ short: 'https://short.url', full: 'https://full.url' }]);
    });

    test('should handle tweets without entities', () => {
      const formatted = formatTweetsForDisplay(mockUser, mockTweets);
      const secondTweet = (formatted.tweets as any[])[1];

      expect(secondTweet.hashtags).toBeUndefined();
      expect(secondTweet.mentions).toBeUndefined();
      expect(secondTweet.links).toBeUndefined();
    });

    test('should create correct tweet URLs', () => {
      const formatted = formatTweetsForDisplay(mockUser, mockTweets);
      const tweets = formatted.tweets as any[];

      expect(tweets[0].url).toBe('https://twitter.com/julien/status/tweet1');
      expect(tweets[1].url).toBe('https://twitter.com/julien/status/tweet2');
    });

    test('should format dates correctly', () => {
      const formatted = formatTweetsForDisplay(mockUser, mockTweets);
      const firstTweet = (formatted.tweets as any[])[0];

      expect(firstTweet.date).toBeDefined();
      expect(typeof firstTweet.date).toBe('string');
    });

    test('should handle tweet with missing created_at', () => {
      const tweetNoDate: TwitterTweet = {
        id: 'tweet3',
        text: 'No date tweet',
      };
      const formatted = formatTweetsForDisplay(mockUser, [tweetNoDate]);
      const tweet = (formatted.tweets as any[])[0];

      expect(tweet.date).toBeUndefined();
    });

    test('should handle user with minimal data', () => {
      const minimalUser: TwitterUser = {
        id: '123',
        username: 'julien',
        name: 'Julien',
      };
      const formatted = formatTweetsForDisplay(minimalUser, mockTweets);

      expect((formatted.user as any).description).toBeUndefined();
      expect((formatted.user as any).avatar).toBeUndefined();
    });
  });
});
