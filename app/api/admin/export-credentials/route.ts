import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/db';
import User from '@/app/models/User';

const ADMIN_SECRET = 'admin-hardik-secret-key';

export async function GET(req: NextRequest) {
  console.log('Export Credentials API called');
  
  try {
    const url = new URL(req.url);
    const adminKey = url.searchParams.get('adminKey');
    
    // Check admin authentication
    if (!adminKey || adminKey !== ADMIN_SECRET) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Connect to database
    console.log('Connecting to database...');
    await connectDB();
    
    // Get all users with just username and password fields
    // Note: We typically shouldn't expose passwords, but in this special case
    // we need to provide the credentials to the warriors
    const users = await User.find({})
      .select('username password remainingPrompts submittedPromptsCount')
      .lean();
    
    console.log(`Found ${users.length} users`);
    
    // Format as CSV
    let csv = 'Username,Password,Remaining Prompts,Submitted Prompts\n';
    
    users.forEach(user => {
      csv += `${user.username},${user.password},${user.remainingPrompts},${user.submittedPromptsCount}\n`;
    });
    
    // Also provide structured data
    const userList = users.map(user => ({
      username: user.username,
      password: user.password, // This is already hashed in the database
      stats: {
        remainingPrompts: user.remainingPrompts,
        submittedPromptsCount: user.submittedPromptsCount
      }
    }));
    
    return NextResponse.json({
      message: 'User credentials exported successfully',
      users: userList,
      csv: csv,
      count: users.length
    });
  } catch (error: any) {
    console.error('Error exporting credentials:', error);
    return NextResponse.json(
      { 
        message: 'Error exporting credentials', 
        error: error.message || String(error),
        stack: error.stack
      },
      { status: 500 }
    );
  }
} 