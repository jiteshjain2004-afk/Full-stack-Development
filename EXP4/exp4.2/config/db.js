import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://dbuser:dbpass123@cluster0.sn8whdg.mongodb.net/?appName=Cluster0",
      {
        serverSelectionTimeoutMS: 5000,
      }
    );
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  }
};
