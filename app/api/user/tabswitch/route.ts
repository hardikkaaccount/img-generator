import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/db';
import User from '@/app/models/User';
import mongoose from 'mongoose';

// API endpoint to increment tab switches counter for a logged-in user
export async function POST(req: NextRequest) {
  console.log('Tab switch API called');
  
  try {
    const body = await req.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }
    
    console.log(`Incrementing tab switch count for user: ${userId}`);
    
    // Connect to database
    await connectDB();
    
    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: 'Invalid user ID format' },
        { status: 400 }
      );
    }
    
    // Find user and increment tab switches count
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { tabSwitches: 1 } },
      { new: true }
    );
    
    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log(`User ${userId} tab switches updated to: ${updatedUser.tabSwitches}`);
    
    return NextResponse.json({
      message: 'Tab switch recorded successfully',
      tabSwitches: updatedUser.tabSwitches
    });
  } catch (error: any) {
    console.error('Error updating tab switches:', error);
    return NextResponse.json(
      { 
        message: 'Failed to update tab switches', 
        error: error.message 
      },
      { status: 500 }
    );
  }
} 