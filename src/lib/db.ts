import mongoose from 'mongoose';

// Make sure we use the MONGODB_URI environment variable in production
// Only use localhost as a fallback for development
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not defined');
  throw new Error(
    'Please define the MONGODB_URI environment variable'
  );
}

// Log that we're using the MongoDB URI (without showing credentials)
const uriParts = MONGODB_URI.split('@');
if (uriParts.length > 1) {
  console.log('Using MongoDB URI with host:', uriParts[1].split('/')[0]);
} else {
  console.log('Using MongoDB URI (format cannot be determined)');
}

// Define a global mongoose connection cache
let globalMongoose = {
  conn: null as mongoose.Connection | null,
  promise: null as Promise<mongoose.Connection> | null
};

async function dbConnect() {
  // Show current connection state if we have one
  if (mongoose.connection && mongoose.connection.readyState) {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    console.log(`Current MongoDB connection state: ${states[mongoose.connection.readyState]}`);
  }

  if (globalMongoose.conn) {
    console.log('Reusing existing MongoDB connection');
    return globalMongoose.conn;
  }

  if (!globalMongoose.promise) {
    // Set mongoose options - keep these simple for better compatibility
    const opts = {
      bufferCommands: false,
    };

    try {
      console.log('Connecting to MongoDB...', new Date().toISOString());
      
      globalMongoose.promise = mongoose.connect(MONGODB_URI, opts)
        .then((mongoose) => {
          console.log('MongoDB connected successfully', new Date().toISOString());
          return mongoose.connection;
        })
        .catch(err => {
          console.error('MongoDB connection error:', err.name, err.message);
          
          // Log additional information that might help diagnose the issue
          if (err.name === 'MongoServerSelectionError') {
            console.error('Server selection timed out. Check network connectivity and IP whitelisting.');
          } else if (err.name === 'MongoNetworkError') {
            console.error('Network error occurred. Check firewall settings and network connectivity.');
          }
          
          throw err;
        });
    } catch (error: any) {
      console.error('Error setting up MongoDB connection:', error.message);
      throw error;
    }
  }
  
  try {
    globalMongoose.conn = await globalMongoose.promise;
    return globalMongoose.conn;
  } catch (error: any) {
    console.error('Error awaiting MongoDB connection:', error.message);
    throw error;
  }
}

export default dbConnect; 