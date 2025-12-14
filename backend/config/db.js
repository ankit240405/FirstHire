import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "resumeapp",
    });

    console.log("MongoDB Connected ✔");
  } catch (err) {
    console.error("MongoDB Connection Error", err.message);
    throw err;
  }
}
