import { TwitterApi } from 'twitter-api-v2';
import { env } from '@/lib/env';

// Types
export interface TwitterUser {
  id: string;
  username: string;
  name: string;
  description?: string | null;
  profile_image_url?: string | null;
}

export interface TwitterTweet {
  id: string;
  text: string;
  created_at?: string | null;
  public_metrics?: Record<string, number> | null;
  entities?: {
    urls?: Array<{ url: string; expanded_url: string }>;
    mentions?: Array<{ username: string }>;
    hashtags?: Array<{ tag: string }>;
  } | null;
}

export interface TwitterResponse {
  success: boolean;
  user?: TwitterUser;
  tweets?: TwitterTweet[];
  error?: string;
  message?: string;
}

/**
 * Create Twitter client using environment credentials
 */
function createTwitterClient(): TwitterApi | null {
  if (!env.TWITTER_API_KEY || !env.TWITTER_API_SECRET) {
    return null;
  }

  // Check if we have user context (read-write) or app-only (read-only)
  if (env.TWITTER_ACCESS_TOKEN && env.TWITTER_ACCESS_SECRET) {
    // User context (OAuth 1.0a user authentication)
    return new TwitterApi({
      appKey: env.TWITTER_API_KEY,
      appSecret: env.TWITTER_API_SECRET,
      accessToken: env.TWITTER_ACCESS_TOKEN,
      accessSecret: env.TWITTER_ACCESS_SECRET,
    });
  } else {
    // App-only (OAuth 2.0 Bearer Token)
    return new TwitterApi({
      appKey: env.TWITTER_API_KEY,
      appSecret: env.TWITTER_API_SECRET,
    });
  }
}

/**
 * Get recent tweets from a specific user
 */
export async function getRecentTweets(
  username: string,
  tweetCount: number = 10
): Promise<TwitterResponse> {
  // Check if credentials are available
  if (!env.TWITTER_API_KEY || !env.TWITTER_API_SECRET) {
    return {
      success: false,
      error: 'Twitter credentials not configured',
      message: 'Please set TWITTER_API_KEY and TWITTER_API_SECRET environment variables',
    };
  }

  try {
    const client = createTwitterClient();
    if (!client) {
      return {
        success: false,
        error: 'Failed to create Twitter client',
        message: 'Invalid credentials configuration',
      };
    }

    // Ensure we're using read-only mode for fetching tweets
    const readOnlyClient = client.readOnly;

    // First, get user by username
    const user = await readOnlyClient.v2.userByUsername(username);

    if (!user.data) {
      return {
        success: false,
        error: 'User not found',
        message: `Twitter user @${username} does not exist`,
      };
    }

    // Fetch recent tweets (exclude retweets and replies if desired)
    const tweetsResponse = await readOnlyClient.v2.userTimeline(user.data.id, {
      max_results: Math.min(tweetCount, 100), // Twitter API limit is 100 per request
      exclude: ['retweets', 'replies'], // Only original tweets
      'tweet.fields': ['created_at', 'public_metrics', 'entities'],
    });

    const tweets = tweetsResponse.data.data || [];

    return {
      success: true,
      user: {
        id: user.data.id,
        username: user.data.username,
        name: user.data.name,
        description: user.data.description,
        profile_image_url: user.data.profile_image_url,
      },
      tweets: tweets.map(tweet => ({
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at || undefined,
        public_metrics: (tweet.public_metrics as any) as Record<string, number> | undefined,
        entities: tweet.entities as TwitterTweet['entities'] || undefined,
      })),
    };
  } catch (error: unknown) {
    console.error('Twitter API error:', error);

    let errorMessage = 'Failed to fetch Twitter data';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      const err = error as { code?: string; message?: string };
      if (err.code) {
        errorMessage = `Twitter API error: ${err.code}`;
      } else if (err.message) {
        errorMessage = err.message;
      }
    }

    return {
      success: false,
      error: 'Twitter API request failed',
      message: errorMessage,
    };
  }
}

/**
 * Format tweets for display in social component
 */
export function formatTweetsForDisplay(
  user: TwitterUser,
  tweets: TwitterTweet[]
): Record<string, unknown> {
  const formattedTweets = tweets.map(tweet => {
    const formatted: Record<string, unknown> = {
      id: tweet.id,
      text: tweet.text,
      url: `https://twitter.com/${user.username}/status/${tweet.id}`,
    };

    // Format date if available
    if (tweet.created_at) {
      formatted.date = new Date(tweet.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }

    // Format metrics
    if (tweet.public_metrics) {
      formatted.metrics = {
        retweets: tweet.public_metrics.retweet_count || 0,
        replies: tweet.public_metrics.reply_count || 0,
        likes: tweet.public_metrics.like_count || 0,
        quotes: tweet.public_metrics.quote_count || 0,
      };
    } else {
      formatted.metrics = { retweets: 0, replies: 0, likes: 0, quotes: 0 };
    }

    // Extract hashtags and mentions if available
    if (tweet.entities) {
      if (tweet.entities.hashtags && tweet.entities.hashtags.length > 0) {
        formatted.hashtags = tweet.entities.hashtags.map(h => h.tag);
      }
      if (tweet.entities.mentions && tweet.entities.mentions.length > 0) {
        formatted.mentions = tweet.entities.mentions.map(m => m.username);
      }
      if (tweet.entities.urls && tweet.entities.urls.length > 0) {
        formatted.links = tweet.entities.urls.map(u => ({
          short: u.url,
          full: u.expanded_url,
        }));
      }
    }

    return formatted;
  });

  return {
    user: {
      username: user.username,
      name: user.name,
      description: user.description,
      avatar: user.profile_image_url,
    },
    tweets: formattedTweets,
    total: formattedTweets.length,
  };
}
