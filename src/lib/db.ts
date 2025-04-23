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

// Define a global mongoose connection cache
let globalMongoose = {
  conn: null as mongoose.Connection | null,
  promise: null as Promise<mongoose.Connection> | null
};

async function dbConnect() {
  if (globalMongoose.conn) {
    return globalMongoose.conn;
  }

  if (!globalMongoose.promise) {
    const opts = {
      bufferCommands: false,
      connectTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000, // Increase socket timeout
      serverSelectionTimeoutMS: 60000, // Longer server selection timeout
      ssl: true, // Use SSL
      retryWrites: true,
      retryReads: true,
      maxIdleTimeMS: 120000, // Keep connections alive longer
    };

    try {
      console.log('Connecting to MongoDB...', new Date().toISOString());
      console.log('MongoDB URI format check:', MONGODB_URI.substring(0, 20) + '...');
      
      globalMongoose.promise = mongoose.connect(MONGODB_URI, opts)
        .then((mongoose) => {
          console.log('MongoDB connected successfully', new Date().toISOString());
          return mongoose.connection;
        })
        .catch(err => {
          console.error('MongoDB connection error:', err.name, err.message);
          console.error('Connection stack:', err.stack);
          
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
      console.error('Setup error stack:', error.stack);
      throw error;
    }
  }
  
  try {
    globalMongoose.conn = await globalMongoose.promise;
    return globalMongoose.conn;
  } catch (error: any) {
    console.error('Error awaiting MongoDB connection:', error.message);
    console.error('Await error stack:', error.stack);
    throw error;
  }
}

export default dbConnect; 