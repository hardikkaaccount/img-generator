import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/db';
import User from '@/app/models/User';
import Submission from '@/app/models/Submission';
import mongoose from 'mongoose';
import crypto from 'crypto';

const ADMIN_SECRET = 'admin-hardik-secret-key';

// Function to generate random password
function generateRandomPassword(length = 10) {
  return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex')
    .slice(0, length);
}

export async function GET(req: NextRequest) {
  console.log('Reset Database API called');
  
  try {
    const url = new URL(req.url);
    const adminKey = url.searchParams.get('adminKey');
    
    // Require confirmation parameter to prevent accidental resets
    const confirmReset = url.searchParams.get('confirm') === 'yes';
    
    if (!adminKey || adminKey !== ADMIN_SECRET) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!confirmReset) {
      return NextResponse.json({
        message: 'Reset not confirmed. Add confirm=yes to URL parameters to proceed with database reset.'
      });
    }
    
    // Connect to database
    console.log('Connecting to database...');
    await connectDB();
    
    // Step 1: Delete all submissions
    console.log('Deleting all submissions...');
    const deletedSubmissions = await Submission.deleteMany({});
    console.log(`Deleted ${deletedSubmissions.deletedCount} submissions`);
    
    // Step 2: Delete all users
    console.log('Deleting all users...');
    const deletedUsers = await User.deleteMany({});
    console.log(`Deleted ${deletedUsers.deletedCount} users`);
    
    // Step 3: Create 60 new warrior users
    console.log('Creating 60 new warrior users...');
    const warriorUsers = [];
    const userCredentials = [];
    
    for (let i = 1; i <= 60; i++) {
      const username = `Warrior ${i}`;
      const password = generateRandomPassword();
      
      // Store credentials to return them
      userCredentials.push({ username, password });
      
      // Create user in database
      warriorUsers.push({
        username,
        password,
        remainingPrompts: 5,
        submittedPromptsCount: 0,
        submissions: []
      });
    }
    
    // Insert all users at once
    const createdUsers = await User.insertMany(warriorUsers);
    console.log(`Created ${createdUsers.length} new warrior users`);
    
    return NextResponse.json({
      message: 'Database reset successfully',
      stats: {
        deletedSubmissions: deletedSubmissions.deletedCount,
        deletedUsers: deletedUsers.deletedCount,
        createdUsers: createdUsers.length
      },
      // Return credentials so you can distribute them
      credentials: userCredentials,
      // Also return as CSV format for easy copy/paste
      csv: userCredentials.map(cred => `${cred.username},${cred.password}`).join('\n')
    });
  } catch (error: any) {
    console.error('Database reset error:', error);
    return NextResponse.json(
      { 
        message: 'Error resetting database', 
        error: error.message || String(error),
        stack: error.stack
      },
      { status: 500 }
    );
  }
} 