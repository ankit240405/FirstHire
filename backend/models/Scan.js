import mongoose from "mongoose";

const ScanSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  result: { type: Object, required: true }
});

export default mongoose.model("Scan", ScanSchema);
