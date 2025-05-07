import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/db';
import User from '@/app/models/User';
import Submission from '@/app/models/Submission';
import mongoose from 'mongoose';

// This is a simple admin auth check - in production you would use a more secure method
const ADMIN_SECRET = 'admin-hardik-secret-key'; // You should set this in your .env file

export async function GET(req: NextRequest) {
  console.log('Admin submissions API called');
  
  try {
    const url = new URL(req.url);
    const adminKey = url.searchParams.get('adminKey');
    
    // Pagination parameters
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const skip = (page - 1) * limit;
    
    console.log('Admin key provided:', adminKey ? 'Yes' : 'No');
    console.log(`Pagination: page ${page}, limit ${limit}, skip ${skip}`);
    
    // Check if the request includes the admin key
    if (!adminKey || adminKey !== ADMIN_SECRET) {
      console.log('Unauthorized access attempt');
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Connect to database
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database');
    
    // Get total count first (this is lightweight)
    let totalCount = 0;
    try {
      totalCount = await Submission.countDocuments({ status: 'Submitted' });
      console.log(`Total submissions: ${totalCount}`);
    } catch (countError) {
      console.error('Error counting submissions:', countError);
    }
    
    // Get all submissions with their associated usernames
    console.log('Fetching submissions...');
    let submissions = [];
    try {
      // Method 1: Use aggregation with allowDiskUse option (for very large collections)
      if (totalCount > 1000) {
        console.log('Using aggregation pipeline with disk use enabled due to large collection size');
        submissions = await Submission.aggregate([
          { $match: { status: 'Submitted' } },
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit }
        ], { allowDiskUse: true }).exec();
      } 
      // Method 2: Standard find with skip/limit for smaller collections
      else {
        console.log('Using standard find with skip/limit for smaller collection');
        submissions = await Submission.find({ status: 'Submitted' })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
      }
      
      console.log(`Found ${submissions.length} submissions for this page`);
    } catch (subError) {
      console.error('Error fetching submissions:', subError);
      
      // Emergency fallback - get submissions without sorting
      try {
        console.log('Attempting emergency fallback without sorting...');
        submissions = await Submission.find({ status: 'Submitted' })
          .limit(50) // Very limited result set in emergency
          .lean();
        console.log(`Found ${submissions.length} submissions with fallback method`);
      } catch (fallbackError) {
        console.error('Fallback fetch also failed:', fallbackError);
        return NextResponse.json(
          { 
            message: 'Error fetching submissions', 
            error: String(subError),
            fallbackError: String(fallbackError)
          },
          { status: 500 }
        );
      }
    }
    
    if (submissions.length === 0) {
      console.log('No submissions found');
      return NextResponse.json({
        message: 'No submissions found',
        submissions: [],
        totalCount: 0,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        }
      });
    }
    
    // Get user details for each submission
    console.log('Extracting user IDs...');
    // Filter out any invalid or undefined userIds
    const validSubmissions = submissions.filter(sub => sub && sub.userId);
    const userIds = Array.from(
      new Set(validSubmissions.map(sub => String(sub.userId)))
    );
    console.log(`Found ${userIds.length} unique user IDs`);
    
    // Get user details
    console.log('Fetching user details...');
    let users: Array<{_id: any, username?: string}> = [];
    try {
      if (userIds.length > 0) {
        users = await User.find({ _id: { $in: userIds } })
          .select('_id username')
          .lean();
      }
      console.log(`Found ${users.length} users`);
    } catch (userError) {
      console.error('Error fetching users:', userError);
      // Continue with partial data
    }
    
    // Create a map of userId -> username for quick lookup
    console.log('Creating user map...');
    const userMap: Record<string, string> = {};
    users.forEach(user => {
      if (user && user._id) {
        const userId = String(user._id);
        userMap[userId] = user.username || 'Unknown';
      }
    });
    
    // Enhance submissions with username
    console.log('Enhancing submissions with usernames...');
    const enhancedSubmissions = validSubmissions.map(sub => {
      try {
        const subId = sub._id ? String(sub._id) : 'unknown-id';
        const userId = sub.userId ? String(sub.userId) : 'unknown-user';
        
        return {
          id: subId,
          prompt: sub.prompt || 'No prompt provided',
          imageUrl: sub.imageUrl || '',
          status: sub.status || 'Submitted',
          timestamp: sub.timestamp || sub.createdAt || new Date(),
          userId: userId,
          username: userMap[userId] || 'Unknown User'
        };
      } catch (mapError) {
        console.error('Error mapping submission:', mapError, sub);
        // Return a placeholder object if mapping fails
        return {
          id: 'error-' + Math.random().toString(36).substr(2, 9),
          prompt: 'Error processing submission',
          imageUrl: '',
          status: 'Error',
          timestamp: new Date(),
          userId: 'error',
          username: 'Error'
        };
      }
    });
    
    console.log('Successfully processed submissions');
    return NextResponse.json({
      message: 'Submissions retrieved successfully',
      submissions: enhancedSubmissions,
      totalCount: totalCount,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error: any) {
    console.error('Error retrieving admin submissions:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        message: 'Failed to retrieve submissions', 
        error: error.message || String(error),
        stack: error.stack
      },
      { status: 500 }
    );
  }
} 