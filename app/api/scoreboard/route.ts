import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/db';
import User from '@/app/models/User';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Get all users with submissions
    const users = await User.find({ submittedPromptsCount: { $gt: 0 } })
      .select('username submittedPromptsCount updatedAt')
      .sort({ submittedPromptsCount: -1, updatedAt: 1 })
      .limit(100);
    
    return NextResponse.json({
      message: 'Scoreboard retrieved successfully',
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        submittedPromptsCount: user.submittedPromptsCount,
        updatedAt: user.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error retrieving scoreboard:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve scoreboard' },
      { status: 500 }
    );
  }
} 