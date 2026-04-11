import mongoose from "mongoose";

export async function connectDB(mongoUri) {
  if (!mongoUri) {
    throw new Error("MONGO_URI is required.");
  }
  await mongoose.connect(mongoUri);
}
