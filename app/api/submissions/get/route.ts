import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/db';
import User from '@/app/models/User';
import Submission from '@/app/models/Submission';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Get userId from URL
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get all submissions for the user
    const submissions = await Submission.find({ userId }).sort({ timestamp: -1 });
    
    return NextResponse.json({
      message: 'Submissions retrieved successfully',
      submissions: submissions.map(submission => ({
        id: submission._id,
        prompt: submission.prompt,
        imageUrl: submission.imageUrl,
        status: submission.status,
        timestamp: submission.timestamp
      })),
      remainingPrompts: user.remainingPrompts,
      submittedPromptsCount: user.submittedPromptsCount
    });
  } catch (error) {
    console.error('Error retrieving submissions:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve submissions' },
      { status: 500 }
    );
  }
} 