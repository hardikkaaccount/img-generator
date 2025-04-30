import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/db';
import User from '@/app/models/User';
import Submission from '@/app/models/Submission';

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
    
    // Create submission with deleted status
    const submission = new Submission({
      userId,
      prompt,
      imageUrl,
      status: 'Deleted',
      timestamp: new Date()
    });
    
    await submission.save();
    
    // Update user (decrement remaining prompts)
    user.remainingPrompts -= 1;
    user.submissions.push(submission._id);
    await user.save();
    
    return NextResponse.json({
      message: 'Image deleted successfully',
      submissionId: submission._id,
      remainingPrompts: user.remainingPrompts
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { message: 'Failed to delete image' },
      { status: 500 }
    );
  }
} 