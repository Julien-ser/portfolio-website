import { NextRequest, NextResponse } from 'next/server';
import { getRecentTweets, formatTweetsForDisplay, TwitterResponse } from '@/lib/api/twitter';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');
    const count = searchParams.get('count');

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username parameter is required' },
        { status: 400 }
      );
    }

    const tweetCount = count ? Math.min(parseInt(count, 10), 100) : 10;

    const result: TwitterResponse = await getRecentTweets(username, tweetCount);

    if (!result.success || !result.tweets) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to fetch tweets',
          message: result.message,
        },
        { status: 500 }
      );
    }

    const formattedTweets = result.user
      ? formatTweetsForDisplay(result.user, result.tweets)
      : { tweets: result.tweets };

    return NextResponse.json({
      success: true,
      user: result.user,
      tweets: result.tweets,
      formatted: formattedTweets,
    });
  } catch (error) {
    console.error('Twitter API route error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
