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
    
    // Validate inputs - image URL is required, prompt is optional for deletes
    if (!userId || !imageUrl) {
      return NextResponse.json(
        { message: 'User ID and image URL are required' },
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
    
    // Create submission with deleted status
    const submission = new Submission({
      userId,
      prompt: prompt || 'Deleted draft',
      imageUrl,
      status: 'Deleted',
      timestamp: new Date()
    }) as SubmissionDocument;
    
    await submission.save();
    
    // Instead of decrementing prompts, we give one back since this is a deletion
    if (user.remainingPrompts < 5) { // Assuming 5 is the max
      user.remainingPrompts += 1;
    }
    
    // Only add to submissions array if it exists
    if (Array.isArray(user.submissions)) {
      user.submissions.push(submission._id);
    }
    
    await user.save();
    
    return NextResponse.json({
      message: 'Image deleted successfully',
      submissionId: submission._id.toString(),
      remainingPrompts: user.remainingPrompts
    });
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { message: 'Failed to delete image', error: error.message },
      { status: 500 }
    );
  }
} 