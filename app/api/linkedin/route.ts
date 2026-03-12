import { NextRequest, NextResponse } from 'next/server';
import { getLinkedInProfile, formatProfileForDisplay } from '@/lib/api/linkedin';

export async function GET(request: NextRequest) {
  try {
    const result = await getLinkedInProfile();
    
    if (!result.success || !result.profile) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to fetch LinkedIn profile',
          message: result.message 
        },
        { status: 500 }
      );
    }

    const formattedProfile = formatProfileForDisplay(result.profile);
    
    return NextResponse.json({
      success: true,
      profile: result.profile,
      formatted: formattedProfile,
    });
  } catch (error) {
    console.error('LinkedIn API route error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
