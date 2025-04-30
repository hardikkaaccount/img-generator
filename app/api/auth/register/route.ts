import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/db';
import User from '@/app/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // Parse request body
    const { username, password } = await req.json();
    
    // Validate user input
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Username already exists' },
        { status: 409 }
      );
    }
    
    // Create user
    const user = new User({
      username,
      password,
      remainingPrompts: 5,
      submittedPromptsCount: 0,
      submissions: []
    });
    
    await user.save();
    
    // Return success
    return NextResponse.json(
      { 
        message: 'User registered successfully',
        userId: user._id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 