import mongoose from 'mongoose';

// Make sure we use the MONGODB_URI environment variable in production
// Only use localhost as a fallback for development
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
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

    globalMongoose.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose.connection;
      });
  }
  
  globalMongoose.conn = await globalMongoose.promise;
  return globalMongoose.conn;
}

export default dbConnect; 