import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prompt-wars';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

console.log('MongoDB URI configuration check:', {
  isDefined: !!MONGODB_URI,
  // Show just the pattern/host part of the URI for security
  pattern: MONGODB_URI.split('@').length > 1 
    ? `mongodb+srv://<username>:<password>@${MONGODB_URI.split('@')[1]}`
    : 'local-connection'
});

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// Define interface for the mongoose cache
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare global to add mongoose property
declare global {
  var mongoose: MongooseCache | undefined;
}

// Initialize cached with a default value if global.mongoose is undefined
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// Set global.mongoose if it doesn't exist
if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    console.log('Using existing database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('Creating new database connection');
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
        throw err;
      });
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    console.error('Failed to resolve database connection:', err);
    throw err;
  }
}

export default connectDB; 