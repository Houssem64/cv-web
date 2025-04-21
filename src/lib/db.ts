import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
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