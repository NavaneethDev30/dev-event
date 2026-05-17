import mongoose from "mongoose";

type MongooseConnection = typeof mongoose;

type MongooseCache = {
  conn: MongooseConnection | null;
  promise: Promise<MongooseConnection> | null;
};

declare global {
  // Reuse the same cache across hot reloads in development.
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongooseCache ??=
  {
    conn: null,
    promise: null,
  };

export async function connectToDatabase(): Promise<MongooseConnection> {
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error("Please define the MONGODB_URI environment variable in .env.local");
  }

  if (cached.conn) {
    return cached.conn;
  }

  // Share the in-flight connection attempt so parallel requests do not open duplicates.
  cached.promise ??= mongoose.connect(mongodbUri, {
    bufferCommands: false,
  });

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}
