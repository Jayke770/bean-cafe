//@ts-nocheck
import mongoose from "mongoose";
const { MONGODB_URI, NODE_ENV } = process.env;
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
async function dbConnect() {
  if (NODE_ENV !== "production") {
    if (cached.conn) {
      return cached.conn;
    }
    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };
      cached.promise = await mongoose.connect(MONGODB_URI, opts);
    }
    try {
      cached.conn = await cached.promise;
    } catch (e) {
      cached.promise = null;
      throw e;
    }
  } else {
    cached.promise = await mongoose.connect(MONGODB_URI, opts);
  }
  return cached.conn;
}
export default dbConnect;
