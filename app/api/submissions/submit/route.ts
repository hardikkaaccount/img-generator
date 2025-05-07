import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/db';
import User from '@/app/models/User';
import Submission from '@/app/models/Submission';
import { Document } from 'mongoose';

interface SubmissionDocument extends Document {
  _id: any; // Using any for the _id to avoid TypeScript errors
  userId: string;
  prompt: string;
  imageUrl: string;
  status: string;
  timestamp: Date;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // Parse request body
    const { userId, prompt, imageUrl } = await req.json();
    
    // Validate inputs
    if (!userId || !prompt || !imageUrl) {
      return NextResponse.json(
        { message: 'User ID, prompt, and image URL are required' },
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
    
    // Check if user has remaining prompts
    if (user.remainingPrompts <= 0) {
      return NextResponse.json(
        { message: 'No remaining prompts available' },
        { status: 403 }
      );
    }
    
    // Create submission
    const submission = new Submission({
      userId,
      prompt,
      imageUrl,
      status: 'Submitted',
      timestamp: new Date()
    }) as SubmissionDocument;
    
    await submission.save();
    
    // Update user (decrement remaining prompts, increment submitted count)
    user.remainingPrompts -= 1;
    user.submittedPromptsCount += 1;
    
    // Only add to submissions array if it exists
    if (Array.isArray(user.submissions)) {
    user.submissions.push(submission._id);
    }
    
    await user.save();
    
    return NextResponse.json({
      message: 'Image submitted successfully',
      submissionId: submission._id.toString(),
      remainingPrompts: user.remainingPrompts
    });
  } catch (error: any) {
    console.error('Error submitting image:', error);
    return NextResponse.json(
      { message: 'Failed to submit image', error: error.message },
      { status: 500 }
    );
  }
} 