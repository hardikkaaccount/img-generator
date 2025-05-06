import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/db';
import User from '@/app/models/User';
import Submission from '@/app/models/Submission';
import { Document } from 'mongoose';

interface SubmissionDocument extends Document {
  _id: any; // Using any for the _id to avoid TypeScript errors
  prompt: string;
  imageUrl: string;
  status?: string;
  timestamp?: Date;
}

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
      submissions: submissions.map((submission: SubmissionDocument) => ({
        id: submission._id.toString(),
        prompt: submission.prompt,
        imageUrl: submission.imageUrl,
        status: submission.status || 'Submitted',
        timestamp: submission.timestamp || new Date()
      })),
      remainingPrompts: user.remainingPrompts || 0,
      submittedPromptsCount: user.submittedPromptsCount || 0
    });
  } catch (error: any) {
    console.error('Error retrieving submissions:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve submissions', error: error.message },
      { status: 500 }
    );
  }
} 