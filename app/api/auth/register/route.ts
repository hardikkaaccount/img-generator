import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/db';
import User from '@/app/models/User';

export async function POST(req: NextRequest) {
  console.log('Register API endpoint called');
  
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database');
    
    // Parse request body
    const body = await req.json();
    const { username, password } = body;
    console.log('Registration attempt for user:', username);
    
    // Validate user input
    if (!username || !password) {
      console.log('Missing username or password');
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    console.log('Checking if username exists:', username);
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Username already exists:', username);
      return NextResponse.json(
        { message: 'Username already exists' },
        { status: 409 }
      );
    }
    
    // Create user
    console.log('Creating new user:', username);
    const user = new User({
      username,
      password,
      remainingPrompts: 5,
      submittedPromptsCount: 0,
      submissions: []
    });
    
    console.log('Saving user to database...');
    await user.save();
    console.log('User saved to database:', user._id.toString());
    
    // Return success
    return NextResponse.json(
      { 
        message: 'User registered successfully',
        userId: user._id.toString()
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in register API:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { message: `Registration failed: ${error.message}` },
      { status: 500 }
    );
  }
} 