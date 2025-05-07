import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/db';
import bcrypt from 'bcryptjs';
import User from '@/app/models/User';

export async function POST(req: NextRequest) {
  console.log('Login API endpoint called');
  
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database');
    
    // Parse request body
    const body = await req.json();
    const { username, password } = body;
    console.log('Login attempt for user:', username);
    
    // Validate user input
    if (!username || !password) {
      console.log('Missing username or password');
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Find user
    console.log('Finding user in database...');
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found:', username);
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    console.log('User found:', username);
    
    // Check password
    console.log('Checking password...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    console.log('Password matches');
    
    // Create user object for response
    const userObj = {
      id: typeof user._id === 'object' && user._id !== null ? user._id.toString() : String(user._id),
      username: user.username,
      remainingPrompts: user.remainingPrompts || 0,
      submittedPromptsCount: user.submittedPromptsCount || 0
    };
    
    console.log('Login successful for user:', username);
    console.log('User ID being returned:', userObj.id);
    console.log('User ID type:', typeof userObj.id);
    
    // Return success with user data (excluding password)
    return NextResponse.json({
      message: 'Login successful',
      user: userObj
    });
  } catch (error: any) {
    console.error('Error in login API:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { message: `Login failed: ${error.message}` },
      { status: 500 }
    );
  }
} 