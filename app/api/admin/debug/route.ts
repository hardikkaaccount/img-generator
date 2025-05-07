import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/db';
import User from '@/app/models/User';
import Submission from '@/app/models/Submission';
import mongoose from 'mongoose';

const ADMIN_SECRET = 'admin-hardik-secret-key'; 

interface CountStats {
  users: number;
  submissions: number;
}

interface DiagnosisResult {
  hasSortError: boolean;
  message?: string;
  code?: number;
  potentialSolution: string;
}

interface DebugStats {
  count: CountStats;
  collections: string[];
  connectionState: string;
  sortError?: {
    message: string;
    code?: number;
  };
  serverInfo: {
    memory: NodeJS.MemoryUsage;
    nodeVersion: string;
    platform: string;
  };
}

export async function GET(req: NextRequest) {
  console.log('Debug API called');
  
  try {
    const url = new URL(req.url);
    const adminKey = url.searchParams.get('adminKey');
    
    // Check if the request includes the admin key
    if (!adminKey || adminKey !== ADMIN_SECRET) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Connect to database
    console.log('Connecting to database...');
    await connectDB();
    
    // Get database information
    const connectionState = mongoose.connection.readyState;
    const stateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized'
    };
    
    // Basic stats with correct type definitions
    const stats: DebugStats = {
      count: {
        users: 0,
        submissions: 0
      },
      collections: [],
      connectionState: stateMap[connectionState as keyof typeof stateMap] || 'unknown',
      serverInfo: {
        memory: process.memoryUsage(),
        nodeVersion: process.version,
        platform: process.platform
      }
    };
    
    // Collection information
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      stats.collections = collections.map(c => c.name);
    }
    
    // Just get counts to avoid TypeScript issues with document shapes
    try {
      stats.count.users = await User.countDocuments();
    } catch (e) {
      console.error('Error counting users:', e);
    }
    
    try {
      stats.count.submissions = await Submission.countDocuments();
    } catch (e) {
      console.error('Error counting submissions:', e);
    }
    
    // Check for specific MongoDB errors
    let sortError = false;
    let sortErrorDetails = null;
    try {
      // Try to execute the problematic sort query with a very small limit
      await Submission.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();
    } catch (error: any) {
      sortError = true;
      sortErrorDetails = {
        message: error.message,
        code: error.code
      };
      stats.sortError = sortErrorDetails;
    }
    
    // Check indexes
    const indexes: any[] = [];
    try {
      if (mongoose.connection.db) {
        const indexArr = await mongoose.connection.db.collection('submissions').indexes();
        indexArr.forEach((idx: any) => {
          indexes.push({
            name: idx.name,
            key: idx.key
          });
        });
      }
    } catch (e) {
      console.error('Error getting indexes:', e);
    }
    
    // Diagnosis object with proper typing
    const diagnosis: DiagnosisResult = {
      hasSortError: sortError,
      potentialSolution: sortError ? 
        "MongoDB sort is exceeding memory limit. The API now uses 'allowDiskUse' option with aggregation to solve this." : 
        "No sort error detected"
    };
    
    if (sortErrorDetails) {
      diagnosis.message = sortErrorDetails.message;
      diagnosis.code = sortErrorDetails.code;
    }
    
    return NextResponse.json({
      ...stats,
      indexes,
      diagnosis
    });
  } catch (error: any) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { 
        message: 'Error in debug API', 
        error: error.message || String(error),
        stack: error.stack
      },
      { status: 500 }
    );
  }
} 