import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/db';
import Submission from '@/app/models/Submission';
import mongoose from 'mongoose';

const ADMIN_SECRET = 'admin-hardik-secret-key'; 

// Define a type for our stats responses
type CollectionStats = {
  error?: string;
  count?: number;
  size?: number;
  avgObjSize?: number;
  storageSize?: number;
  [key: string]: any;
};

export async function GET(req: NextRequest) {
  console.log('Create Index API called');
  
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
    
    // Create index on createdAt field
    console.log('Creating index on submissions collection...');
    
    // Ensure the model index is correctly defined
    const result = await Submission.collection.createIndex(
      { createdAt: -1 },
      { 
        background: true,
        name: "createdAt_-1"
      }
    );

    // Get all indexes for the submission collection
    const indexes = await Submission.collection.indexes();
    
    // Get collection stats using command instead of stats()
    let collectionStats: CollectionStats = { error: 'Database connection not available' };
    if (mongoose.connection.db) {
      try {
        const statsResult = await mongoose.connection.db.command({ collStats: 'submissions' });
        collectionStats = statsResult as CollectionStats;
      } catch (statsError) {
        console.error('Error getting collection stats:', statsError);
        collectionStats = { error: 'Failed to get collection stats' };
      }
    }
    
    return NextResponse.json({
      message: 'Index operation completed',
      result,
      allIndexes: indexes,
      collectionStats
    });
  } catch (error: any) {
    console.error('Index creation error:', error);
    return NextResponse.json(
      { 
        message: 'Error creating index', 
        error: error.message || String(error),
        stack: error.stack
      },
      { status: 500 }
    );
  }
} 