import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/app/utils/imageGeneration';

// Maximum allowed prompt length
const MAX_PROMPT_LENGTH = 500;

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { prompt } = await req.json();
    
    // Validate inputs
    if (!prompt) {
      return NextResponse.json(
        { message: 'Prompt is required' },
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
    
    console.log(`Generating image for prompt: "${prompt}"`);
    
    // Generate image
    const imageUrl = await generateImage(prompt);
    
    return NextResponse.json({
      message: 'Image generated successfully',
      imageUrl
    });
  } catch (error: any) {
    console.error('Error in generate API:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
} 