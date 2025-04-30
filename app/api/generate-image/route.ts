import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/db';
import User from '@/app/models/User';
import { generateImage } from '@/app/utils/imageGeneration';

// Maximum allowed prompt length
const MAX_PROMPT_LENGTH = 1200;

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // Parse request body
    const { userId, prompt } = await req.json();
    
    // Validate inputs
    if (!userId || !prompt) {
      return NextResponse.json(
        { message: 'User ID and prompt are required' },
        { status: 400 }
      );
    }
    
    // Validate prompt length
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json(
        { message: `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters` },
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
    
    console.log(`Generating image for prompt: "${prompt}"`);
    
    // Generate image
    const imageUrl = await generateImage(prompt);
    
    // Decrease the remaining prompts count only when the image is actually used/submitted
    // We decrement the counter in the submission endpoint, not here
    
    return NextResponse.json({
      message: 'Image generated successfully',
      imageUrl,
      remainingPrompts: user.remainingPrompts
    });
  } catch (error: any) {
    console.error('Error in generate-image API:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
} 