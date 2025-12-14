import mongoose from "mongoose";

const ResumeScanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    atsScore: { type: Number, required: true },
    sectionScores: {
      skills: Number,
      experience: Number,
      projects: Number,
      education: Number,
      keywords: Number,
      grammar: Number
    },
    missingSkills: [String],
    scanDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("ResumeScan", ResumeScanSchema);
