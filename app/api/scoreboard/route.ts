import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/db';
import User from '@/app/models/User';

export async function GET(req: NextRequest) {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database successfully');
    
    // Get all users with submissions
    console.log('Querying users with submissions...');
    const users = await User.find({ submittedPromptsCount: { $gt: 0 } })
      .select('username submittedPromptsCount updatedAt')
      .sort({ submittedPromptsCount: -1, updatedAt: 1 })
      .limit(100);
    
    console.log(`Found ${users.length} users with submissions`);
    
    // Log the first few users for debugging
    if (users.length > 0) {
      console.log('Sample user data:', JSON.stringify(users[0]));
    }
    
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