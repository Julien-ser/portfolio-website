import { NextRequest, NextResponse } from 'next/server';
import { searchYCombinatorCompanies } from '@/lib/api/yc';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'Julien Serbanescu';

    const result = await searchYCombinatorCompanies(query);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('YC API error:', error);

    return NextResponse.json(
      {
        success: false,
        source: 'fallback',
        companies: [],
        message: 'Failed to fetch YC data',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
