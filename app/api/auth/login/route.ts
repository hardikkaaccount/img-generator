import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/db';
import bcrypt from 'bcryptjs';
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
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Return success with user data (excluding password)
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        remainingPrompts: user.remainingPrompts,
        submittedPromptsCount: user.submittedPromptsCount
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 