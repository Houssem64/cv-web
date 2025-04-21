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
    };

    try {
      console.log('Connecting to MongoDB...');
      globalMongoose.promise = mongoose.connect(MONGODB_URI, opts)
        .then((mongoose) => {
          console.log('MongoDB connected successfully');
          return mongoose.connection;
        })
        .catch(err => {
          console.error('MongoDB connection error:', err);
          throw err;
        });
    } catch (error) {
      console.error('Error setting up MongoDB connection:', error);
      throw error;
    }
  }
  
  try {
    globalMongoose.conn = await globalMongoose.promise;
    return globalMongoose.conn;
  } catch (error) {
    console.error('Error awaiting MongoDB connection:', error);
    throw error;
  }
}

export default dbConnect; 