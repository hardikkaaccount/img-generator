import { NextRequest, NextResponse } from 'next/server';

// Simply disable the registration functionality
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { message: 'Registration is closed. Please use your provided warrior credentials to log in.' },
    { status: 403 }
  );
} 