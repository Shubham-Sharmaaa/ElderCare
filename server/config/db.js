import mongoose from "mongoose";

export async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log("[DB] Mongo connected:", mongoose.connection.name);
  } catch (err) {
    console.error("[DB] connection error", err);
    process.exit(1);
  }
}
